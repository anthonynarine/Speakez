import jwt
import logging
from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from account.models import UserProfile  # Adjust this import if necessary

# Set up logging for the authentication backend
logger = logging.getLogger(__name__)

class JWTAuthenticationBackend(BaseBackend):
    """
    Custom authentication backend for handling JWT token-based authentication.

    This backend decodes a JWT token from the request, retrieves the associated
    user profile, and returns the user object if authentication is successful.

    Attributes:
        None

    Methods:
        authenticate(request, token=None):
            Authenticates a user based on the JWT token provided in the request.
        get_user(user_id):
            Retrieves a user instance by their user ID.
    """

    def authenticate(self, request, token=None):
        """
        Authenticate a user based on the JWT token provided.

        This method extracts and decodes the JWT token to retrieve the user's ID.
        If the token is valid and the user exists, the user object is returned.
        If the token is invalid, expired, or the user does not exist, None is returned.

        Parameters:
            request (HttpRequest): The current HTTP request object.
            token (str): The JWT token provided for authentication.

        Returns:
            UserProfile: The authenticated user profile if successful, or None if not.
        """
        if token is None:
            logger.debug("No token provided in the request.")
            return None

        try:
            # Decode the JWT token to extract the user ID
            logger.debug("Decoding JWT token.")
            payload = jwt.decode(token, settings.JWT_ACCESS_SECRET, algorithms=["HS256"])
            user_id = payload.get("user_id")
            logger.debug(f"Token payload decoded successfully. User ID: {user_id}")

            # Fetch the user from the database based on the user ID
            user = UserProfile.objects.get(pk=user_id)
            logger.info(f"User {user_id} authenticated successfully via JWT.")
            return user
        
        except jwt.ExpiredSignatureError:
            # Handle expired tokens
            logger.warning("JWT token has expired.")
            return None
        
        except jwt.InvalidTokenError:
            # Handle invalid tokens
            logger.error("Invalid JWT token.")
            return None
        
        except UserProfile.DoesNotExist:
            # Handle non-existent users
            logger.error(f"User with ID {user_id} does not exist.")
            return None

    def get_user(self, user_id):
        """
        Retrieve a user instance by user_id.

        This method is used by Django to fetch a user instance from the database.
        It is typically called after the user has been authenticated.

        Parameters:
            user_id (int): The ID of the user to retrieve.

        Returns:
            UserProfile: The user profile object if found, or None if the user does not exist.
        """
        try:
            # Attempt to retrieve the user by their ID
            return UserProfile.objects.get(pk=user_id)
        except UserProfile.DoesNotExist:
            # Log an error if the user does not exist
            logger.error(f"User with ID {user_id} not found.")
            return None
