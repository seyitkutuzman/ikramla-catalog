// src/app/components/blog-detail/blog-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService } from '../../services/BlogService';
import { BlogPost } from '../../models/BlogPost';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  post!: BlogPost;
  related: Product[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private blogSvc: BlogService,
    private productSvc: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.blogSvc.getBlog(id).subscribe({
      next: post => {
        this.post = post;
        this.loading = false;
        this.loadRelated();      // ← now that post is here, we can fetch related products
      },
      error: err => {
        console.error(err);
        this.error = 'Blog postu yüklenemedi';
        this.loading = false;
      }
    });
  }

  goHome() {
    this.router.navigate(['/']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private loadRelated() {
    // Make sure your BlogPost model has a `category: string` field!
    if (!this.post.category) {
      return;
    }

    this.productSvc
      .getProductsByCategory(this.post.category)
      .subscribe({
        next: products => {
          // remove this very post’s product if it somehow overlaps
          this.related = products.filter(p => p.id !== this.post.id);
        },
        error: err => {
          console.error('Related products yüklenemedi', err);
        }
      });
  }
}
