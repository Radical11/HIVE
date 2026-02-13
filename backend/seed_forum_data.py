import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from forum.models import Channel

channels = [
    {"name": "systems-engineering", "description": "Discussions about large scale systems", "slug": "systems-engineering", "color": "#00d4ff"},
    {"name": "react-performance", "description": "Optimizing React applications", "slug": "react-performance", "color": "#22c55e"},
    {"name": "ml-research", "description": "Cutting edge ML papers and research", "slug": "ml-research", "color": "#a855f7"},
    {"name": "crypto-security", "description": "Blockchain and cybersecurity", "slug": "crypto-security", "color": "#f59e0b"},
    {"name": "career-growth", "description": "Advice for software engineers", "slug": "career-growth", "color": "#ef4444"},
    {"name": "open-source", "description": "Contributing to OSS", "slug": "open-source", "color": "#10b981"},
]

for ch in channels:
    obj, created = Channel.objects.get_or_create(name=ch['name'], defaults=ch)
    if created:
        print(f"Created channel: {ch['name']}")
    else:
        print(f"Channel already exists: {ch['name']}")
