import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { InrCurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="min-h-screen bg-gray-900">
      <!-- Admin Header -->
      <nav class="bg-gray-800 border-b border-gray-700">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🔐</div>
              <h1 class="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-gray-400 text-sm">{{ user?.email }}</span>
              <button (click)="logout()"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container mx-auto px-4 py-8">
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">��</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.total_users }}</p>
            <p class="text-gray-400 text-sm">Total Users</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🛒</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.total_customers }}</p>
            <p class="text-gray-400 text-sm">Customers</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🏪</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.total_vendors }}</p>
            <p class="text-gray-400 text-sm">Vendors</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">📦</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.total_products }}</p>
            <p class="text-gray-400 text-sm">Products</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🎯</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.active_rentals }}</p>
            <p class="text-gray-400 text-sm">Active Rentals</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">💰</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.monthly_revenue | inrCurrency }}</p>
            <p class="text-gray-400 text-sm">Monthly Revenue</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div class="border-b border-gray-700">
            <nav class="flex">
              <button (click)="activeTab = 'users'"
                      [class.border-red-500]="activeTab === 'users'"
                      [class.text-white]="activeTab === 'users'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Users
              </button>
              <button (click)="activeTab = 'products'"
                      [class.border-red-500]="activeTab === 'products'"
                      [class.text-white]="activeTab === 'products'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Products
              </button>
              <button (click)="activeTab = 'rentals'"
                      [class.border-red-500]="activeTab === 'rentals'"
                      [class.text-white]="activeTab === 'rentals'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Rentals
              </button>
              <button (click)="activeTab = 'payments'"
                      [class.border-red-500]="activeTab === 'payments'"
                      [class.text-white]="activeTab === 'payments'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Payments
              </button>
            </nav>
          </div>

          <!-- Users Tab -->
          <div *ngIf="activeTab === 'users'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">User Management</h2>
              <div class="flex gap-2">
                <button (click)="filterUsers('all')"
                        [class.bg-red-600]="userFilter === 'all'"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                  All
                </button>
                <button (click)="filterUsers('customer')"
                        [class.bg-red-600]="userFilter === 'customer'"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                  Customers
                </button>
                <button (click)="filterUsers('vendor')"
                        [class.bg-red-600]="userFilter === 'vendor'"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                  Vendors
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Name</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Role</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Joined</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of filteredUsers" class="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td class="py-3 px-4 text-white">{{ user.email }}</td>
                    <td class="py-3 px-4 text-white">{{ user.full_name || 'N/A' }}</td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-bold capitalize"
                            [class.bg-blue-600]="user.role === 'customer'"
                            [class.bg-purple-600]="user.role === 'vendor'"
                            [class.bg-red-600]="user.role === 'admin'"
                            class="text-white">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-bold"
                            [class.bg-green-600]="user.is_active"
                            [class.bg-red-600]="!user.is_active"
                            class="text-white">
                        {{ user.is_active ? 'Active' : 'Blocked' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-400">{{ user.date_joined | date:'shortDate' }}</td>
                    <td class="py-3 px-4">
                      <button (click)="toggleUser(user)"
                              [class.bg-red-600]="user.is_active"
                              [class.bg-green-600]="!user.is_active"
                              class="px-4 py-2 text-white rounded-lg hover:opacity-80 transition text-sm font-semibold">
                        {{ user.is_active ? 'Block' : 'Activate' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Products Tab -->
          <div *ngIf="activeTab === 'products'" class="p-6">
            <h2 class="text-2xl font-bold text-white mb-6">Product Management</h2>
            
            <div class="space-y-4">
              <div *ngFor="let product of products" 
                   class="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
                <img [src]="getProductImage(product.main_image)" 
                     [alt]="product.name"
                     class="w-20 h-20 object-cover rounded-lg">
                
                <div class="flex-1">
                  <h3 class="font-bold text-white mb-1">{{ product.name }}</h3>
                  <div class="flex gap-4 text-sm text-gray-400">
                    <span>{{ product.category_name }}</span>
                    <span>{{ product.daily_price | inrCurrency }}/day</span>
                    <span>{{ product.city }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-bold"
                        [class.bg-green-600]="product.is_active"
                        [class.bg-gray-600]="!product.is_active"
                        class="text-white">
                    {{ product.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Rentals Tab -->
          <div *ngIf="activeTab === 'rentals'" class="p-6">
            <h2 class="text-2xl font-bold text-white mb-6">Rental Management</h2>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Product</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Duration</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Start Date</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">End Date</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let rental of rentals" class="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td class="py-3 px-4 text-white">{{ rental.product_details?.name || 'N/A' }}</td>
                    <td class="py-3 px-4 text-white capitalize">{{ rental.duration_type }}</td>
                    <td class="py-3 px-4 text-gray-400">{{ rental.start_date | date:'shortDate' }}</td>
                    <td class="py-3 px-4 text-gray-400">{{ rental.end_date | date:'shortDate' }}</td>
                    <td class="py-3 px-4 text-white">{{ rental.total_amount | inrCurrency }}</td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-bold capitalize"
                            [class.bg-yellow-600]="rental.status === 'pending'"
                            [class.bg-green-600]="rental.status === 'active'"
                            [class.bg-gray-600]="rental.status === 'completed'"
                            class="text-white">
                        {{ rental.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payments Tab -->
          <div *ngIf="activeTab === 'payments'" class="p-6">
            <h2 class="text-2xl font-bold text-white mb-6">Payment Management</h2>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Transaction ID</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Method</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let payment of payments" class="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td class="py-3 px-4 text-white font-mono text-sm">{{ payment.transaction_id }}</td>
                    <td class="py-3 px-4 text-white capitalize">{{ payment.payment_method }}</td>
                    <td class="py-3 px-4 text-white">{{ payment.amount | inrCurrency }}</td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-bold capitalize"
                            [class.bg-yellow-600]="payment.status === 'pending'"
                            [class.bg-green-600]="payment.status === 'success'"
                            [class.bg-red-600]="payment.status === 'failed'"
                            class="text-white">
                        {{ payment.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-400">{{ payment.created_at | date:'short' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  user: any = null;
  activeTab = 'users';
  userFilter = 'all';
  
  stats = {
    total_users: 0,
    total_customers: 0,
    total_vendors: 0,
    total_products: 0,
    active_rentals: 0,
    monthly_revenue: 0
  };
  
  users: any[] = [];
  products: any[] = [];
  rentals: any[] = [];
  payments: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUser;
    
    if (this.user?.role !== 'admin') {
      this.toastService.error('Access denied');
      this.router.navigate(['/']);
      return;
    }

    this.loadStats();
    this.loadUsers();
    this.loadProducts();
    this.loadRentals();
    this.loadPayments();
  }

  loadStats() {
    this.http.get(`${environment.apiUrl}/auth/admin/stats/`).subscribe({
      next: (data: any) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  loadUsers() {
    const url = this.userFilter === 'all' 
      ? `${environment.apiUrl}/auth/admin/users/`
      : `${environment.apiUrl}/auth/admin/users/?role=${this.userFilter}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/products/`).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  loadRentals() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/rentals/`).subscribe({
      next: (rentals) => {
        this.rentals = rentals;
      },
      error: (err) => console.error('Error loading rentals:', err)
    });
  }

  loadPayments() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/payments/`).subscribe({
      next: (payments) => {
        this.payments = payments;
      },
      error: (err) => console.error('Error loading payments:', err)
    });
  }

  filterUsers(filter: string) {
    this.userFilter = filter;
    this.loadUsers();
  }

  get filteredUsers() {
    return this.users;
  }

  toggleUser(user: any) {
    this.http.patch(`${environment.apiUrl}/auth/admin/users/${user.id}/toggle/`, {}).subscribe({
      next: (response: any) => {
        this.toastService.success(response.message);
        this.loadUsers();
        this.loadStats();
      },
      error: (err) => {
        this.toastService.error('Failed to update user');
      }
    });
  }

  getProductImage(imagePath: string | undefined): string {
    if (!imagePath) return '/assets/placeholder-product.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  }

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out');
    this.router.navigate(['/admin-login']);
  }
}
