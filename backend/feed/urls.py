from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListCreateView.as_view(), name='post-list-create'),
    path('<uuid:pk>/react/', views.PostReactView.as_view(), name='post-react'),
    path('<uuid:pk>/comment/', views.PostCommentView.as_view(), name='post-comment'),
]
