import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
  standalone: false
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor() { }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}