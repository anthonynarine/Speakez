from django.contrib import admin
from .models import UserProfile

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name')

# Register the UserProfile model with the custom admin class
admin.site.register(UserProfile, UserProfileAdmin)
