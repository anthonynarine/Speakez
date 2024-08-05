# server/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet

# Create an instance of DefaultRouter
# This router will automatically generate the URL patterns for our viewsets
router = DefaultRouter()

# Register the Viewset
router.register("messages", MessageViewSet, basename="message")

urlpatterns = router.urls
