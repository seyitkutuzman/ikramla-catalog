import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

import { HeroSectionComponent } from '../hero-section/hero-section';
import { ProductCardComponent } from '../product-card/product-card';
import { CategoryFilterComponent } from '../category-filter/category-filter';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeroSectionComponent,
    CategoryFilterComponent,
    ProductCardComponent
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = true;
  selectedCategory: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  private loadAllProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: err => {
        console.error('Ürünler yüklenemedi:', err);
        this.loading = false;
      }
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.loading = true;

    if (category) {
      this.productService.getProductsByCategory(category).subscribe({
        next: list => {
          this.filteredProducts = list;
          this.loading = false;
        },
        error: err => {
          console.error('Kategoriye göre ürünler yüklenemedi:', err);
          this.loading = false;
        }
      });
    } else {
      // Filtre kaldırıldığında baştaki ürünlere dön
      this.filteredProducts = this.products;
      this.loading = false;
    }
  }
}
