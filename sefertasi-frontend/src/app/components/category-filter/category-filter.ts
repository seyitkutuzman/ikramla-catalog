import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.html',
  styleUrls: ['./category-filter.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoryFilterComponent implements OnInit {
  @Output() categorySelected = new EventEmitter<string>();
  
  categories: Category[] = [];
  selectedCategory: string = '';
  
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    // Sadece aktif kategorileri almak için public API endpoint’ini kullan
    this.categoryService.getActiveCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Kategoriler yüklenemedi:', err)
    });
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.categorySelected.emit(categoryName);
  }

  clearFilter(): void {
    this.selectedCategory = '';
    this.categorySelected.emit('');
  }
}
