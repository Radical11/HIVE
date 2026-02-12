from django.db import models
from django.conf import settings
import uuid


class CodeforcesProfile(models.Model):
    """Links a Hive user to their Codeforces account."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cf_profile'
    )
    cf_handle = models.CharField(max_length=100, unique=True)
    cf_rating = models.IntegerField(default=0)
    cf_max_rating = models.IntegerField(default=0)
    cf_rank = models.CharField(max_length=50, default='Newbie')
    cf_max_rank = models.CharField(max_length=50, default='Newbie')
    cf_avatar = models.URLField(blank=True)
    cf_contribution = models.IntegerField(default=0)
    cf_friend_count = models.IntegerField(default=0)
    problems_solved = models.IntegerField(default=0)
    last_synced = models.DateTimeField(auto_now=True)

    @property
    def combined_score(self):
        """Combined score: CF rating (weighted 70%) + Internal XP (weighted 30%)."""
        xp = getattr(self.user, 'profile', None)
        internal_xp = xp.total_xp if xp else 0
        return int(self.cf_rating * 0.7 + internal_xp * 0.3)

    def __str__(self):
        return f'{self.cf_handle} ({self.cf_rank})'


class Challenge(models.Model):
    """Internal Hive coding challenges (kept for future expansion)."""
    DIFFICULTY_CHOICES = (
        ('EASY', 'Easy'),
        ('MEDIUM', 'Medium'),
        ('HARD', 'Hard'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    points = models.IntegerField()
    test_cases = models.JSONField(default=list)

    def __str__(self):
        return self.title


class Submission(models.Model):
    STATUS_CHOICES = (
        ('PASS', 'Pass'),
        ('FAIL', 'Fail'),
    )
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='submissions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    code = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    runtime_ms = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
