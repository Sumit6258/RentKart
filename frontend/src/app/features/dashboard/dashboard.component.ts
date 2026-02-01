import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-8">My Dashboard</h1>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="text-center mb-6">
                <div class="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3">
                  {{ getUserInitial() }}
                </div>
                <h3 class="font-bold text-lg">{{ user?.full_name || user?.email }}</h3>
                <p class="text-sm text-gray-600">{{ user?.role }}</p>
              </div>

              <nav class="space-y-2">
                <a [routerLink]="['/dashboard']" [queryParams]="{tab: 'rentals'}"
                   class="block px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                  🛍️ My Rentals
                </a>
                <a [routerLink]="['/dashboard']" [queryParams]="{tab: 'profile'}"
                   class="block px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                  👤 Profile
                </a>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- My Rentals -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-6">My Rentals</h2>

              <!-- Loading -->
              <div *ngIf="loadingRentals" class="space-y-4">
                <div *ngFor="let i of [1,2,3]" class="animate-pulse border rounded-lg p-4">
                  <div class="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>

              <!-- Rentals List -->
              <div *ngIf="!loadingRentals && rentals.length > 0" class="space-y-4">
                <div *ngFor="let rental of rentals" 
                     class="border rounded-xl p-6 hover:shadow-lg transition">
                  <div class="flex gap-4">
                    <img [src]="productService.getImageUrl(rental.product_details?.main_image)" 
                         [alt]="rental.product_details?.name"
                         class="w-24 h-24 object-cover rounded-lg">
                    
                    <div class="flex-1">
                      <h3 class="font-bold text-lg mb-2">{{ rental.product_details?.name }}</h3>
                      <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p class="text-gray-600">Start Date</p>
                          <p class="font-semibold">{{ rental.start_date }}</p>
                        </div>
                        <div>
                          <p class="text-gray-600">End Date</p>
                          <p class="font-semibold">{{ rental.end_date }}</p>
                        </div>
                        <div>
                          <p class="text-gray-600">Duration</p>
                          <p class="font-semibold capitalize">{{ rental.duration_type }}</p>
                        </div>
                        <div>
                          <p class="text-gray-600">Total Amount</p>
                          <p class="font-semibold text-blue-600">₹{{ rental.total_amount }}</p>
                        </div>
                      </div>

                      <!-- Status & Days Remaining -->
                      <div class="flex items-center gap-4">
                        <span [class]="getStatusClass(rental.status)"
                              class="px-3 py-1 rounded-full text-sm font-semibold">
                          {{ rental.status | uppercase }}
                        </span>
                        <span *ngIf="rental.days_remaining > 0" 
                              class="text-sm text-gray-600">
                          {{ rental.days_remaining }} days remaining
                        </span>
                      </div>

                      <!-- Progress Bar -->
                      <div *ngIf="rental.is_active" class="mt-4">
                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div class="h-full bg-blue-600 transition-all"
                               [style.width.%]="getRentalProgress(rental)"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div *ngIf="!loadingRentals && rentals.length === 0" 
                   class="text-center py-16">
                <div class="text-6xl mb-4">🛍️</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">No Rentals Yet</h3>
                <p class="text-gray-600 mb-6">Start browsing products to create your first rental</p>
                <a routerLink="/products" 
                   class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Browse Products
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: any = null;
  rentals: any[] = [];
  loadingRentals = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public productService: ProductService
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUser;
    this.loadRentals();
  }

  loadRentals() {
    this.loadingRentals = true;
    this.http.get<any[]>(`${environment.apiUrl}/subscriptions/`).subscribe({
      next: (rentals) => {
        this.rentals = rentals;
        this.loadingRentals = false;
      },
      error: (err) => {
        console.error('Error loading rentals:', err);
        this.loadingRentals = false;
      }
    });
  }

  getUserInitial(): string {
    if (this.user?.first_name) {
      return this.user.first_name.charAt(0).toUpperCase();
    }
    if (this.user?.email) {
      return this.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getRentalProgress(rental: any): number {
    const start = new Date(rental.start_date).getTime();
    const end = new Date(rental.end_date).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  }
}
