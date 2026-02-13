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

class GitHubLoginView(APIView):
    """
    POST /api/users/auth/github/
    Body: { "code": "..." }
    Exchanges GitHub code for access token, gets user info,
    creates/updates Django user, and returns Firebase Custom Token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Code is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Exchange code for GitHub access token
        access_token = github_auth.exchange_code_for_token(code)

        # 2. Get GitHub user info
        github_user_data = github_auth.get_github_user(access_token)
        
        github_id = str(github_user_data.get('id'))
        email = github_user_data.get('email')
        username = github_user_data.get('login')
        name = github_user_data.get('name') or username
        # Use github_id as unique identifier (username in Django)
        # Note: We might want to prefix it to avoid collision or just use the ID string.
        # But actually, Firebae UID is usually a string. Let's use `github:{id}` or just the ID if we are sure.
        # The existing Firebase auth uses `uid` from Firebase as `username`.
        # Here we are the identity provider, so we can define the UID.
        # Let's use `github:<id>` to be safe and explicit.
        uid = f"github:{github_id}" 

        # 3. Create or update Django user
        user, created = User.objects.get_or_create(
            username=uid,
            defaults={
                'email': email if email else '',
                'first_name': name.split(' ')[0] if name else '',
                'last_name': ' '.join(name.split(' ')[1:]) if name else '',
            }
        )
        
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
            
            # Update profile github handle if not set
            if not user.profile.github_handle:
                user.profile.github_handle = username
                user.profile.save(update_fields=['github_handle'])

        # 4. Generate Firebase Custom Token
        # We use the same UID so that the client treats it as the same user
        try:
            custom_token = firebase_auth.create_custom_token(uid)
            # define token as string
            custom_token = custom_token.decode('utf-8') if isinstance(custom_token, bytes) else custom_token
        except Exception as e:
            return Response({'error': f'Failed to create custom token: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'token': custom_token,
            'user': UserSerializer(user).data
        })

import hmac
import hashlib
from django.conf import settings
from feed.models import Post
from .models import Repository, UserProfile

class GitHubWebhookView(APIView):
    """
    POST /api/users/auth/github/webhook/
    Handles GitHub webhooks for:
    - push: Create Post if repo is active.
    - installation: Sync repos when App is installed.
    - installation_repositories: Sync repos when added/removed.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # 1. Verify Signature
        signature = request.META.get('HTTP_X_HUB_SIGNATURE_256')
        if not signature:
            return Response({'error': 'Missing signature'}, status=status.HTTP_403_FORBIDDEN)
            
        secret = settings.GITHUB_WEBHOOK_SECRET.encode('utf-8')
        body = request.body
        expected_signature = 'sha256=' + hmac.new(secret, body, hashlib.sha256).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            return Response({'error': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)
            
        # 2. Process Event
        event_type = request.META.get('HTTP_X_GITHUB_EVENT')
        payload = request.data
        sender = payload.get('sender', {})
        sender_login = sender.get('login')

        if event_type == 'push':
            repository = payload.get('repository', {})
            repo_full_name = repository.get('full_name')
            repo_id = str(repository.get('id'))
            commits = payload.get('commits', [])
            
            # Check if repo is tracked and active
            try:
                repo_obj = Repository.objects.get(github_repo_id=repo_id, is_active=True)
                user = repo_obj.user
            except Repository.DoesNotExist:
                return Response({'message': f'Repo {repo_full_name} not active or not found'}, status=status.HTTP_200_OK)

            created_count = 0
            for commit in commits:
                message = commit.get('message')
                url = commit.get('url')
                commit_id = commit.get('id')[:7]
                
                # Use default description if set, otherwise just commit message
                intro = repo_obj.default_description if repo_obj.default_description else f"🚀 Pushed to {repo_full_name}"
                content = f"{intro}\n\n**Commit:** {message}\n[View Commit]({url})"
                
                Post.objects.create(
                    author=user,
                    content=content,
                    type='GITHUB_COMMIT',
                    code_snippet=f"Repo: {repo_full_name}\nCommit: {commit_id}"
                )
                created_count += 1
                
            return Response({'message': f'Processed {created_count} commits for {repo_full_name}'}, status=status.HTTP_200_OK)

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
