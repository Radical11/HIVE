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
