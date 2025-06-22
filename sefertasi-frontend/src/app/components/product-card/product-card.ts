import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor() {}

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return '/assets/placeholder.jpg'; // Varsayılan resim
    }

    // Eğer tam URL ise direkt döndür
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // Backend URL'ini ekle
    const baseUrl = environment.apiUrl || 'https://localhost:5269';
    return `${baseUrl}${imageUrl}`;
  }

  onImageError(event: any): void {
    event.target.src = '/assets/placeholder.jpg';
  }
}
