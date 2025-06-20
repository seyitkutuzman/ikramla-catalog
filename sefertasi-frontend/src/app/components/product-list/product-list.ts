import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
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
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Ürünler yüklenemedi:', error);
        this.loading = false;
      }
    });
  }

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    
    if (category) {
      this.loading = true;
      this.productService.getProductsByCategory(category).subscribe({
        next: (products) => {
          this.filteredProducts = products;
          this.loading = false;
        },
        error: (error) => {
          console.error('Kategori ürünleri yüklenemedi:', error);
          this.loading = false;
        }
      });
    } else {
      this.filteredProducts = this.products;
    }
  }
}
