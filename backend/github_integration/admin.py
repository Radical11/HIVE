from django.contrib import admin
from .models import GitHubProfile


@admin.register(GitHubProfile)
class GitHubProfileAdmin(admin.ModelAdmin):
    list_display = ('github_username', 'user', 'public_repos', 'followers', 'total_contributions', 'last_synced')
    search_fields = ('github_username', 'user__username', 'user__email')
    readonly_fields = ('last_synced',)
