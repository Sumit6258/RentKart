import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerProductService {

  private baseUrl = 'http://127.0.0.1:8000/api/products';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(this.baseUrl + '/');
  }

  getProductById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}/`);
  }
}
