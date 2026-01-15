import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CustomerProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {

  product: any;
  selectedPlan = '';

  constructor(
    private route: ActivatedRoute,
    private productService: CustomerProductService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.productService.getProductById(id).subscribe(res => {
      this.product = res;
    });
  }

  rentNow() {
    alert(
      `Renting ${this.product.name} on ${this.selectedPlan} plan`
    );
  }
}
