from django.urls import path
from . import views

urlpatterns = [
    path('link/', views.LinkGitHubView.as_view(), name='link-github'),
    path('profile/', views.GitHubProfileView.as_view(), name='github-profile'),
    path('sync/', views.GitHubSyncView.as_view(), name='github-sync'),
    path('events/', views.GitHubEventsView.as_view(), name='github-events'),
    path('repos/', views.GitHubReposView.as_view(), name='github-repos'),
    path('user/<str:username>/', views.GitHubPublicProfileView.as_view(), name='github-public-profile'),
    path('webhook/', views.GitHubWebhookView.as_view(), name='github-webhook'),
]
