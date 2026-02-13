from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post, Reaction, Comment
from .serializers import PostSerializer, PostCreateSerializer, ReactionSerializer, CommentSerializer


class PostListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/feed/ — paginated feed of posts
    POST /api/feed/ — create a new post
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.select_related('author', 'author__profile') \
            .prefetch_related('reactions', 'comments', 'comments__user') \
            .order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = PostCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save(author=request.user)
        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)


class PostReactView(APIView):
    """POST /api/feed/<id>/react/ — toggle reaction on a post."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        reaction_type = request.data.get('type')
        if reaction_type not in dict(Reaction.REACTION_TYPES):
            return Response({'error': 'Invalid reaction type'}, status=status.HTTP_400_BAD_REQUEST)

        existing = Reaction.objects.filter(post=post, user=request.user, type=reaction_type)
        if existing.exists():
            existing.delete()
            return Response({'status': 'removed'})
        else:
            Reaction.objects.create(post=post, user=request.user, type=reaction_type)
            return Response({'status': 'added'}, status=status.HTTP_201_CREATED)


class PostCommentView(generics.CreateAPIView):
    """POST /api/feed/<id>/comment/ — add a comment to a post."""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            post = Post.objects.get(pk=self.kwargs['pk'])
        except Post.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('Post not found')
        serializer.save(user=self.request.user, post=post)
