from rest_framework import serializers
from .models import User, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'headline', 'bio', 'avatar_url',
            'github_handle', 'twitter_handle', 'linkedin_handle',
            'elo_rating', 'current_streak', 'total_xp',
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id', 'username', 'email']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Used for PATCH /api/users/me/ to update profile fields."""
    class Meta:
        model = UserProfile
        fields = [
            'headline', 'bio', 'avatar_url',
            'github_handle', 'twitter_handle', 'linkedin_handle',
        ]
