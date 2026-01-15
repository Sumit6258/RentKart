import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://127.0.0.1:8000/api/admin/products';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(this.baseUrl + '/');
  }

  createProduct(formData: FormData) {
    return this.http.post(this.baseUrl + '/', formData);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}/`);
  }
}
