from django.db import models
from django.conf import settings
import uuid

class Post(models.Model):
    POST_TYPES = (
        ('MANUAL', 'Manual'),
        ('GITHUB_COMMIT', 'GitHub Commit'),
        ('CODEFORCES_SOLVE', 'Codeforces Solve'),
        ('MILESTONE', 'Milestone'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    code_snippet = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    type = models.CharField(max_length=20, choices=POST_TYPES, default='MANUAL')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username} - {self.type}"

class Reaction(models.Model):
    REACTION_TYPES = (
        ('RESPECT', 'Respect'),
        ('FIRE', 'Fire'),
        ('BUG', 'Bug'),
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=REACTION_TYPES)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    code_snippet = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
