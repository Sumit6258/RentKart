from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'parent', 'is_active', 'display_order',
            'product_count', 'subcategories'
        ]
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()
    
    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(
                obj.subcategories.filter(is_active=True),
                many=True,
                context=self.context
            ).data
        return []


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list (lighter)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name',
            'daily_price', 'weekly_price', 'monthly_price',
            'main_image', 'vendor_name', 'city', 'is_available',
            'is_featured'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail (full info)"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True)
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description',
            'category', 'category_id',
            'daily_price', 'weekly_price', 'monthly_price', 'security_deposit',
            'vendor', 'vendor_name',
            'quantity', 'available_quantity',
            'main_image', 'city', 'state',
            'is_active', 'is_featured', 'is_available',
            'view_count', 'rental_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['vendor', 'view_count', 'rental_count', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Set vendor to current user
        validated_data['vendor'] = self.context['request'].user
        return super().create(validated_data)
