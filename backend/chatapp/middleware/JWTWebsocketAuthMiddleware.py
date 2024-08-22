import logging
import jwt
from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from account.models import UserProfile
from decouple import config

# Set up the logger
logger = logging.getLogger(__name__)

@database_sync_to_async
def get_user_from_token(token):
    """
    Retrieve a user based on the provided JWT token.
    
    This function decodes the JWT token using the secret key, extracts the user ID from the token payload,
    and fetches the corresponding UserProfile object from the database.
    
    Args:
        token (str): The JWT token to be decoded and validated.
        
    Returns:
        UserProfile or None: The UserProfile object if the token is valid and the user exists;
                            None if the token is expired, invalid, or the user does not exist.
    """
    try:
        logger.debug(f"Decoding token: {token}")

        # Decode the JWT using the access secret key
        payload = jwt.decode(token, config("JWT_ACCESS_SECRET"), algorithms=["HS256"])
        logger.info(f"Token decoded successfully: {payload}")

        # Extract the user ID from the token payload
        user_id = payload.get("user_id")
        logger.debug(f"Extracted user ID from token: {user_id}")

        # Fetch the corresponding UserProfile from the database
        user = UserProfile.objects.get(pk=user_id)
        logger.info(f"User profile found for user ID {user_id}: {user}")

        return user

    except jwt.ExpiredSignatureError:
        logger.warning("Token has expired")
        return None
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        return None
    except UserProfile.DoesNotExist:
        logger.error(f"UserProfile does not exist for user ID {user_id}")
        return None
    except Exception as e:
        logger.exception(f"An unexpected error occurred while processing the token: {str(e)}")
        return None
    
class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware for WebSocket connections that handles JWT authentication.

    This middleware intercepts WebSocket connection requests and extracts a JWT token
    from the query parameters. If a valid token is provided, it decodes the token
    to retrieve the associated user and attaches the user to the connection scope.

    The scope is a dictionary-like object that contains various keys and values related to the WebSocket connection, allowing access to important connection metadata.

    Scope Dictionary Keys:
    ----------------------
    1. type: 
       Specifies the type of connection, e.g., 'websocket'.
    
    2. path: 
       The URL path used to open the WebSocket connection.
    
    3. query_string: 
       The query string parameters, typically URL-encoded.
    
    4. headers: 
       The HTTP headers sent during the WebSocket handshake.
    
    5. client: 
       A tuple containing the client IP address and port.
    
    6. user: 
       The user associated with the connection, if the user is authenticated.
    
    7. session: 
       The Django session, if applicable (for session-based authentication).

    Usage:
    ------
    This middleware is typically added to the ASGI application stack, wrapping 
    WebSocket consumers to enforce JWT-based authentication.
    
    Example:
    --------
    To use this middleware, you should wrap it around your WebSocket consumer like so:

    ```python
    from channels.middleware import ProtocolTypeRouter, URLRouter
    from myapp.middleware import JWTAuthMiddleware
    from myapp.consumers import MyWebSocketConsumer

    application = ProtocolTypeRouter({
        "websocket": JWTAuthMiddleware(
            URLRouter([
                path("ws/somepath/", MyWebSocketConsumer.as_asgi()),
            ])
        ),
    })
    ```
    """

async def authenticate_websocket_connection(self, scope, receive, send):
    """
    Intercepts WebSocket connection requests and handles JWT authentication.

    This method is called when a new WebSocket connection is initiated. It extracts the 
    query string from the connection's scope, parses it to retrieve the JWT token, and 
    then authenticates the user based on the token. If a valid token is found, the corresponding
    user is attached to the connection scope. If no token is provided or the token is invalid, 
    an AnonymousUser is attached to the scope.

    Parameters:
        scope (dict): The connection's scope containing metadata about the WebSocket connection.
        receive (callable): A callable to receive messages from the WebSocket connection.
        send (callable): A callable to send messages over the WebSocket connection.

    Returns:
        awaitable: Proceeds with the connection flow by calling the next middleware in the stack or
        the main WebSocket handler.
    """
    # Extract the query string from the connection's scope, which may contain the JWT
    query_string = scope.get("query_string", b"").decode("utf-8")
    
    # Log the query string for debugging
    logger.debug(f"Query string received: {query_string}")
    
    # Parse the query string into a dictionary to extract query parameters
    query_params = parse_qs(query_string)
    
    # Retrieve the "token" query parameter, defaulting to None if not present
    token = query_params.get("token", [None])[0]
    
    if token:
        try:
            # Log the presence of a token
            logger.debug("Token found, attempting to authenticate.")
            
            # If a token is found, attempt to retrieve the corresponding user
            scope["user"] = await get_user_from_token(token)
            
            # Log successful authentication
            logger.info(f"User {scope['user']} authenticated successfully.")
        except Exception as e:
            # Log any exception that occurs during token validation
            logger.error(f"Error during token authentication: {e}")
            scope["user"] = AnonymousUser()
    else:
        # Log when no token is provided
        logger.warning("No token provided, treating as anonymous connection.")
        scope["user"] = AnonymousUser()
    
    # Proceed with the connection by calling the next middleware or handler in the stack
    return await super().__call__(scope, receive, send)