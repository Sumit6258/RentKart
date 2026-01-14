from rest_framework.viewsets import ModelViewSet
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from permissions import IsAdminUserOnly
from rest_framework.permissions import AllowAny

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOnly]


class ProductAdminViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserOnly]


class ProductPublicViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get']
