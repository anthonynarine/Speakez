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
