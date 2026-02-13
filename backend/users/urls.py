from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.MeView.as_view(), name='user-me'),
    path('auth/github/', views.GitHubLoginView.as_view(), name='github-login'),
    # Webhook endpoint (supports both with and without trailing slash)
    path('auth/github/webhook/', views.GitHubWebhookView.as_view(), name='github-webhook'),
    path('auth/github/webhook', views.GitHubWebhookView.as_view(), name='github-webhook-noslash'),
    path('repositories/', views.RepositoryListView.as_view(), name='repository-list'),
    path('<uuid:id>/', views.PublicProfileView.as_view(), name='user-profile'),
]
