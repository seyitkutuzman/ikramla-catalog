import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Category } from '../../services/category';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Ürünler yüklenirken bir hata oluştu.';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  filterByCategory(category: string): void {
    if (category === this.selectedCategory) {
      // Aynı kategoriye tıklandıysa filtreyi kaldır
      this.selectedCategory = '';
      this.loadProducts();
    } else {
      this.selectedCategory = category;
      this.loading = true;
      this.productService.getProductsByCategory(category).subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Ürünler filtrelenirken bir hata oluştu.';
          this.loading = false;
          console.error('Error filtering products:', error);
        }
      });
    }
  }

  searchProducts(searchTerm: string): void {
    if (searchTerm.trim() === '') {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.productService.searchProducts(searchTerm).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Arama yapılırken bir hata oluştu.';
        this.loading = false;
        console.error('Error searching products:', error);
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    // İsteğe bağlı: Kullanıcıya bildirim göster
    this.showNotification(`${product.name} sepete eklendi!`);
  }

  private showNotification(message: string): void {
    // Basit bir bildirim sistemi
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  getDiscountedPrice(product: Product): number {
    return product.discountedPrice || product.price;
  }

  hasDiscount(product: Product): boolean {
    return product.discountedPrice !== null && product.discountedPrice !== undefined && product.discountedPrice > 0;
  }

  getDiscountPercentage(product: Product): number {
    if (this.hasDiscount(product)) {
      return Math.round((1 - (product.discountedPrice! / product.price)) * 100);
    }
    return 0;
  }

  trackByProductId(index: number, product: Product): string {
    return product.id || index.toString();
  }
}