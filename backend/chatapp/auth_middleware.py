import logging
from channels.db import database_sync_to_async
from decouple import config
import jwt
from django.contrib.auth.models import AnonymousUser
from .models import UserProfile

JWT_ACCESS_SECRET = config("JWT_ACCESS_SECRET")

# Set up the logger
logger = logging.getLogger(__name__)

@database_sync_to_async
def get_user_from_token(token):
    """
    Retrieve a user based on the provided JWT token asynchronously.
    
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
        payload = jwt.decode(token, JWT_ACCESS_SECRET, algorithms=["HS256"])
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
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {e}")
        return None
    except UserProfile.DoesNotExist:
        logger.error(f"UserProfile does not exist for user ID {user_id}")
        return None
    except Exception as e:
        logger.exception(f"An unexpected error occurred while processing the token: {str(e)}")
        return None


class JWTWSMiddleware:
    """
    Middleware for WebSocket connections to handle JWT-based authentication.

    This middleware intercepts WebSocket connection requests and extracts the JWT token from
    the cookies in the connection's scope headers. It then attempts to authenticate the user
    associated with the token. If authentication is successful, the authenticated user is
    attached to the connection scope. If no token is found, or if authentication fails, an
    AnonymousUser is attached to the scope.

    Attributes:
        app (ASGI app): The next ASGI application or middleware in the stack.

    Methods:
        __call__(scope, receive, send):
            The method invoked for each WebSocket connection. It processes the connection
            to handle authentication based on the JWT token.
    """
    def __init__(self, app):
        """
        Initializes the JWTWSMiddleware with the next ASGI application.

        Args:
            app (ASGI app): The next ASGI application or middleware in the stack.
        """
        self.app = app
    
    
    async def __call__(self, scope, receive, send):
        """
        Handles the incoming WebSocket connection and attempts to authenticate the user based on the JWT token.

        This method extracts cookies from the connection's headers, retrieves the JWT token, and attempts to
        authenticate the user. If successful, the user is attached to the scope. Otherwise, an AnonymousUser
        is attached to the scope.

        Args:
            scope (dict): The connection scope, containing information about the connection.
            receive (callable): A callable to receive messages from the client.
            send (callable): A callable to send messages to the client.

        Returns:
            awaitable: Calls the next middleware or application in the stack.
        """
        logger.debug("JWTWSMiddleware: Middleware invoked")
        
        # Extract headers and cookies
        headers_dict = dict(scope["headers"])
        cookies_str = headers_dict.get(b"cookie", b"").decode("utf-8")
        
        # Log the extracted cookies for debugging purposes
        logger.debug(f"Cookies string: {cookies_str}")
        
        # Parse cookies
        try:
            # Parse the cookie string into a dictionary where keys are cookie names and values are cookie values.
            cookies = {cookie.split("=")[0]: cookie.split("=")[1] for cookie in cookies_str.split("; ") if "=" in cookie}
            logger.debug(f"Parsed cookies: {cookies}")
        except Exception as e:
            logger.error(f"Error parsing cookies: {e}")
            cookies = {} # Default to an empty dictionary if the parsing fails
            
        # Retrieve the access token form the cookies
        access_token = cookies.get("access_token")
                
        if access_token:
            logger.debug(f"Access token found: {access_token}")
            
            # Attempt to authenticate the user with the token
            user = await get_user_from_token(access_token)
            if user:
                scope["user"] = user
                logger.info(f"User {user.email} authenticated successfully")
            else:
                logger.warning("User authentication failed, treating as AnonymousUser. ")
                scope["user"] = AnonymousUser()
        else:
            logger.warning("No access token found, treating as AnonymousUser.")
            scope["user"] = AnonymousUser()
        
        return await self.app(scope, receive, send)