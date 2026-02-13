"""
GitHub API service module.
Wraps GitHub REST API v3 with rate-limit awareness.
Docs: https://docs.github.com/en/rest
Rate limit: 60 requests/hour (unauthenticated), 5000/hour (authenticated)
"""
import requests
import time
import os
from datetime import datetime, timezone

GITHUB_API_BASE = 'https://api.github.com'

# Simple rate-limit tracker
_last_request_time = 0
_MIN_INTERVAL = 0.1  # 100ms between requests


def _get_headers(access_token=None):
    """Build request headers. Uses per-user token or server token."""
    headers = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    }
    token = access_token or os.environ.get('GITHUB_TOKEN', '')
    if token:
        headers['Authorization'] = f'Bearer {token}'
    return headers


def _rate_limited_get(url, params=None, access_token=None):
    """Make a GET request to the GitHub API with rate limiting."""
    global _last_request_time
    now = time.time()
    elapsed = now - _last_request_time
    if elapsed < _MIN_INTERVAL:
        time.sleep(_MIN_INTERVAL - elapsed)

    response = requests.get(
        url,
        params=params,
        headers=_get_headers(access_token),
        timeout=15
    )
    _last_request_time = time.time()

    if response.status_code == 404:
        raise Exception('GitHub user not found')
    if response.status_code == 403:
        remaining = response.headers.get('X-RateLimit-Remaining', '?')
        raise Exception(f'GitHub API rate limit hit (remaining: {remaining}). Try again later.')
    response.raise_for_status()
    return response.json()


def fetch_user(username, access_token=None):
    """
    Fetch user profile from GitHub.
    Returns dict with: login, id, avatar_url, html_url, name, company,
    blog, location, bio, public_repos, public_gists, followers, following, created_at.
    """
    return _rate_limited_get(f'{GITHUB_API_BASE}/users/{username}', access_token=access_token)


def fetch_user_repos(username, sort='updated', per_page=10, access_token=None):
    """
    Fetch user's public repositories sorted by last update.
    Returns list of repo objects.
    """
    params = {
        'sort': sort,
        'direction': 'desc',
        'per_page': per_page,
        'type': 'owner',
    }
    return _rate_limited_get(
        f'{GITHUB_API_BASE}/users/{username}/repos',
        params=params,
        access_token=access_token
    )


def fetch_user_events(username, per_page=30, access_token=None):
    """
    Fetch user's recent public events (commits, PRs, issues, etc.).
    Returns list of event objects.
    """
    params = {'per_page': per_page}
    return _rate_limited_get(
        f'{GITHUB_API_BASE}/users/{username}/events/public',
        params=params,
        access_token=access_token
    )


def fetch_repo_languages(username, repo_name, access_token=None):
    """
    Fetch language breakdown for a repository.
    Returns dict like: {"Python": 45000, "JavaScript": 12000}
    """
    return _rate_limited_get(
        f'{GITHUB_API_BASE}/repos/{username}/{repo_name}/languages',
        access_token=access_token
    )


def compute_top_languages(repos, access_token=None):
    """
    Compute aggregated language stats across all repos.
    Returns sorted list: [{"name": "Python", "percentage": 45.2, "bytes": 120000}, ...]
    """
    language_bytes = {}
    for repo in repos[:15]:  # Limit to 15 repos to avoid rate limits
        try:
            langs = fetch_repo_languages(
                repo['owner']['login'],
                repo['name'],
                access_token=access_token
            )
            for lang, byte_count in langs.items():
                language_bytes[lang] = language_bytes.get(lang, 0) + byte_count
        except Exception:
            continue

    total = sum(language_bytes.values()) or 1
    result = [
        {
            'name': lang,
            'percentage': round((count / total) * 100, 1),
            'bytes': count,
        }
        for lang, count in language_bytes.items()
    ]
    result.sort(key=lambda x: x['bytes'], reverse=True)
    return result[:10]  # Top 10 languages


def compute_top_repos(repos, limit=6):
    """
    Extract top repos by stargazers count.
    Returns simplified repo list for frontend display.
    """
    sorted_repos = sorted(repos, key=lambda r: r.get('stargazers_count', 0), reverse=True)
    return [
        {
            'name': r['name'],
            'full_name': r['full_name'],
            'description': r.get('description', '') or '',
            'html_url': r['html_url'],
            'language': r.get('language', '') or '',
            'stargazers_count': r.get('stargazers_count', 0),
            'forks_count': r.get('forks_count', 0),
            'updated_at': r.get('updated_at', ''),
            'fork': r.get('fork', False),
        }
        for r in sorted_repos[:limit]
        if not r.get('fork', False)
    ]


def parse_events_to_activity(events, limit=20):
    """
    Parse GitHub events into a simplified activity feed.
    Returns list of activity items for the feed.
    """
    activities = []
    for event in events[:limit]:
        event_type = event.get('type', '')
        repo = event.get('repo', {}).get('name', '')
        created_at = event.get('created_at', '')
        payload = event.get('payload', {})

        if event_type == 'PushEvent':
            commits = payload.get('commits', [])
            commit_count = len(commits)
            commit_msg = commits[-1].get('message', '').split('\n')[0] if commits else ''
            activities.append({
                'type': 'push',
                'repo': repo,
                'message': f'Pushed {commit_count} commit{"s" if commit_count != 1 else ""} to {repo}',
                'detail': commit_msg,
                'commit_count': commit_count,
                'created_at': created_at,
            })
        elif event_type == 'PullRequestEvent':
            action = payload.get('action', '')
            pr = payload.get('pull_request', {})
            title = pr.get('title', '')
            activities.append({
                'type': 'pull_request',
                'repo': repo,
                'message': f'{action.capitalize()} PR in {repo}: {title}',
                'detail': title,
                'action': action,
                'pr_number': pr.get('number'),
                'created_at': created_at,
            })
        elif event_type == 'IssuesEvent':
            action = payload.get('action', '')
            issue = payload.get('issue', {})
            title = issue.get('title', '')
            activities.append({
                'type': 'issue',
                'repo': repo,
                'message': f'{action.capitalize()} issue in {repo}: {title}',
                'detail': title,
                'action': action,
                'issue_number': issue.get('number'),
                'created_at': created_at,
            })
        elif event_type == 'CreateEvent':
            ref_type = payload.get('ref_type', '')
            ref = payload.get('ref', '') or ''
            activities.append({
                'type': 'create',
                'repo': repo,
                'message': f'Created {ref_type} {ref} in {repo}' if ref else f'Created {ref_type} {repo}',
                'detail': '',
                'ref_type': ref_type,
                'created_at': created_at,
            })
        elif event_type == 'WatchEvent':
            activities.append({
                'type': 'star',
                'repo': repo,
                'message': f'Starred {repo}',
                'detail': '',
                'created_at': created_at,
            })
        elif event_type == 'ForkEvent':
            forkee = payload.get('forkee', {})
            activities.append({
                'type': 'fork',
                'repo': repo,
                'message': f'Forked {repo}',
                'detail': forkee.get('full_name', ''),
                'created_at': created_at,
            })

    return activities


def count_event_stats(events):
    """
    Count total commits, PRs, and issues from recent events.
    Returns dict with counts.
    """
    stats = {'commits': 0, 'prs': 0, 'issues': 0}
    for event in events:
        event_type = event.get('type', '')
        payload = event.get('payload', {})
        if event_type == 'PushEvent':
            stats['commits'] += len(payload.get('commits', []))
        elif event_type == 'PullRequestEvent':
            stats['prs'] += 1
        elif event_type == 'IssuesEvent':
            stats['issues'] += 1
    return stats
