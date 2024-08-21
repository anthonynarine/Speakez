from urllib.parse import parse_qs
from  channels.middleware import BaseMiddleware # BaseMiddleware for ASGI MiddlewareMixin for WSGI
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
import jwt
from account.models import UserProfile
from decouple import config

@database_sync_to_async
def get_user_from_token(token):
    """
    Retrieve a user based on the provided JWT token.
    
    This function decodes the JWT token using the secret key, extracts the user ID from the token playload
    and fetches the corresponding UserProfile object from the database.
    
    Args:
        token (str:) The JWT token to be decoded and validated
        
    Returns:
        UserProfile or None: The UserProfile object if the token is valid and the user exists;
                            None if the token is expired, invalid or the user does not exist. 
    """
    try:
        # Decode the JWT using the access secret key
        payload = jwt.decode(token, config("JWT_ACCESS_SECRET"), algorithms=["HS256"])
        
        # Extract the user ID from the token payload
        user_id = payload.get("user_id")
        
        # Fetch the corresponding UserProfile from the database
        return UserProfile.objects.get(pk=user_id)
    
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, UserProfile.DoesNotExist):
        # Return None if the toke is expired, invalid or the user is not found. 
        return None