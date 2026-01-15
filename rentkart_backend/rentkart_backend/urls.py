from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from products.views import CategoryViewSet, ProductAdminViewSet, ProductPublicViewSet
from customers.views import CustomerViewSet
from subscriptions.views import SubscriptionViewSet
from users.views import SendOTPView, VerifyOTPView


router = DefaultRouter()

router.register(
    r'admin/categories',
    CategoryViewSet,
    basename='admin-categories'
)

router.register(
    r'admin/products',
    ProductAdminViewSet,
    basename='admin-products'
)

router.register(
    r'products',
    ProductPublicViewSet,
    basename='public-products'
)

router.register(
    r'customers',
    CustomerViewSet,
    basename='customers'
)

router.register(
    r'admin/subscriptions',
    SubscriptionViewSet,
    basename='admin-subscriptions'
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/send-otp/', SendOTPView.as_view()),
    path('api/auth/verify-otp/', VerifyOTPView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
