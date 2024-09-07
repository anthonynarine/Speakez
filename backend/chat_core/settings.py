from pathlib import Path
from decouple import config
from .logging_conf import julia_fiesta_logs
import os
from datetime import timedelta

julia_fiesta_logs()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = [
    '127.0.0.1',  # Localhost IP for backend
    'localhost',  # Localhost name for backend
    'localhost:3000',  # Localhost with port for frontend
    # You can add more hostnames or IPs here if needed
]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # 3rd party
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    # Local
    "server",
    "account", 
    "chatapp", 
    "auth_backend"
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # need to be before CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # Custom middleware for decoding jwt tokens
    # "account.auth_middleware.TokenAuthenticationMiddleware", 
    
]



ROOT_URLCONF = "chat_core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "chat_core.wsgi.application"

#....ADDED
ASGI_APPLICATION = "chat_core.asgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/


# Internationalization and Time Zone
LANGUAGE_CODE = "en-us"
TIME_ZONE = 'America/New_York'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = "static/"

# ..Added bot heeded to create a media folder (handling images)
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"



DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ... ..ADDED....
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        # "rest_framework_simplejwt.authentication.JWTAuthentication",
        # "account.authenticate.JWTCookieAuthentication",
    ],
}

# Update AUTHENTICATION_BACKENDS
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'auth_backend.backends.JWTAuthenticationBackend',
]

# CORS Headers Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://ant-django-auth-62cf01255868.herokuapp.com",
    # Additional origins...
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    "https://ant-django-auth-62cf01255868.herokuapp.com",

    # Additional trusted origins...
]

# Check if the application is running in development mode (DEBUG=True)
if DEBUG:
    # Use In-Memory Channel Layer for development and testing
    # This backend keeps all messages in memory and is suitable for local development
    # It is simple to use and requires no additional setup beyond this configuration
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels.layers.InMemoryChannelLayer",
        }
    }
else:
    # Use Redis Channel Layer for production
    # This backend uses Redis as a message broker, suitable for handling high concurrency
    # and distributing messages across multiple processes or machines
    CHANNEL_LAYERS = {
        "default": {
            # Specify the Redis Channel Layer backend
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                # Configure the Redis host and port
                # Replace "127.0.0.1" with the actual Redis server address if it's not running locally
                "hosts": [("127.0.0.1", 6379)],
            },
        },
    }