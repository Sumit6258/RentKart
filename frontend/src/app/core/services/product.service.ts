import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  product_count: number;
  subcategories: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  category_name: string;
  daily_price: number;
  weekly_price?: number;
  monthly_price?: number;
  security_deposit?: number;
  main_image?: string;
  vendor_name: string;
  city: string;
  state?: string;
  quantity?: number;
  available_quantity?: number;
  is_available: boolean;
  is_featured: boolean;
  vendor?: string;
}

interface PaginatedResponse<T> {
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Helper to get full image URL
  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return '/assets/placeholder-product.png';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${this.baseUrl}${cleanPath}`;
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[] | PaginatedResponse<Category>>(`${this.apiUrl}/categories/`).pipe(
      map(response => this.extractResults(response))
    );
  }

  getProducts(filters?: any): Observable<Product[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params = params.set(key, filters[key].toString());
        }
      });
    }
    return this.http.get<Product[] | PaginatedResponse<Product>>(this.apiUrl + '/', { params }).pipe(
      map(response => this.extractResults(response))
    );
  }

  getProductsByCategory(categorySlug: string): Observable<Product[]> {
    return this.http.get<Product[] | PaginatedResponse<Product>>(`${this.apiUrl}/category/${categorySlug}/`).pipe(
      map(response => this.extractResults(response))
    );
  }

  getProductDetail(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${slug}/`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[] | PaginatedResponse<Product>>(`${this.apiUrl}/?search=${query}`).pipe(
      map(response => this.extractResults(response))
    );
  }

  createProduct(data: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl + '/', data);
  }

  updateProduct(slug: string, data: any): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${slug}/`, data);
  }

  deleteProduct(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${slug}/`);
  }

  private extractResults<T>(response: T[] | PaginatedResponse<T>): T[] {
    if (response && typeof response === 'object' && 'results' in response) {
      return (response as PaginatedResponse<T>).results || [];
    }
    return Array.isArray(response) ? response : [];
  }
}
