import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from forum.models import Channel, Thread

User = get_user_model()

# Ensure a user exists
user = User.objects.first()
if not user:
    user = User.objects.create_user(username='hive_admin', email='admin@hive.app', password='password123')
    print("Created test user: hive_admin")

channels = Channel.objects.all()
if not channels.exists():
    print("No channels found. Run seed_forum_data.py first.")
    exit()

threads_data = [
    {
        "title": "What's the best approach for designing a distributed rate limiter?",
        "content": "I'm working on a high-throughput API...",
        "slug": "systems-engineering"
    },
    {
        "title": "React Server Components vs Client Components — When to use which?",
        "content": "Trying to understand the trade-offs...",
        "slug": "react-performance"
    },
    {
        "title": "A deep dive into attention mechanisms",
        "content": "Here is my analysis of the latest paper...",
        "slug": "ml-research"
    },
     {
        "title": "Found a critical XSS vulnerability in a popular npm package",
        "content": "Disclosed responsibly, details here...",
        "slug": "crypto-security"
    },
    {
        "title": "How I went from junior to staff engineer in 3 years",
        "content": "Actionable steps and mindset shifts...",
        "slug": "career-growth"
    }
]

for t_data in threads_data:
    channel = channels.filter(slug=t_data['slug']).first()
    if channel:
        thread, created = Thread.objects.get_or_create(
            title=t_data['title'],
            defaults={
                "content": t_data['content'],
                "author": user,
                "channel": channel,
                "views": random.randint(100, 5000),
                "pinned": random.choice([True, False]),
                "tags": ["tech", channel.slug]
            }
        )
        if created:
            print(f"Created thread: {thread.title}")
        else:
            print(f"Thread already exists: {thread.title}")
