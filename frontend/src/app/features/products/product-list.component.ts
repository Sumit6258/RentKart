import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category } from '../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Browse Products</h1>
          <p class="text-gray-600">Find the perfect item to rent</p>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select [(ngModel)]="selectedCategoryId" (change)="applyFilters()"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input [(ngModel)]="searchCity" (ngModelChange)="applyFilters()"
                     placeholder="e.g., Mumbai, Delhi"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Show Only</label>
              <label class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" [(ngModel)]="featuredOnly" (change)="applyFilters()"
                       class="w-4 h-4 text-blue-600 rounded">
                <span class="text-sm">Featured Products</span>
              </label>
            </div>

            <div class="flex items-end">
              <button (click)="clearFilters()"
                      class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            <span class="font-semibold text-gray-900">{{ products.length }}</span> products found
          </p>
        </div>

        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="bg-white rounded-xl overflow-hidden shadow animate-pulse">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div *ngFor="let product of products" 
               class="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100">
            
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

            <div class="p-4">
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-2">
                {{ product.category_name }}
              </span>
              <h3 class="font-bold text-lg mb-2 text-gray-900 line-clamp-2 min-h-[3.5rem]">
                {{ product.name }}
              </h3>
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

        <div *ngIf="!loading && products.length === 0" class="text-center py-20">
          <div class="text-8xl mb-4">🔍</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
          <p class="text-gray-600 mb-6">Try adjusting your filters</p>
          <button (click)="clearFilters()" 
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  
  selectedCategoryId = '';
  searchCity = '';
  featuredOnly = false;

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    
    this.route.queryParams.subscribe(params => {
      const categorySlug = params['category'];
      this.searchCity = params['city'] || '';
      this.featuredOnly = params['is_featured'] === 'true';
      
      // Convert slug to ID after categories load
      if (categorySlug && this.categories.length > 0) {
        const category = this.categories.find(c => c.slug === categorySlug);
        this.selectedCategoryId = category ? category.id : '';
      }
      
      this.loadProducts();
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        
        // After categories load, check if we need to set selected category from URL
        const categorySlug = this.route.snapshot.queryParams['category'];
        if (categorySlug) {
          const category = this.categories.find(c => c.slug === categorySlug);
          this.selectedCategoryId = category ? category.id : '';
          this.loadProducts();
        }
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProducts() {
    this.loading = true;
    
    const filters: any = {};
    if (this.selectedCategoryId) filters.category = this.selectedCategoryId;
    if (this.searchCity) filters.city = this.searchCity;
    if (this.featuredOnly) filters.is_featured = true;

    this.productService.getProducts(filters).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.loadProducts();
  }

  clearFilters() {
    this.selectedCategoryId = '';
    this.searchCity = '';
    this.featuredOnly = false;
    this.router.navigate(['/products']);
  }

  viewProduct(slug: string) {
    this.router.navigate(['/products', slug]);
  }

  onImageError(event: any) {
    event.target.src = '/assets/placeholder-product.png';
  }
}
