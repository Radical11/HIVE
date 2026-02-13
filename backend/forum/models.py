from django.db import models
from django.conf import settings

class Channel(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=50, unique=True)
    color = models.CharField(max_length=20, default="#00d4ff") # Hex color

    def __str__(self):
        return self.name

class Thread(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='threads')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='threads')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    pinned = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    
    tags = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.title

    @property
    def reply_count(self):
        return self.replies.count()

    @property
    def vote_count(self):
        # Calculate sum of votes
        return self.votes.aggregate(total=models.Sum('value'))['total'] or 0

class Reply(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='replies')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='thread_replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reply by {self.author} on {self.thread}"

class Vote(models.Model):
    UPVOTE = 1
    DOWNVOTE = -1
    VOTE_CHOICES = (
        (UPVOTE, 'Upvote'),
        (DOWNVOTE, 'Downvote'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='thread_votes')
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='votes')
    value = models.IntegerField(choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'thread')
