from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.MeView.as_view(), name='user-me'),
    path('', views.UserListView.as_view(), name='user-list'),
    path('<uuid:id>/', views.PublicProfileView.as_view(), name='user-profile'),
]
