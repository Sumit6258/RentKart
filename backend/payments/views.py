from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.http import HttpResponse
from .models import Payment, Invoice
from .serializers import PaymentSerializer, InvoiceSerializer, ProcessPaymentSerializer
from subscriptions.models import Subscription
import random

# PDF Generation
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from io import BytesIO
import qrcode
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics import renderPDF


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_invoice_pdf(request, invoice_id):
    """Generate and download invoice PDF"""
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        subscription = invoice.subscription
        
        # Create PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1E40AF'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        story.append(Paragraph('RENTKART INVOICE', title_style))
        story.append(Spacer(1, 0.3 * inch))
        
        # Invoice Info
        info_data = [
            ['Invoice Number:', invoice.invoice_number],
            ['Invoice Date:', invoice.invoice_date.strftime('%B %d, %Y')],
            ['Payment Status:', 'PAID' if invoice.is_paid else 'UNPAID'],
            ['Transaction ID:', invoice.payment.transaction_id if invoice.payment else 'N/A'],
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 3*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#EFF6FF')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        story.append(info_table)
        story.append(Spacer(1, 0.5 * inch))
        
        # Product Details
        story.append(Paragraph('Rental Details', styles['Heading2']))
        story.append(Spacer(1, 0.2 * inch))
        
        product_data = [
            ['Product', 'Duration', 'Start Date', 'End Date', 'Amount'],
            [
                subscription.product.name,
                subscription.duration_type.capitalize(),
                subscription.start_date.strftime('%d/%m/%Y'),
                subscription.end_date.strftime('%d/%m/%Y'),
                f'₹{float(invoice.rental_amount):,.2f}'
            ]
        ]
        
        product_table = Table(product_data, colWidths=[2*inch, 1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])
        product_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E40AF')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(product_table)
        story.append(Spacer(1, 0.5 * inch))
        
        # Amount Breakdown
        amount_data = [
            ['Rental Amount:', f'₹{float(invoice.rental_amount):,.2f}'],
            ['GST (18%):', f'₹{float(invoice.gst_amount):,.2f}'],
            ['Security Deposit:', f'₹{float(invoice.security_deposit):,.2f}'],
            ['Total Amount:', f'₹{float(invoice.total_amount):,.2f}']
        ]
        
        amount_table = Table(amount_data, colWidths=[4*inch, 2*inch])
        amount_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -1), (-1, -1), 12),
            ('LINEABOVE', (0, -1), (-1, -1), 2, colors.black),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#EFF6FF')),
            ('TOPPADDING', (0, -1), (-1, -1), 12),
            ('BOTTOMPADDING', (0, -1), (-1, -1), 12),
        ]))
        story.append(amount_table)
        story.append(Spacer(1, 0.5 * inch))
        
        # Footer
        footer_text = "Thank you for choosing Rentkart! For support, contact: support@rentkart.com"
        story.append(Paragraph(footer_text, styles['Normal']))
        
        # Build PDF
        doc.build(story)
        
        # Return PDF
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
        return response
        
    except Invoice.DoesNotExist:
        return HttpResponse('Invoice not found', status=404)