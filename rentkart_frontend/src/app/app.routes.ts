import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { ProductsComponent } from './admin/products/products.component';
import { ProductListComponent } from './customer/product-list/product-list.component';
import { ProductDetailComponent } from './customer/product-detail/product-detail.component';
import { authGuard } from './auth/auth.guard';

export const routes = [
  { path: '', component: ProductListComponent },   // 👈 customer homepage

  { path: 'admin/login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] }
];
