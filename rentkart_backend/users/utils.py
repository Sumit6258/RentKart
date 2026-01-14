import requests
from django.conf import settings

def send_telegram_otp(otp):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": f"🔐 Rentkart Login OTP: {otp}"
    }
    requests.post(url, json=payload)
