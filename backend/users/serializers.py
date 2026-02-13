from rest_framework import serializers
from .models import User, UserProfile, Repository


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
    is_github_connected = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile', 'is_github_connected']
        read_only_fields = ['id', 'username', 'email']

    def get_is_github_connected(self, obj):
        return obj.repositories.exists()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Used for PATCH /api/users/me/ to update profile fields."""
    class Meta:
        model = UserProfile
        fields = [
            'headline', 'bio', 'avatar_url',
            'github_handle', 'twitter_handle', 'linkedin_handle',
        ]


class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['id', 'github_repo_id', 'full_name', 'html_url', 'is_active', 'default_description']
        read_only_fields = ['id', 'github_repo_id', 'full_name', 'html_url']
