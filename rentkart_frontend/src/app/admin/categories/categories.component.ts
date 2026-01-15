import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  categoryName = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  addCategory() {
    if (!this.categoryName) return;

    this.categoryService.createCategory({ name: this.categoryName })
      .subscribe(() => {
        this.categoryName = '';
        this.loadCategories();
      });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id)
      .subscribe(() => this.loadCategories());
  }
}
