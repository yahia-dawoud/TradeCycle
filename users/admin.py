from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'full_name', 'rating', 'report_count', 'is_banned', 'created_at']
    list_filter = ['is_banned', 'created_at']
    search_fields = ['username', 'email', 'full_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('full_name', 'date_of_birth', 'location', 'latitude', 'longitude', 'interests')
        }),
        ('Rating & Reports', {
            'fields': ('rating', 'total_ratings', 'report_count', 'is_banned')
        }),
    )

