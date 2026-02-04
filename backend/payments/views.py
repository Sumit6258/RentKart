from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Payment, Invoice
from .serializers import PaymentSerializer, InvoiceSerializer, ProcessPaymentSerializer
from subscriptions.models import Subscription
import random


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request):
    """Simulated payment processing"""
    serializer = ProcessPaymentSerializer(data=request.data)
    
    if serializer.is_valid():
        subscription_id = serializer.validated_data['subscription_id']
        payment_method = serializer.validated_data['payment_method']
        
        try:
            subscription = Subscription.objects.get(id=subscription_id)
            
            # Create payment record
            payment = Payment.objects.create(
                subscription=subscription,
                payment_method=payment_method,
                amount=subscription.total_amount,
                status='pending'
            )
            
            # Simulate payment processing (80% success rate)
            success = random.random() < 0.8
            
            if success:
                payment.status = 'success'
                payment.payment_date = timezone.now()
                payment.save()
                
                # Update subscription status
                subscription.status = 'active'
                subscription.save()
                
                # Create invoice
                invoice = Invoice.objects.create(
                    subscription=subscription,
                    payment=payment,
                    rental_amount=subscription.total_amount - (subscription.security_deposit or 0),
                    security_deposit=subscription.security_deposit or 0,
                    is_paid=True,
                    paid_date=timezone.now()
                )
                
                return Response({
                    'success': True,
                    'message': 'Payment successful!',
                    'payment': PaymentSerializer(payment).data,
                    'invoice': InvoiceSerializer(invoice).data
                }, status=status.HTTP_200_OK)
            else:
                payment.status = 'failed'
                payment.save()
                
                return Response({
                    'success': False,
                    'message': 'Payment failed. Please try again.',
                    'payment': PaymentSerializer(payment).data
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except Subscription.DoesNotExist:
            return Response({
                'error': 'Subscription not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    """Get user's payment history"""
    from customers.models import Customer
    
    try:
        customer = Customer.objects.get(user=request.user)
        subscriptions = Subscription.objects.filter(customer=customer)
        payments = Payment.objects.filter(subscription__in=subscriptions)
        
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
    except Customer.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def invoice_list(request):
    """Get user's invoices"""
    from customers.models import Customer
    
    try:
        customer = Customer.objects.get(user=request.user)
        subscriptions = Subscription.objects.filter(customer=customer)
        invoices = Invoice.objects.filter(subscription__in=subscriptions)
        
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)
    except Customer.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def invoice_detail(request, invoice_id):
    """Get invoice details"""
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)
    except Invoice.DoesNotExist:
        return Response({
            'error': 'Invoice not found'
        }, status=status.HTTP_404_NOT_FOUND)
