from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from datetime import date, timedelta

from .models import Subscription
from .serializers import SubscriptionSerializer
from products.models import Product
from customers.models import Customer

class SubscriptionViewSet(ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [AllowAny]   # ✅ THIS LINE IS CRITICAL

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        subscription_type = request.data.get('subscription_type')

        product = Product.objects.get(id=product_id)

        customer, _ = Customer.objects.get_or_create(
            phone="9999999999",
            defaults={"name": "Guest User"}
        )

        start_date = date.today()

        if subscription_type == 'weekly':
            end_date = start_date + timedelta(days=7)
            multiplier = 1
        elif subscription_type == 'monthly':
            end_date = start_date + timedelta(days=30)
            multiplier = 4
        else:
            end_date = start_date + timedelta(days=90)
            multiplier = 12

        total_cost = product.price * multiplier

        subscription = Subscription.objects.create(
            customer=customer,
            product=product,
            subscription_type=subscription_type,
            start_date=start_date,
            end_date=end_date,
            total_cost=total_cost,
            status='active'
        )

        serializer = self.get_serializer(subscription)
        return Response(serializer.data)
