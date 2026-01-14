from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'email', 'created_at')
    search_fields = ('phone', 'name')
