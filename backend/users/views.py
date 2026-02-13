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
