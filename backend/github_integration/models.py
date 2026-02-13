from django.db import models
from django.conf import settings


class GitHubProfile(models.Model):
    """Links a Hive user to their GitHub account and caches profile data."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='github_profile'
    )
    github_username = models.CharField(max_length=100, unique=True)
    github_id = models.IntegerField(null=True, blank=True)
    avatar_url = models.URLField(blank=True)
    html_url = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    company = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    blog = models.URLField(blank=True)

    # Stats
    public_repos = models.IntegerField(default=0)
    public_gists = models.IntegerField(default=0)
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)
    total_contributions = models.IntegerField(default=0)
    total_commits = models.IntegerField(default=0)
    total_prs = models.IntegerField(default=0)
    total_issues = models.IntegerField(default=0)
    total_stars_received = models.IntegerField(default=0)

    # Top languages (stored as JSON: [{"name": "Python", "percentage": 45.2}, ...])
    top_languages = models.JSONField(default=list, blank=True)

    # Pinned/top repos (stored as JSON: [{"name": "repo", "description": "...", ...}])
    top_repos = models.JSONField(default=list, blank=True)

    # OAuth token for authenticated API calls (optional, encrypted in production)
    access_token = models.CharField(max_length=255, blank=True)

    # Sync metadata
    last_synced = models.DateTimeField(auto_now=True)
    github_created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'GitHub Profile'
        verbose_name_plural = 'GitHub Profiles'

    def __str__(self):
        return f'{self.github_username} ({self.followers} followers, {self.public_repos} repos)'
