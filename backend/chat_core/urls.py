# chat_core/urls.py

from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from chatapp.consumer import ChatAppConsumer

# drf-spectacular
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Standard HTTP URL patterns
urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path("api/", include("server.urls")), # Include server app URLs
    path("api/", include("chatapp.urls")), # Include chatapp app URLs
]

# WebSocket URL patterns
websocket_urlpatterns = [
    path("<str:serverId>/<str:channelId>/", ChatAppConsumer.as_asgi()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
