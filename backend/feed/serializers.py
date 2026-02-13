from rest_framework import serializers
from .models import Post, Reaction, Comment
from users.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'code_snippet', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ['id', 'user', 'type']
        read_only_fields = ['id', 'user']


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    reactions = ReactionSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    reaction_counts = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'content', 'code_snippet', 'image_url',
            'type', 'created_at', 'reactions', 'comments',
            'reaction_counts', 'comment_count',
        ]
        read_only_fields = ['id', 'author', 'created_at']

    def get_reaction_counts(self, obj):
        counts = {}
        for r in obj.reactions.all():
            counts[r.type] = counts.get(r.type, 0) + 1
        return counts

    def get_comment_count(self, obj):
        return obj.comments.count()


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content', 'code_snippet', 'image_url', 'type']
