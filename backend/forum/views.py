from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum
from .models import Channel, Thread, Reply, Vote
from .serializers import ChannelSerializer, ThreadSerializer, ReplySerializer, VoteSerializer

class ChannelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [permissions.AllowAny]

class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.all().select_related('author', 'channel').prefetch_related('votes')
    serializer_class = ThreadSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['created_at', 'views']

    def get_queryset(self):
        queryset = super().get_queryset()
        channel_slug = self.request.query_params.get('channel')
        if channel_slug:
            queryset = queryset.filter(channel__slug=channel_slug)
        
        # Filter by tag?
        tag = self.request.query_params.get('tag')
        if tag:
            # Simple JSON contains check or regex? JSONField search can be database specific.
            # SQLite supports JSON operations in recent Django versions.
            pass 
        
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment views
        # Use simpler approach to avoid race conditions but for now simple update is fine
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None):
        thread = self.get_object()
        user = request.user
        value = request.data.get('value')
        
        if value not in [Vote.UPVOTE, Vote.DOWNVOTE]:
            return Response({'error': 'Invalid vote value'}, status=status.HTTP_400_BAD_REQUEST)

        vote, created = Vote.objects.update_or_create(
            user=user, thread=thread,
            defaults={'value': value}
        )
        
        return Response({'status': 'voted', 'value': vote.value})

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def replies(self, request, pk=None):
        thread = self.get_object()
        replies = thread.replies.select_related('author').all().order_by('created_at')
        serializer = ReplySerializer(replies, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reply(self, request, pk=None):
        thread = self.get_object()
        serializer = ReplySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, thread=thread)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
