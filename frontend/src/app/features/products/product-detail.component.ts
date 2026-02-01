import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <!-- Loading State -->
      <div *ngIf="loading" class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div class="animate-pulse">
            <div class="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center py-16">
          <div class="text-6xl mb-4">😞</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <a routerLink="/products" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse All Products
          </a>
        </div>
      </div>

      <!-- Product Content -->
      <div *ngIf="product && !loading" class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Breadcrumb -->
          <div class="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <a routerLink="/" class="hover:text-blue-600">Home</a>
            <span>/</span>
            <a routerLink="/products" class="hover:text-blue-600">Products</a>
            <span>/</span>
            <span class="text-gray-900 font-medium">{{ product.name }}</span>
          </div>

          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <!-- Image Section -->
              <div>
                <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                  <img *ngIf="product.main_image" 
                       [src]="productService.getImageUrl(product.main_image)" 
                       [alt]="product.name"
                       class="w-full h-full object-cover"
                       (error)="onImageError($event)">
                  <div *ngIf="!product.main_image" class="text-8xl">📦</div>
                </div>
              </div>

              <!-- Details Section -->
              <div class="flex flex-col">
                <span class="inline-block w-fit px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-4">
                  {{ product.category_name }}
                </span>

                <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

                <div class="flex items-center gap-4 mb-6 text-gray-600">
                  <span class="flex items-center gap-1">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ product.city }}, {{ product.state }}
                  </span>
                  <span class="text-gray-400">|</span>
                  <span>By {{ product.vendor_name }}</span>
                </div>

                <!-- Pricing -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                  <h3 class="font-bold text-lg mb-4 text-gray-900">Rental Pricing</h3>
                  <div class="grid grid-cols-3 gap-4 mb-4">
                    <div class="text-center">
                      <p class="text-sm text-gray-600 mb-1">Daily</p>
                      <p class="text-2xl font-bold text-blue-600">₹{{ product.daily_price }}</p>
                    </div>
                    <div class="text-center" *ngIf="product.weekly_price">
                      <p class="text-sm text-gray-600 mb-1">Weekly</p>
                      <p class="text-2xl font-bold text-blue-600">₹{{ product.weekly_price }}</p>
                      <p class="text-xs text-green-600">Save 10%</p>
                    </div>
                    <div class="text-center" *ngIf="product.monthly_price">
                      <p class="text-sm text-gray-600 mb-1">Monthly</p>
                      <p class="text-2xl font-bold text-blue-600">₹{{ product.monthly_price }}</p>
                      <p class="text-xs text-green-600">Save 20%</p>
                    </div>
                  </div>
                  <div *ngIf="product.security_deposit" class="pt-4 border-t border-blue-200">
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">Security Deposit:</span>
                      <span class="font-semibold text-gray-900">₹{{ product.security_deposit }}</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Fully refundable after return</p>
                  </div>
                </div>

                <!-- Availability -->
                <div class="flex items-center gap-3 mb-6">
                  <span *ngIf="product.is_available" class="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    Available Now
                  </span>
                  <span *ngIf="!product.is_available" class="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
                    ✗ Currently Unavailable
                  </span>
                  <span class="text-sm text-gray-600">
                    {{ product.available_quantity }} of {{ product.quantity }} available
                  </span>
                </div>

                <!-- CTA Buttons -->
                <div class="space-y-3 mb-8">
                  <button (click)="rentNow()" 
                          [disabled]="!product.is_available"
                          class="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    🛒 Rent Now
                  </button>
                  <button class="w-full py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition">
                    💬 Contact Vendor
                  </button>
                </div>

                <!-- Description -->
                <div class="border-t pt-6">
                  <h3 class="text-xl font-bold mb-3">Description</h3>
                  <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ product.description || 'No description available.' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Similar Products -->
          <div *ngIf="similarProducts.length > 0" class="mt-12">
            <h2 class="text-2xl font-bold mb-6">Similar Products</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div *ngFor="let similar of similarProducts" 
                   (click)="viewProduct(similar.slug)"
                   class="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer">
                <div class="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img [src]="productService.getImageUrl(similar.main_image)" 
                       [alt]="similar.name"
                       class="w-full h-full object-cover"
                       (error)="onImageError($event)">
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ similar.name }}</h3>
                  <p class="text-lg font-bold text-blue-600">₹{{ similar.daily_price }}/day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  similarProducts: any[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string) {
    this.loading = true;
    this.productService.getProductDetail(slug).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        this.loadSimilarProducts(product.category ?? '');
      },
      error: (err) => {
        this.error = 'Product not found or unavailable';
        this.loading = false;
      }
    });
  }

  loadSimilarProducts(categoryId: string) {
    this.productService.getProducts({ category: categoryId }).subscribe({
      next: (products) => {
        this.similarProducts = products
          .filter(p => p.id !== this.product.id)
          .slice(0, 4);
      },
      error: (err) => console.error('Error loading similar products:', err)
    });
  }

  rentNow() {
    if (!this.authService.isAuthenticated) {
      this.toastService.info('Please login to rent this product');
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Navigate to rent confirmation page
    this.router.navigate(['/rent', this.product.slug]);
  }

  viewProduct(slug: string) {
    this.router.navigate(['/products', slug]);
    window.scrollTo(0, 0);
  }

  onImageError(event: any) {
    event.target.src = '/assets/placeholder-product.png';
  }
}
