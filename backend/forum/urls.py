from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChannelViewSet, ThreadViewSet

router = DefaultRouter()
router.register(r'channels', ChannelViewSet)
router.register(r'threads', ThreadViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
