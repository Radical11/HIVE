from django.urls import path
from . import views

urlpatterns = [
    path('link-codeforces/', views.LinkCodeforcesView.as_view(), name='link-codeforces'),
    path('cf-profile/', views.CodeforcesProfileView.as_view(), name='cf-profile'),
    path('cf-sync/', views.CodeforcesSyncView.as_view(), name='cf-sync'),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
    path('challenges/', views.ChallengeListView.as_view(), name='challenge-list'),
]
