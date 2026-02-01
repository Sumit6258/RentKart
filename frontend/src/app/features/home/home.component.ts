import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Category, Product } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-24">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Rent Anything, Anytime
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-blue-100">
              From electronics to furniture - rent what you need, when you need it
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button (click)="navigateToProducts()" 
                      class="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transform hover:scale-105 transition shadow-lg">
                🔍 Browse Products
              </button>
              <a routerLink="/auth/register" 
                 class="px-8 py-4 border-2 border-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition">
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Section -->
      <div class="container mx-auto px-4 py-16">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Browse by Category</h2>
          <a routerLink="/products" class="text-blue-600 hover:text-blue-700 font-semibold">
            View All →
          </a>
        </div>
        
        <!-- Loading State -->
        <div *ngIf="loadingCategories" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div *ngFor="let i of [1,2,3,4]" class="bg-white p-6 rounded-xl shadow animate-pulse">
            <div class="h-16 w-16 bg-gray-200 rounded-lg mb-4"></div>
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div *ngIf="!loadingCategories" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div *ngFor="let category of categories" 
               (click)="viewCategoryProducts(category.slug)"
               class="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 border border-transparent hover:border-blue-200">
            <div class="text-5xl mb-4">📦</div>
            <h3 class="text-xl font-bold mb-2 text-gray-900">{{ category.name }}</h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ category.description }}</p>
            <p class="text-blue-600 font-semibold text-sm">{{ category.product_count }} items available</p>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loadingCategories && categories.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">📦</div>
          <p class="text-gray-600 text-lg">No categories available yet</p>
        </div>
      </div>

      <!-- Featured Products Section -->
      <div class="bg-white py-16">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900">Featured Products</h2>
            <a routerLink="/products" [queryParams]="{is_featured: true}" 
               class="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </a>
          </div>

          <!-- Loading State -->
          <div *ngIf="loadingProducts" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div *ngFor="let i of [1,2,3,4]" class="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
              <div class="h-48 bg-gray-200"></div>
              <div class="p-4">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div *ngIf="!loadingProducts" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div *ngFor="let product of featuredProducts" 
                 class="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100">
              
              <!-- Product Image -->
              <div (click)="viewProduct(product.slug)" class="relative h-48 bg-gray-100 overflow-hidden">
                <img [src]="productService.getImageUrl(product.main_image)" 
                     [alt]="product.name"
                     class="w-full h-full object-cover"
                     (error)="onImageError($event)">
                <span *ngIf="product.is_featured" 
                      class="absolute top-2 right-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                  ⭐ Featured
                </span>
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-2">
                  {{ product.category_name }}
                </span>
                <h3 class="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{{ product.name }}</h3>
                <p class="text-sm text-gray-600 mb-3 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  {{ product.city }}
                </p>
                <div class="flex justify-between items-center mb-4">
                  <div>
                    <p class="text-2xl font-bold text-blue-600">₹{{ product.daily_price }}</p>
                    <p class="text-xs text-gray-500">per day</p>
                  </div>
                  <span *ngIf="product.is_available" 
                        class="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    ✓ Available
                  </span>
                </div>
                <button (click)="viewProduct(product.slug)" 
                        class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loadingProducts && featuredProducts.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4">🔍</div>
            <p class="text-gray-600 text-lg mb-4">No featured products yet</p>
            <a routerLink="/products" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse All Products
            </a>
          </div>
        </div>
      </div>

      <!-- How It Works Section -->
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">How Rentkart Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-4xl">🔍</span>
            </div>
            <h3 class="text-xl font-bold mb-2">1. Browse & Search</h3>
            <p class="text-gray-600">Find the perfect item from thousands of listings across categories</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-4xl">🤝</span>
            </div>
            <h3 class="text-xl font-bold mb-2">2. Connect & Rent</h3>
            <p class="text-gray-600">Contact verified vendors and choose your rental duration</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-4xl">✨</span>
            </div>
            <h3 class="text-xl font-bold mb-2">3. Use & Enjoy</h3>
            <p class="text-gray-600">Get the item delivered and return when you're done</p>
          </div>
        </div>
      </div>

      <!-- Trust Section -->
      <div class="bg-blue-600 text-white py-16">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p class="text-4xl font-bold mb-2">1000+</p>
              <p class="text-blue-200">Products Listed</p>
            </div>
            <div>
              <p class="text-4xl font-bold mb-2">500+</p>
              <p class="text-blue-200">Happy Customers</p>
            </div>
            <div>
              <p class="text-4xl font-bold mb-2">50+</p>
              <p class="text-blue-200">Cities Covered</p>
            </div>
            <div>
              <p class="text-4xl font-bold mb-2">4.8★</p>
              <p class="text-blue-200">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="container mx-auto px-4 py-16 text-center">
        <h2 class="text-3xl font-bold mb-4 text-gray-900">Ready to Start Renting?</h2>
        <p class="text-gray-600 text-lg mb-8">Join thousands of happy renters today</p>
        <a routerLink="/auth/register" 
           class="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition shadow-lg">
          Create Free Account
        </a>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  loadingCategories = true;
  loadingProducts = true;

  constructor(
    public productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  loadCategories() {
    this.loadingCategories = true;
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.loadingCategories = false;
      }
    });
  }

  loadFeaturedProducts() {
    this.loadingProducts = true;
    this.productService.getProducts({ is_featured: true }).subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 8);
        this.loadingProducts = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loadingProducts = false;
      }
    });
  }

  viewCategoryProducts(slug: string) {
    this.router.navigate(['/products'], { queryParams: { category: slug } });
  }

  viewProduct(slug: string) {
    this.router.navigate(['/products', slug]);
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  onImageError(event: any) {
    event.target.src = '/assets/placeholder-product.png';
  }
}
