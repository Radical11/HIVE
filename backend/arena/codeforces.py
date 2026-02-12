"""
Codeforces API service module.
Wraps public API endpoints with caching and rate-limit awareness.
Docs: https://codeforces.com/apiHelp
Rate limit: 5 requests/second
"""
import requests
import time
from functools import lru_cache

CF_API_BASE = 'https://codeforces.com/api'

# Simple rate-limit tracker
_last_request_time = 0
_MIN_INTERVAL = 0.25  # 250ms between requests (safe under 5/sec)


def _rate_limited_get(url, params=None):
    """Make a GET request to the Codeforces API with rate limiting."""
    global _last_request_time
    now = time.time()
    elapsed = now - _last_request_time
    if elapsed < _MIN_INTERVAL:
        time.sleep(_MIN_INTERVAL - elapsed)

    response = requests.get(url, params=params, timeout=10)
    _last_request_time = time.time()
    response.raise_for_status()

    data = response.json()
    if data.get('status') != 'OK':
        raise Exception(data.get('comment', 'Codeforces API error'))
    return data['result']


def fetch_user_info(handle: str) -> dict:
    """
    Fetch user info from Codeforces.
    Returns dict with: handle, rating, maxRating, rank, maxRank, avatar, etc.
    """
    result = _rate_limited_get(f'{CF_API_BASE}/user.info', {'handles': handle})
    if not result:
        raise Exception(f'User "{handle}" not found on Codeforces')
    return result[0]


def fetch_user_rating_history(handle: str) -> list:
    """
    Fetch rating change history for a user.
    Returns list of rating changes with contestId, contestName, oldRating, newRating.
    """
    return _rate_limited_get(f'{CF_API_BASE}/user.rating', {'handle': handle})


def fetch_contest_standings(contest_id: int, count: int = 50, handles: str = None) -> dict:
    """
    Fetch contest standings.
    Returns dict with 'contest', 'problems', 'rows'.
    """
    params = {'contestId': contest_id, 'from': 1, 'count': count}
    if handles:
        params['handles'] = handles
    return _rate_limited_get(f'{CF_API_BASE}/contest.standings', params)


def fetch_recent_contests(gym: bool = False) -> list:
    """
    Fetch list of contests.
    Returns list of contest objects.
    """
    params = {'gym': str(gym).lower()}
    return _rate_limited_get(f'{CF_API_BASE}/contest.list', params)


def get_cf_rank_tier(rating: int) -> str:
    """Map Codeforces rating to rank name."""
    if rating < 1200:
        return 'Newbie'
    elif rating < 1400:
        return 'Pupil'
    elif rating < 1600:
        return 'Specialist'
    elif rating < 1900:
        return 'Expert'
    elif rating < 2100:
        return 'Candidate Master'
    elif rating < 2300:
        return 'Master'
    elif rating < 2400:
        return 'International Master'
    elif rating < 2600:
        return 'Grandmaster'
    elif rating < 3000:
        return 'International Grandmaster'
    else:
        return 'Legendary Grandmaster'
