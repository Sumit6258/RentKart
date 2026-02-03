from django.urls import path
from . import views

urlpatterns = [
    path('', views.CustomerListView.as_view(), name='customer-list'),
    path('profile/', views.customer_profile_view, name='customer-profile'),
]
