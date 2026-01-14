from rest_framework.viewsets import ModelViewSet
from .models import Subscription
from .serializers import SubscriptionSerializer
from permissions import IsAdminUserOnly


class SubscriptionViewSet(ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAdminUserOnly]
