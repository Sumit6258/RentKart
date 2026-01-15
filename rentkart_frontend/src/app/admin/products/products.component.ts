import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {

  // list data
  products: any[] = [];
  categories: any[] = [];

  // images
  image1: File | null = null;
  image2: File | null = null;

  // form model
  product: any = {
    name: '',
    category: '',
    price: '',
    subscription_type: ''
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  // 🔹 load products
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;
      },
      error: err => {
        console.error('Error loading products', err);
      }
    });
  }

  // 🔹 load categories
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res;
      },
      error: err => {
        console.error('Error loading categories', err);
      }
    });
  }

  // 🔹 image handlers
  onFile1Change(event: any) {
    this.image1 = event.target.files[0];
  }

  onFile2Change(event: any) {
    this.image2 = event.target.files[0];
  }

  // 🔹 add product
  addProduct() {
    if (!this.product.name || !this.product.category) {
      alert('Product name and category are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('category', this.product.category);
    formData.append('price', this.product.price);
    formData.append('subscription_type', this.product.subscription_type);

    if (this.image1) {
      formData.append('image1', this.image1);
    }

    if (this.image2) {
      formData.append('image2', this.image2);
    }

    this.productService.createProduct(formData).subscribe({
      next: () => {
        // reset form
        this.product = {
          name: '',
          category: '',
          price: '',
          subscription_type: ''
        };
        this.image1 = null;
        this.image2 = null;

        this.loadProducts();
      },
      error: err => {
        console.error('Product creation failed', err);
      }
    });
  }

  // 🔹 delete product
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: err => console.error('Delete failed', err)
    });
  }
}
