from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        'customer',
        'product',
        'subscription_type',
        'status',
        'total_cost',
        'start_date',
        'end_date',
    )

    list_filter = ('status', 'subscription_type')
