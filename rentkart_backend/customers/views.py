from rest_framework.viewsets import ModelViewSet
from .models import Customer
from .serializers import CustomerSerializer
from rest_framework.permissions import AllowAny

class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']
