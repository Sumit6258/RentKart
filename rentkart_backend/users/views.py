import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone

from .models import OTP, User
from .utils import send_telegram_otp
from rest_framework_simplejwt.tokens import RefreshToken


class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone')

        if not User.objects.filter(phone=phone).exists():
            return Response({"error": "Admin not found"}, status=404)

        otp = str(random.randint(100000, 999999))
        OTP.objects.create(phone=phone, otp=otp)

        send_telegram_otp(otp)

        return Response({"message": "OTP sent successfully"})

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')

        otp_obj = OTP.objects.filter(phone=phone, otp=otp).last()

        if not otp_obj:
            return Response({"error": "Invalid OTP"}, status=400)

        user = User.objects.get(phone=phone)
        token = RefreshToken.for_user(user)

        return Response({
            "refresh": str(token),
            "access": str(token.access_token),
        })

