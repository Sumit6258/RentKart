from rest_framework import serializers
from .models import Customer
from users.serializers import UserSerializer


class CustomerSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Customer
        fields = [
            'id', 'user', 'user_details',
            'address', 'city', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']


class UpdateCustomerProfileSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    city = serializers.CharField(required=False)
