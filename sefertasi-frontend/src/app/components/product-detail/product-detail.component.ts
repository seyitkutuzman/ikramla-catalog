// src/app/components/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  related: Product[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private svc: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getProductById(id).subscribe({
      next: p => {
        this.product = p;
        this.loading = false;
        this.loadRelated();        // ← now we know product.category
      },
      error: err => {
        this.error = 'Ürün yüklenemedi';
        this.loading = false;
        console.error(err);
      }
    });
  }

  goHome() {
    this.router.navigate(['/']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private loadRelated() {
    // product is guaranteed to be set here
    this.svc.getProductsByCategory(this.product.category).subscribe(list => {
      this.related = list.filter(x => x.id !== this.product.id);
    });
  }
}
