from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CodeforcesProfile, Challenge
from .serializers import CodeforcesProfileSerializer, LinkCodeforcesSerializer, ChallengeSerializer
from . import codeforces


class LinkCodeforcesView(APIView):
    """
    POST /api/arena/link-codeforces/
    Body: { "handle": "tourist" }
    Links a Codeforces handle to the current user and syncs stats.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LinkCodeforcesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        handle = serializer.validated_data['handle']

        # Verify handle exists on Codeforces
        try:
            cf_data = codeforces.fetch_user_info(handle)
        except Exception as e:
            return Response(
                {'error': f'Could not find Codeforces user "{handle}": {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create or update the profile
        profile, created = CodeforcesProfile.objects.update_or_create(
            user=request.user,
            defaults={
                'cf_handle': cf_data.get('handle', handle),
                'cf_rating': cf_data.get('rating', 0),
                'cf_max_rating': cf_data.get('maxRating', 0),
                'cf_rank': cf_data.get('rank', 'Newbie'),
                'cf_max_rank': cf_data.get('maxRank', 'Newbie'),
                'cf_avatar': cf_data.get('titlePhoto', ''),
                'cf_contribution': cf_data.get('contribution', 0),
                'cf_friend_count': cf_data.get('friendOfCount', 0),
            }
        )

        return Response(
            CodeforcesProfileSerializer(profile).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class CodeforcesProfileView(APIView):
    """GET /api/arena/cf-profile/ — get linked Codeforces profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = CodeforcesProfile.objects.get(user=request.user)
        except CodeforcesProfile.DoesNotExist:
            return Response(
                {'error': 'No Codeforces profile linked. Use /api/arena/link-codeforces/ first.'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(CodeforcesProfileSerializer(profile).data)


class CodeforcesSyncView(APIView):
    """POST /api/arena/cf-sync/ — refresh CF stats from Codeforces API."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            profile = CodeforcesProfile.objects.get(user=request.user)
        except CodeforcesProfile.DoesNotExist:
            return Response(
                {'error': 'No Codeforces profile linked.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            cf_data = codeforces.fetch_user_info(profile.cf_handle)
        except Exception as e:
            return Response(
                {'error': f'Codeforces API error: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY
            )

        profile.cf_rating = cf_data.get('rating', profile.cf_rating)
        profile.cf_max_rating = cf_data.get('maxRating', profile.cf_max_rating)
        profile.cf_rank = cf_data.get('rank', profile.cf_rank)
        profile.cf_max_rank = cf_data.get('maxRank', profile.cf_max_rank)
        profile.cf_avatar = cf_data.get('titlePhoto', profile.cf_avatar)
        profile.cf_contribution = cf_data.get('contribution', profile.cf_contribution)
        profile.cf_friend_count = cf_data.get('friendOfCount', profile.cf_friend_count)
        profile.save()

        return Response(CodeforcesProfileSerializer(profile).data)


class LeaderboardView(generics.ListAPIView):
    """
    GET /api/arena/leaderboard/
    Ranked leaderboard sorted by combined score (70% CF + 30% XP).
    """
    serializer_class = CodeforcesProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return CodeforcesProfile.objects.select_related('user', 'user__profile') \
            .order_by('-cf_rating')


class ChallengeListView(generics.ListAPIView):
    """GET /api/arena/challenges/ — list internal challenges."""
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.AllowAny]
