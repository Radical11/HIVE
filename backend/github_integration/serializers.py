from rest_framework import serializers
from .models import GitHubProfile


class GitHubProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = GitHubProfile
        fields = [
            'github_username', 'github_id', 'avatar_url', 'html_url',
            'bio', 'company', 'location', 'blog',
            'public_repos', 'public_gists', 'followers', 'following',
            'total_contributions', 'total_commits', 'total_prs',
            'total_issues', 'total_stars_received',
            'top_languages', 'top_repos',
            'last_synced', 'github_created_at',
            'username', 'display_name',
        ]
        read_only_fields = fields

    def get_display_name(self, obj):
        u = obj.user
        return f'{u.first_name} {u.last_name}'.strip() or u.username


class LinkGitHubSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100, help_text='GitHub username to link')
    access_token = serializers.CharField(
        max_length=255, required=False, default='',
        help_text='Optional GitHub OAuth access token for higher rate limits'
    )
