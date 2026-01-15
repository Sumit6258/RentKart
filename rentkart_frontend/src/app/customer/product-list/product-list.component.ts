import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerProductService } from '../product.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: CustomerProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (res: any) => this.products = res,
      error: err => console.error('Public product load error', err)
    });
  }
}
