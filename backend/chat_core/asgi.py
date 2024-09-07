import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator


# Set the default settings module for Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chat_core.settings")

# Initialize the Django application before importing URLs
django_application = get_asgi_application()

import chat_core.urls as urls
from chatapp.auth_middleware import JWTWSMiddleware
# Define the ASGI application
application = ProtocolTypeRouter(
    {
        # Route HTTP requests to Django's ASGI application handler
        "http": django_application,

        # Route WebSocket connections using AllowedHostsOriginValidator for security
        "websocket": AllowedHostsOriginValidator(
            JWTWSMiddleware(  # First middleware
                    URLRouter(urls.websocket_urlpatterns)
            )
        ),
    }
)

"""
ASGI config for chat_core project.

This module contains the ASGI application used for serving HTTP and WebSocket
protocols. The application is configured to route HTTP requests to Django's
ASGI application handler and WebSocket connections to URLRouter with allowed
hosts validation.

Classes:
    - AllowedHostsOriginValidator: Validates WebSocket origins against allowed hosts.

Functions:
    - get_asgi_application: Returns the ASGI application callable.
    - URLRouter: Routes WebSocket connections to the appropriate consumers based on URL patterns.

Attributes:
    - application: The ASGI application callable that routes both HTTP and WebSocket connections.
"""
