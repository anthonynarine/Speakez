# account/models.py

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .manager import CustomUserManager  

class Account(AbstractUser):
    pass
