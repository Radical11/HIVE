import hashlib
import hmac
import json

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings

from .models import GitHubProfile
from .serializers import GitHubProfileSerializer, LinkGitHubSerializer
from . import github
from feed.models import Post


class LinkGitHubView(APIView):
    """
    POST /api/github/link/
    Body: { "username": "octocat", "access_token": "" }
    Links a GitHub account to the current user and syncs stats.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LinkGitHubSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        access_token = serializer.validated_data.get('access_token', '')

        # Verify the GitHub user exists
        try:
            gh_data = github.fetch_user(username, access_token=access_token)
        except Exception as e:
            return Response(
                {'error': f'Could not find GitHub user "{username}": {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch repos for language stats and top repos
        try:
            repos = github.fetch_user_repos(username, per_page=30, access_token=access_token)
        except Exception:
            repos = []

        top_languages = []
        if repos:
            try:
                top_languages = github.compute_top_languages(repos, access_token=access_token)
            except Exception:
                pass

        top_repos = github.compute_top_repos(repos) if repos else []

        # Fetch events for activity stats
        try:
            events = github.fetch_user_events(username, access_token=access_token)
            event_stats = github.count_event_stats(events)
        except Exception:
            event_stats = {'commits': 0, 'prs': 0, 'issues': 0}

        # Calculate total stars
        total_stars = sum(r.get('stargazers_count', 0) for r in repos) if repos else 0

        # Parse created_at
        created_at = None
        if gh_data.get('created_at'):
            from django.utils.dateparse import parse_datetime
            created_at = parse_datetime(gh_data['created_at'])

        # Create or update profile
        profile, created = GitHubProfile.objects.update_or_create(
            user=request.user,
            defaults={
                'github_username': gh_data.get('login', username),
                'github_id': gh_data.get('id'),
                'avatar_url': gh_data.get('avatar_url', ''),
                'html_url': gh_data.get('html_url', ''),
                'bio': gh_data.get('bio', '') or '',
                'company': gh_data.get('company', '') or '',
                'location': gh_data.get('location', '') or '',
                'blog': gh_data.get('blog', '') or '',
                'public_repos': gh_data.get('public_repos', 0),
                'public_gists': gh_data.get('public_gists', 0),
                'followers': gh_data.get('followers', 0),
                'following': gh_data.get('following', 0),
                'total_commits': event_stats['commits'],
                'total_prs': event_stats['prs'],
                'total_issues': event_stats['issues'],
                'total_stars_received': total_stars,
                'top_languages': top_languages,
                'top_repos': top_repos,
                'access_token': access_token,
                'github_created_at': created_at,
            }
        )

        # Also update the github_handle in UserProfile
        user_profile = getattr(request.user, 'profile', None)
        if user_profile:
            user_profile.github_handle = gh_data.get('login', username)
            user_profile.save(update_fields=['github_handle'])

        return Response(
            GitHubProfileSerializer(profile).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class GitHubProfileView(APIView):
    """GET /api/github/profile/ — get linked GitHub profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = GitHubProfile.objects.get(user=request.user)
        except GitHubProfile.DoesNotExist:
            return Response(
                {'error': 'No GitHub profile linked. Use /api/github/link/ first.'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(GitHubProfileSerializer(profile).data)


class GitHubSyncView(APIView):
    """POST /api/github/sync/ — refresh GitHub stats from GitHub API."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            profile = GitHubProfile.objects.get(user=request.user)
        except GitHubProfile.DoesNotExist:
            return Response(
                {'error': 'No GitHub profile linked.'},
                status=status.HTTP_404_NOT_FOUND
            )

        token = profile.access_token or None

        try:
            gh_data = github.fetch_user(profile.github_username, access_token=token)
        except Exception as e:
            return Response(
                {'error': f'GitHub API error: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # Fetch repos
        try:
            repos = github.fetch_user_repos(profile.github_username, per_page=30, access_token=token)
        except Exception:
            repos = []

        top_languages = []
        if repos:
            try:
                top_languages = github.compute_top_languages(repos, access_token=token)
            except Exception:
                pass

        top_repos = github.compute_top_repos(repos) if repos else []

        # Events
        try:
            events = github.fetch_user_events(profile.github_username, access_token=token)
            event_stats = github.count_event_stats(events)
        except Exception:
            event_stats = {'commits': 0, 'prs': 0, 'issues': 0}

        total_stars = sum(r.get('stargazers_count', 0) for r in repos) if repos else 0

        profile.avatar_url = gh_data.get('avatar_url', profile.avatar_url)
        profile.html_url = gh_data.get('html_url', profile.html_url)
        profile.bio = gh_data.get('bio', '') or profile.bio
        profile.company = gh_data.get('company', '') or profile.company
        profile.location = gh_data.get('location', '') or profile.location
        profile.blog = gh_data.get('blog', '') or profile.blog
        profile.public_repos = gh_data.get('public_repos', profile.public_repos)
        profile.public_gists = gh_data.get('public_gists', profile.public_gists)
        profile.followers = gh_data.get('followers', profile.followers)
        profile.following = gh_data.get('following', profile.following)
        profile.total_commits = event_stats['commits']
        profile.total_prs = event_stats['prs']
        profile.total_issues = event_stats['issues']
        profile.total_stars_received = total_stars
        profile.top_languages = top_languages
        profile.top_repos = top_repos
        profile.save()

        return Response(GitHubProfileSerializer(profile).data)


class GitHubEventsView(APIView):
    """GET /api/github/events/ — get recent GitHub activity for the linked user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = GitHubProfile.objects.get(user=request.user)
        except GitHubProfile.DoesNotExist:
            return Response(
                {'error': 'No GitHub profile linked.'},
                status=status.HTTP_404_NOT_FOUND
            )

        token = profile.access_token or None

        try:
            events = github.fetch_user_events(profile.github_username, access_token=token)
            activities = github.parse_events_to_activity(events)
        except Exception as e:
            return Response(
                {'error': f'GitHub API error: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY
            )

        return Response({'activities': activities})


class GitHubReposView(APIView):
    """GET /api/github/repos/ — get repositories for the linked user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = GitHubProfile.objects.get(user=request.user)
        except GitHubProfile.DoesNotExist:
            return Response(
                {'error': 'No GitHub profile linked.'},
                status=status.HTTP_404_NOT_FOUND
            )

        token = profile.access_token or None

        try:
            repos = github.fetch_user_repos(
                profile.github_username,
                per_page=int(request.query_params.get('per_page', 10)),
                access_token=token
            )
        except Exception as e:
            return Response(
                {'error': f'GitHub API error: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY
            )

        simplified = github.compute_top_repos(repos, limit=int(request.query_params.get('per_page', 10)))
        return Response({'repos': simplified})


class GitHubPublicProfileView(APIView):
    """GET /api/github/user/<username>/ — get any GitHub user's public profile (no auth required)."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, username):
        try:
            gh_data = github.fetch_user(username)
        except Exception as e:
            return Response(
                {'error': f'Could not find GitHub user "{username}": {str(e)}'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            repos = github.fetch_user_repos(username, per_page=10)
        except Exception:
            repos = []

        top_repos = github.compute_top_repos(repos) if repos else []

        return Response({
            'login': gh_data.get('login'),
            'avatar_url': gh_data.get('avatar_url'),
            'html_url': gh_data.get('html_url'),
            'bio': gh_data.get('bio', ''),
            'company': gh_data.get('company', ''),
            'location': gh_data.get('location', ''),
            'public_repos': gh_data.get('public_repos', 0),
            'followers': gh_data.get('followers', 0),
            'following': gh_data.get('following', 0),
            'top_repos': top_repos,
        })


class GitHubWebhookView(APIView):
    """
    POST /api/github/webhook/
    Receives GitHub webhook events and auto-creates feed posts.

    Setup: In your GitHub repo settings → Webhooks → Add webhook:
      - Payload URL: https://your-domain.com/api/github/webhook/
      - Content type: application/json
      - Secret: (set GITHUB_WEBHOOK_SECRET in your env)
      - Events: Push, Pull Request, Issues
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Verify webhook signature
        secret = getattr(settings, 'GITHUB_WEBHOOK_SECRET', '')
        if secret:
            signature = request.META.get('HTTP_X_HUB_SIGNATURE_256', '')
            if not signature:
                return Response({'error': 'Missing signature'}, status=status.HTTP_403_FORBIDDEN)

            body = request.body
            expected = 'sha256=' + hmac.new(
                secret.encode(), body, hashlib.sha256
            ).hexdigest()
            if not hmac.compare_digest(signature, expected):
                return Response({'error': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)

        event_type = request.META.get('HTTP_X_GITHUB_EVENT', '')
        payload = request.data

        if event_type == 'push':
            self._handle_push(payload)
        elif event_type == 'pull_request':
            self._handle_pull_request(payload)

        return Response({'status': 'ok'})

    def _handle_push(self, payload):
        """Create a feed post for push events."""
        sender = payload.get('sender', {}).get('login', '')
        repo = payload.get('repository', {}).get('full_name', '')
        commits = payload.get('commits', [])
        commit_count = len(commits)

        if commit_count == 0:
            return

        # Find the Hive user by github_username
        try:
            gh_profile = GitHubProfile.objects.select_related('user').get(github_username=sender)
        except GitHubProfile.DoesNotExist:
            return  # User not linked on Hive

        # Build commit summary
        commit_msgs = '\n'.join(
            f'• {c.get("message", "").split(chr(10))[0]}'
            for c in commits[:5]
        )
        if commit_count > 5:
            commit_msgs += f'\n... and {commit_count - 5} more commits'

        content = f'Pushed {commit_count} commit{"s" if commit_count != 1 else ""} to {repo}'
        code_snippet = commit_msgs

        Post.objects.create(
            author=gh_profile.user,
            content=content,
            code_snippet=code_snippet,
            type='GITHUB_COMMIT',
        )

    def _handle_pull_request(self, payload):
        """Create a feed post for PR events."""
        action = payload.get('action', '')
        if action not in ('opened', 'closed', 'merged'):
            return

        sender = payload.get('sender', {}).get('login', '')
        repo = payload.get('repository', {}).get('full_name', '')
        pr = payload.get('pull_request', {})
        title = pr.get('title', '')

        try:
            gh_profile = GitHubProfile.objects.select_related('user').get(github_username=sender)
        except GitHubProfile.DoesNotExist:
            return

        merged = pr.get('merged', False)
        if action == 'closed' and merged:
            action_text = 'Merged'
        elif action == 'closed':
            action_text = 'Closed'
        else:
            action_text = 'Opened'

        content = f'{action_text} PR in {repo}: {title}'

        Post.objects.create(
            author=gh_profile.user,
            content=content,
            type='GITHUB_COMMIT',
        )
