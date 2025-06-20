import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.html',
  styleUrls: ['./category-filter.scss'],
  standalone: false
})
export class CategoryFilterComponent implements OnInit {
  @Output() categorySelected = new EventEmitter<string>();
  
  categories: Category[] = [];
  selectedCategory: string = '';
  
  predefinedCategories = [
    { icon: '🥖', name: 'Meze & Kiloluk', value: 'Meze & Kiloluk' },
    { icon: '🥐', name: 'Börek & Baklava', value: 'Börek & Baklava' },
    { icon: '🍕', name: 'İkramla Paket', value: 'İkramla Paket' },
    { icon: '🍗', name: 'Cenaze Yemeği', value: 'Cenaze Yemeği' },
    { icon: '🍱', name: 'İftar Yemeği', value: 'İftar Yemeği' },
    { icon: '☕', name: 'Kendin İkramla', value: 'Kendin İkramla' }
  ];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Kategoriler yüklenemedi:', error);
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }

  clearFilter(): void {
    this.selectedCategory = '';
    this.categorySelected.emit('');
  }
}