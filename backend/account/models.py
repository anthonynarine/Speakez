# account/models.py

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .manager import CustomUserManager  

class Account(AbstractUser):
    """
    Custom user model where email is the unique identifier for authentication
    instead of usernames.
    """
    email = models.EmailField(
        _('email address'),
        unique=True,
        help_text='Enter your email address. Used for login.'
    )
    first_name = models.CharField(
        max_length=26,
        verbose_name='First Name',
        help_text='Enter your first name.'
    )
    last_name = models.CharField(
        max_length=26,
        verbose_name='Last Name',
        help_text='Enter your last name.'
    )
    username = None  # Username is not used in this model.
    tfa_secret = models.CharField(
        max_length=255,
        default='',
        blank=True,
        help_text='Secret key for two-factor authentication. Leave blank if unsure.'
    )
    is_2fa_enabled = models.BooleanField(
        default=False,
        verbose_name='Is 2FA Enabled',
        help_text='Check this if you wish to enable two-factor authentication.'
    )
    is_2fa_setup_in_progress = models.BooleanField(
        default=False,
        verbose_name="Is 2FA Setup in Progress",
        help_text="Tracks whether the 2FA setup process is ongoing"
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

# Other models like UserToken, Reset, and TemporarySecurityToken can be copied over similarly
