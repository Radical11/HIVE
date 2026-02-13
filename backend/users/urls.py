from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.MeView.as_view(), name='user-me'),
    path('auth/github/', views.GitHubLoginView.as_view(), name='github-login'),
    path('<uuid:id>/', views.PublicProfileView.as_view(), name='user-profile'),
]
