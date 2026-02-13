from rest_framework import serializers
from .models import Channel, Thread, Reply, Vote
from users.serializers import UserSerializer

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name', 'description', 'slug', 'color']

class ReplySerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Reply
        fields = ['id', 'thread', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['thread', 'author', 'created_at', 'updated_at']

class ThreadSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    channel_slug = serializers.CharField(source='channel.slug', read_only=True)
    channel_color = serializers.CharField(source='channel.color', read_only=True)
    channel = serializers.SlugRelatedField(slug_field='slug', queryset=Channel.objects.all())
    reply_count = serializers.IntegerField(read_only=True)
    vote_count = serializers.IntegerField(read_only=True)
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = Thread
        fields = [
            'id', 'title', 'content', 'author', 'channel', 'channel_slug', 'channel_color',
            'created_at', 'updated_at', 'pinned', 'views', 'tags',
            'reply_count', 'vote_count', 'user_vote'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at', 'views', 'reply_count', 'vote_count']

    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                # optimization: prefetch this?
                vote = obj.votes.filter(user=request.user).first()
                return vote.value if vote else 0
            except:
                return 0
        return 0

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['author'] = user
        return super().create(validated_data)

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['value']
