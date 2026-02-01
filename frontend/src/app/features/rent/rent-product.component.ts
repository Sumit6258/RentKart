import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-rent-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-3xl font-bold mb-8">Complete Your Rental</h1>

        <div *ngIf="product" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Rental Form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">Rental Details</h2>
              
              <form [formGroup]="rentalForm" (ngSubmit)="submitRental()">
                <!-- Duration Type -->
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-3">Rental Duration</label>
                  <div class="grid grid-cols-3 gap-3">
                    <label *ngFor="let type of durationTypes" 
                           class="relative cursor-pointer">
                      <input type="radio" formControlName="duration_type" [value]="type.value" class="sr-only">
                      <div [class.border-blue-600]="rentalForm.get('duration_type')?.value === type.value"
                           [class.bg-blue-50]="rentalForm.get('duration_type')?.value === type.value"
                           class="border-2 rounded-lg p-4 text-center transition">
                        <p class="font-semibold">{{ type.label }}</p>
                        <p class="text-2xl font-bold text-blue-600 mt-2">₹{{ getPrice(type.value) }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ type.days }} days</p>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Start Date -->
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input type="date" formControlName="start_date" [min]="minDate"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Terms -->
                <div class="mb-6">
                  <label class="flex items-start gap-2">
                    <input type="checkbox" formControlName="acceptTerms"
                           class="mt-1 w-4 h-4 text-blue-600 rounded">
                    <span class="text-sm text-gray-700">
                      I agree to the <a href="#" class="text-blue-600 hover:underline">terms and conditions</a> 
                      and rental policy
                    </span>
                  </label>
                </div>

                <button type="submit" 
                        [disabled]="rentalForm.invalid || loading"
                        class="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  <span *ngIf="!loading">Confirm Rental</span>
                  <span *ngIf="loading">Processing...</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 class="font-bold text-lg mb-4">Order Summary</h3>
              
              <div class="flex gap-3 mb-4 pb-4 border-b">
                <img [src]="productService.getImageUrl(product.main_image)" 
                     [alt]="product.name"
                     class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1">
                  <h4 class="font-semibold text-sm line-clamp-2">{{ product.name }}</h4>
                  <p class="text-xs text-gray-600">{{ product.category_name }}</p>
                </div>
              </div>

              <div class="space-y-3 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Rental Cost</span>
                  <span class="font-semibold">₹{{ getPrice(rentalForm.get('duration_type')?.value) }}</span>
                </div>
                <div class="flex justify-between text-sm" *ngIf="product.security_deposit">
                  <span class="text-gray-600">Security Deposit</span>
                  <span class="font-semibold">₹{{ product.security_deposit }}</span>
                </div>
                <div class="border-t pt-3 flex justify-between">
                  <span class="font-bold">Total</span>
                  <span class="font-bold text-xl text-blue-600">
                    ₹{{ getTotalAmount() }}
                  </span>
                </div>
              </div>

              <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                <p class="text-xs text-green-800">
                  ✓ Security deposit will be refunded after return
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RentProductComponent implements OnInit {
  product: any = null;
  rentalForm: FormGroup;
  loading = false;
  minDate = '';

  durationTypes = [
    { value: 'daily', label: 'Daily', days: 1 },
    { value: 'weekly', label: 'Weekly', days: 7 },
    { value: 'monthly', label: 'Monthly', days: 30 }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.rentalForm = this.fb.group({
      duration_type: ['daily', Validators.required],
      start_date: [this.minDate, Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    }
  }

  loadProduct(slug: string) {
    this.productService.getProductDetail(slug).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: () => {
        this.toastService.error('Product not found');
        this.router.navigate(['/products']);
      }
    });
  }

  getPrice(durationType: string): number {
    if (!this.product) return 0;
    
    switch (durationType) {
      case 'daily':
        return this.product.daily_price;
      case 'weekly':
        return this.product.weekly_price || (this.product.daily_price * 7 * 0.9);
      case 'monthly':
        return this.product.monthly_price || (this.product.daily_price * 30 * 0.8);
      default:
        return this.product.daily_price;
    }
  }

  getTotalAmount(): number {
    const rentalCost = this.getPrice(this.rentalForm.get('duration_type')?.value);
    const deposit = this.product?.security_deposit || 0;
    return rentalCost + deposit;
  }

  submitRental() {
    if (this.rentalForm.valid && this.product) {
      this.loading = true;

      const rentalData = {
        product: this.product.id,
        duration_type: this.rentalForm.value.duration_type,
        start_date: this.rentalForm.value.start_date
      };

      this.http.post(`${environment.apiUrl}/subscriptions/create/`, rentalData).subscribe({
        next: (response: any) => {
          this.toastService.success('Rental created successfully!');
          this.router.navigate(['/dashboard/rentals']);
        },
        error: (err) => {
          this.toastService.error('Failed to create rental. Please try again.');
          this.loading = false;
        }
      });
    }
  }
}
