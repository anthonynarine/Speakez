# account/models.py

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .manager import CustomUserManager  

class Account(AbstractUser):
    pass

# account/models.py
from django.db import models

class UserProfile(models.Model):
    """
    A model to store user profile information retrieved from the auth API.
    """
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
