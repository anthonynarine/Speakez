import jwt
import logging
from decouple import config
from rest_framework import status
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from account.models import UserProfile
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger(__name__)

class TokenAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware for JWT token-based user authentication using the UserProfile model.
    This middleware checks for an "access_token" in the cookies of each incoming request.
    If a valid token is found, it decodes the token to retrieve the user's ID, fetches 
    the corresponding user profile from the database, and attaches it to the request.
    If the token is invalid, expired, or not present, it sets the request's user to 
    AnonymousUser, indicating an unauthenticated or improperly authenticated request.
    """

    def __call__(self, request):
        access_secret = config("JWT_ACCESS_SECRET")
        token = request.COOKIES.get("access_token")
        
        if token:
            try:
                # Decode the JWT token to validate and extract user information
                logger.debug(f"Token found: {token}")
                payload = jwt.decode(token, access_secret, algorithms=["HS256"])
                user_id = payload.get("user_id")
                logger.debug(f"Token payload: {payload}")

                # Fetch the user from the database and attach it to the request
                request.user = UserProfile.objects.get(pk=user_id)
                logger.debug(f"User {user_id} authenticated successfully via JWT.")
                
            except jwt.ExpiredSignatureError:
                logger.info("Expired token received.")
                return JsonResponse({"error": "Token has expired. Please log in again."}, status=status.HTTP_401_UNAUTHORIZED)
            
            except (jwt.InvalidTokenError, UserProfile.DoesNotExist):
                logger.warning("Invalid token or user profile does not exist.")
                return JsonResponse({"error": "Invalid token. Please log in again."}, status=status.HTTP_401_UNAUTHORIZED)
        
        else:
            # No token found, set the user to AnonymousUser
            request.user = AnonymousUser()
            
        # Proceed to the next middleware or the view
        return self.get_response(request)
