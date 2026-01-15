from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
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
    parser_classes = [MultiPartParser, FormParser]


class ProductPublicViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny] #
    http_method_names = ['get'] #
