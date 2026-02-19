from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User, UserProfile
from .serializers import UserSerializer, UserProfileUpdateSerializer


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/users/me/ — current user + profile
    PATCH /api/users/me/ — update profile fields
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return UserProfileUpdateSerializer
        return UserSerializer

    def get_serializer(self, *args, **kwargs):
        if self.request.method == 'PATCH':
            profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
            kwargs['instance'] = profile
        return super().get_serializer(*args, **kwargs)

    def update(self, request, *args, **kwargs):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # Return full user data
        return Response(UserSerializer(request.user).data)


class PublicProfileView(generics.RetrieveAPIView):
    """
    GET /api/users/<id>/ — public profile
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'


from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from firebase_admin import auth as firebase_auth
from . import github_auth

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class GitHubLoginView(APIView):
    """
    POST /api/users/auth/github/
    Body: { "code": "..." }
    Exchanges GitHub code for access token, gets user info,
    creates/updates Django user, and returns Firebase ID token via REST API.
    """
    authentication_classes = []  # No auth needed for login endpoint
    permission_classes = [AllowAny]

    FIREBASE_API_KEY = 'AIzaSyD1Pw_bIQ1NpgpbtcTtslK2c6fp-99IRDQ'

    def _firebase_sign_in_or_create(self, email, password, display_name=''):
        """
        Try to sign in via Firebase REST API. If user doesn't exist, create them first.
        Returns the Firebase ID token and refresh token.
        """
        import requests as http_requests

        # Try sign in first
        sign_in_url = f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={self.FIREBASE_API_KEY}'
        sign_in_resp = http_requests.post(sign_in_url, json={
            'email': email,
            'password': password,
            'returnSecureToken': True
        })

        if sign_in_resp.status_code == 200:
            data = sign_in_resp.json()
            return data['idToken'], data['refreshToken'], data['localId']

        # If user doesn't exist, create them
        sign_up_url = f'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={self.FIREBASE_API_KEY}'
        sign_up_resp = http_requests.post(sign_up_url, json={
            'email': email,
            'password': password,
            'displayName': display_name,
            'returnSecureToken': True
        })

        if sign_up_resp.status_code == 200:
            data = sign_up_resp.json()
            return data['idToken'], data['refreshToken'], data['localId']

        # Both failed
        error_msg = sign_up_resp.json().get('error', {}).get('message', 'Unknown Firebase error')
        raise Exception(f'Firebase auth failed: {error_msg}')

    def post(self, request):
        import logging
        logger = logging.getLogger('github_auth')
        
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Code is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            logger.warning(f"[GitHub Auth] Starting code exchange...")
            
            # 1. Exchange code for GitHub access token
            access_token = github_auth.exchange_code_for_token(code)
            logger.warning(f"[GitHub Auth] Got access token, fetching user info...")

            # 2. Get GitHub user info
            github_user_data = github_auth.get_github_user(access_token)
            
            github_id = str(github_user_data.get('id'))
            email = github_user_data.get('email')
            username = github_user_data.get('login')
            name = github_user_data.get('name') or username
            logger.warning(f"[GitHub Auth] User: {username}, email: {email}")

            # Generate a deterministic email for Firebase to avoid collision with real users or old attempts
            # We use '_v2' to ensure we don't conflict with any previous attempts
            firebase_email = f'github_{github_id}_v2@hive-github.local'
            # Use a deterministic password based on GitHub ID (user never types this)
            firebase_password = f'hive_gh_{github_id}_!Secure2024'

            # 3. Sign in / create Firebase user via REST API (no service account needed)
            # We do this FIRST to get the canonical firebase_uid (localId)
            logger.warning(f"[GitHub Auth] Firebase sign in/create for {firebase_email}...")
            id_token, refresh_token, firebase_uid = self._firebase_sign_in_or_create(
                firebase_email, firebase_password, display_name=name
            )
            logger.warning(f"[GitHub Auth] Firebase UID: {firebase_uid}")

            # 4. Create or update Django user with the correct username (firebase_uid)
            user, created = User.objects.get_or_create(
                username=firebase_uid,
                defaults={
                    'email': email if email else '',
                    'first_name': name.split(' ')[0] if name else '',
                    'last_name': ' '.join(name.split(' ')[1:]) if name else '',
                }
            )
            logger.warning(f"[GitHub Auth] Django user {'created' if created else 'found'}: {user.username}")
            
            if created:
                UserProfile.objects.create(
                    user=user,
                    avatar_url=github_user_data.get('avatar_url', ''),
                    headline=f'{name} on Hive',
                    github_handle=username
                )
            else:
                # Update existing user info if needed
                if email and not user.email:
                    user.email = email
                    user.save(update_fields=['email'])
                
                # Check if profile exists (handle potential missing profile for existing user)
                if hasattr(user, 'profile'):
                    if not user.profile.github_handle:
                        user.profile.github_handle = username
                        user.profile.save(update_fields=['github_handle'])
                else:
                    # Create profile if missing
                    UserProfile.objects.create(
                        user=user,
                        avatar_url=github_user_data.get('avatar_url', ''),
                        headline=f'{name} on Hive',
                        github_handle=username
                    )

            return Response({
                'token': id_token,
                'refreshToken': refresh_token,
                'firebaseEmail': firebase_email,
                'firebasePassword': firebase_password,
                'user': UserSerializer(user).data
            })

        except Exception as e:
            import traceback
            error_detail = traceback.format_exc()
            logger.error(f"[GitHub Auth] ERROR: {error_detail}")
            # Also write to a file for debugging
            with open('github_auth_debug.log', 'a') as f:
                f.write(f"\n{'='*60}\n{error_detail}\n")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import hmac
import hashlib
from django.conf import settings
from feed.models import Post
from .models import Repository, UserProfile

@method_decorator(csrf_exempt, name='dispatch')
class GitHubWebhookView(APIView):
    """
    POST /api/users/auth/github/webhook/
    Handles GitHub webhooks for:
    - push: Create Post if repo is active.
    - installation: Sync repos when App is installed.
    - installation_repositories: Sync repos when added/removed.
    """
    authentication_classes = [] # Webhooks don't have auth headers
    permission_classes = [AllowAny]

    def post(self, request):
        import logging
        import json
        
        # Setup logger
        logger = logging.getLogger('github_webhook')
        
        # Log request details
        try:
            with open('github_webhook_debug.log', 'a') as f:
                f.write(f"\n{'='*60}\n")
                f.write(f"Headers: {request.META}\n")
                f.write(f"Body: {request.body.decode('utf-8')[:500]}...\n")
        except:
            pass

        try:
            # 1. Verify Signature
            signature = request.META.get('HTTP_X_HUB_SIGNATURE_256')
            if not signature:
                with open('github_webhook_debug.log', 'a') as f: f.write("ERROR: Missing signature\n")
                return Response({'error': 'Missing signature'}, status=status.HTTP_403_FORBIDDEN)
                
            secret = settings.GITHUB_WEBHOOK_SECRET.encode('utf-8')
            body = request.body
            expected_signature = 'sha256=' + hmac.new(secret, body, hashlib.sha256).hexdigest()
            
            if not hmac.compare_digest(signature, expected_signature):
                with open('github_webhook_debug.log', 'a') as f: 
                    f.write(f"ERROR: Invalid signature. Got {signature}, expected {expected_signature}\n")
                return Response({'error': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)
                
            with open('github_webhook_debug.log', 'a') as f: f.write("Signature verified. Processing event...\n")

            # 2. Process Event
            event_type = request.META.get('HTTP_X_GITHUB_EVENT')
            payload = request.data
            sender = payload.get('sender', {})
            sender_login = sender.get('login')
            
            with open('github_webhook_debug.log', 'a') as f: f.write(f"Event: {event_type}, Sender: {sender_login}\n")

            if event_type == 'push':
                repository = payload.get('repository', {})
                repo_full_name = repository.get('full_name')
                repo_id = str(repository.get('id'))
                commits = payload.get('commits', [])
                
                with open('github_webhook_debug.log', 'a') as f: f.write(f"Repo: {repo_full_name} ({repo_id}), Commits: {len(commits)}\n")

                # Check if repo is tracked and active
                try:
                    repo_obj = Repository.objects.get(github_repo_id=repo_id)
                    if not repo_obj.is_active:
                        with open('github_webhook_debug.log', 'a') as f: f.write("Repo inactive.\n")
                        return Response({'message': f'Repo {repo_full_name} is inactive'}, status=status.HTTP_200_OK)
                    user = repo_obj.user
                    with open('github_webhook_debug.log', 'a') as f: f.write(f"Found active repo for user: {user.username}\n")
                except Repository.DoesNotExist:
                    with open('github_webhook_debug.log', 'a') as f: f.write("Repo not found in DB. Trying owner lookup...\n")
                    # If repo not found, check if the owner is a user on our platform
                    owner_login = repository.get('owner', {}).get('login')
                    if not owner_login:
                        return Response({'message': 'Repo owner not found in payload'}, status=status.HTTP_200_OK)
                    
                    # Use filter().first() to avoid MultipleObjectsReturned if duplicate profiles exist
                    profile = UserProfile.objects.filter(github_handle__iexact=owner_login).first()
                    
                    if profile:
                        user = profile.user
                        # Auto-create and activate the repo
                        repo_obj = Repository.objects.create(
                            user=user,
                            github_repo_id=repo_id,
                            full_name=repo_full_name,
                            html_url=repository.get('html_url', ''),
                            is_active=True
                        )
                    else:
                        with open('github_webhook_debug.log', 'a') as f: f.write(f"UserProfile contact not found for {owner_login}\n")
                        return Response({'message': f'Repo owner {owner_login} not found on Hive'}, status=status.HTTP_200_OK)

                # Aggregate commits for a single post
                if not commits:
                    return Response({'message': 'No commits to process'}, status=status.HTTP_200_OK)

                # Get the head commit (the most recent one, which describes the state)
                head_commit = commits[-1]
                head_message = head_commit.get('message', '')
                
                # Construct a "file diff" summary for the code snippet
                # We don't have the actual diff, but we have lists of added/removed/modified files
                diff_summary = f"// {len(commits)} commits to {repo_full_name}\n"
                
                file_changes = []
                for commit in commits:
                    for f in commit.get('added', []):
                        file_changes.append(f"+ {f}")
                    for f in commit.get('removed', []):
                        file_changes.append(f"- {f}")
                    for f in commit.get('modified', []):
                        file_changes.append(f"M {f}")
                
                # Limit file changes to 10 lines to fit nicely in the snippet box
                unique_changes = list(set(file_changes))[:10]
                if len(file_changes) > 10:
                    unique_changes.append(f"... and {len(file_changes) - 10} more files")
                    
                code_snippet = diff_summary + "\n".join(unique_changes)

                # Content: nicer informative message
                # If the user has a long commit message, split it. Title is first line.
                msg_lines = head_message.split('\n')
                title = msg_lines[0]
                body = "\n".join(msg_lines[1:]).strip()
                
                # If body is empty, we can generate a generic one based on file extensions maybe? 
                # Or just leave it clean. The user wants the "Sarah_dev type post".
                # Let's just use the commit message.
                
                post_content = head_message

                Post.objects.create(
                    author=user,
                    content=post_content,
                    type='GITHUB_COMMIT',
                    code_snippet=code_snippet
                )
                
                return Response({'message': f'Processed {len(commits)} commits for {repo_full_name}'}, status=status.HTTP_200_OK)

            elif event_type in ['installation', 'installation_repositories']:
                action = payload.get('action')
                installation = payload.get('installation', {})
                
                # Identify User: sender.login should match github_handle
                try:
                    profile = UserProfile.objects.get(github_handle=sender_login)
                    user = profile.user
                except UserProfile.DoesNotExist:
                    return Response({'message': f'User {sender_login} not found'}, status=status.HTTP_200_OK)

                if event_type == 'installation':
                    # Sync all repos in the installation
                    if action in ['created', 'added']:
                        repos = payload.get('repositories', [])
                        self._sync_repos(user, repos)
                    elif action == 'deleted':
                        # App uninstalled -> Remove all repos? Or just deactivate?
                        # Let's delete to keep clean.
                        Repository.objects.filter(user=user).delete()
                
                elif event_type == 'installation_repositories':
                    if action == 'added':
                        repos = payload.get('repositories_added', [])
                        self._sync_repos(user, repos)
                    elif action == 'removed':
                        repos = payload.get('repositories_removed', [])
                        for repo in repos:
                            Repository.objects.filter(user=user, github_repo_id=str(repo.get('id'))).delete()

                return Response({'message': 'Synced repositories'}, status=status.HTTP_200_OK)

            elif event_type == 'ping':
                return Response({'message': 'Pong!'}, status=status.HTTP_200_OK)

            return Response({'message': 'Event ignored'}, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            error_detail = traceback.format_exc()
            logger.error(f"[GitHub Webhook] ERROR: {error_detail}")
            with open('github_webhook_debug.log', 'a') as f:
                f.write(f"\n{'='*60}\nERROR DETAILS:\n{error_detail}\n{'='*60}\n")
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _sync_repos(self, user, repos_data):
        for repo in repos_data:
            repo_obj, _ = Repository.objects.get_or_create(
                user=user,
                github_repo_id=str(repo.get('id')),
                defaults={
                    'full_name': repo.get('full_name'),
                    'html_url': repo.get('html_url', f"https://github.com/{repo.get('full_name')}"),
                    'is_active': True
                }
            )
            if not repo_obj.is_active:
                repo_obj.is_active = True
                repo_obj.save()


from .serializers import RepositorySerializer

class RepositoryListView(generics.ListAPIView):
    serializer_class = RepositorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Repository.objects.filter(user=self.request.user)
    
    def post(self, request, *args, **kwargs):
        """
        Toggle is_active or update description for a specific repo.
        Body: { "id": <db_id>, "is_active": true/false, "default_description": "..." }
        """
        repo_id = request.data.get('id')
        try:
            repo = Repository.objects.get(id=repo_id, user=request.user)
        except Repository.DoesNotExist:
             return Response({'error': 'Repository not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if 'is_active' in request.data:
            repo.is_active = request.data['is_active']
        if 'default_description' in request.data:
            repo.default_description = request.data['default_description']
        
        repo.save()
        return Response(RepositorySerializer(repo).data)
