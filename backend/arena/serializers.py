from rest_framework import serializers
from .models import CodeforcesProfile, Challenge, Submission


class CodeforcesProfileSerializer(serializers.ModelSerializer):
    combined_score = serializers.ReadOnlyField()
    username = serializers.CharField(source='user.username', read_only=True)
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = CodeforcesProfile
        fields = [
            'cf_handle', 'cf_rating', 'cf_max_rating', 'cf_rank', 'cf_max_rank',
            'cf_avatar', 'cf_contribution', 'problems_solved',
            'combined_score', 'username', 'display_name', 'last_synced',
        ]

    def get_display_name(self, obj):
        user = obj.user
        name = f'{user.first_name} {user.last_name}'.strip()
        return name or obj.cf_handle


class LinkCodeforcesSerializer(serializers.Serializer):
    handle = serializers.CharField(max_length=100)


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'title', 'description', 'difficulty', 'points']


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'challenge', 'code', 'status', 'runtime_ms', 'created_at']
        read_only_fields = ['id', 'status', 'runtime_ms', 'created_at']
