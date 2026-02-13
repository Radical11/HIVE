import requests
from django.conf import settings
from rest_framework import exceptions

GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'
GITHUB_USER_URL = 'https://api.github.com/user'
GITHUB_EMAILS_URL = 'https://api.github.com/user/emails'

def exchange_code_for_token(code):
    """
    Exchanges the authorization code for an access token.
    """
    payload = {
        'client_id': settings.GITHUB_CLIENT_ID,
        'client_secret': settings.GITHUB_CLIENT_SECRET,
        'code': code,
    }
    headers = {'Accept': 'application/json'}
    
    response = requests.post(GITHUB_ACCESS_TOKEN_URL, json=payload, headers=headers)
    
    if response.status_code != 200:
        raise exceptions.AuthenticationFailed('Failed to exchange code for token from GitHub.')
        
    data = response.json()
    
    if 'error' in data:
        raise exceptions.AuthenticationFailed(f"GitHub error: {data.get('error_description', 'Unknown error')}")
        
    return data.get('access_token')

def get_github_user(access_token):
    """
    Fetches the user's profile and primary email from GitHub.
    """
    headers = {'Authorization': f'token {access_token}'}
    
    # 1. Get user profile
    user_response = requests.get(GITHUB_USER_URL, headers=headers)
    if user_response.status_code != 200:
        raise exceptions.AuthenticationFailed('Failed to fetch user profile from GitHub.')
    
    user_data = user_response.json()
    
    # 2. Get user emails (if email is private/missing in profile)
    email = user_data.get('email')
    if not email:
        emails_response = requests.get(GITHUB_EMAILS_URL, headers=headers)
        if emails_response.status_code == 200:
            emails = emails_response.json()
            # Find primary verified email
            for e in emails:
                if e.get('primary') and e.get('verified'):
                    email = e.get('email')
                    break
    
    user_data['email'] = email
    return user_data
