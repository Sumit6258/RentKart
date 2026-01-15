import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'http://127.0.0.1:8000/api/admin/categories';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get(this.baseUrl + '/');
  }

  createCategory(data: any) {
    return this.http.post(this.baseUrl + '/', data);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}/`);
  }
}
