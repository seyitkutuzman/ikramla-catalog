import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { HeroService } from '../../services/HeroService';
import { BlogService } from '../../services/BlogService';

import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { HeroSlide } from '../../models/HeroSlides.model';
import { BlogPost } from '../../models/BlogPost';

import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularEditorModule ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  // Ürün, kategori, slide alanları (aynı)
  products: Product[] = [];
  categories: Category[] = [];
  heroSlides: HeroSlide[] = [];
  model: any = { tags: [] as string[] };
  isEditMode = false;
  selectedFile?: File;
  tagInput = '';
  newCategoryName = '';
  slideFile?: File;
  slideTitle = '';
  slideSubtitle = '';
  slideOrder = 0;

  // ★ Blog alanları ★
  blogPosts: BlogPost[] = [];
  blogTitle = '';
  blogSummary = '';
  blogContent = '';
  blogFile?: File;
  blogCategory = '';

  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Buraya yazınızı girin...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      // mesela bu iki grubu gizliyoruz, isterseniz kaldırabilirsiniz
      ['insertImage', 'insertVideo'],
      ['fontSize']
    ]
    // geri kalan seçenekleri docs’tan (https://github.com/kolkov/angular-editor) görebilirsiniz
  };


  constructor(
    private svc: ProductService,
    private categorySvc: CategoryService,
    private heroSvc: HeroService,
    private blogSvc: BlogService
  ) { }

  ngOnInit() {
    this.load();
    this.loadCategories();
    this.loadHeroSlides();
    this.loadBlogPosts();         // ★ eksik metodu çağırıyoruz
  }

  // ★ Blog postları yükleyen metot
  private loadBlogPosts() {
    this.blogSvc.getBlogs().subscribe(posts => this.blogPosts = posts);
  }

  // ★ Dosya seçimi
  onBlogFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.blogFile = input.files[0];
    }
  }

  // ★ Yeni blog post oluştur
  createBlogPost() {
    if (!this.blogTitle.trim() || !this.blogContent.trim()) {
      return alert('Başlık ve içerik zorunludur.');
    }
    const form = new FormData();
    form.append('Title', this.blogTitle);
    form.append('Summary', this.blogSummary);
    form.append('Content', this.blogContent);
    form.append('Category', this.blogCategory);
    if (this.blogFile) {
      form.append('ImageFile', this.blogFile, this.blogFile.name);
    }
    this.blogSvc.createBlog(form).subscribe({
      next: () => {
        this.blogTitle = '';
        this.blogSummary = '';
        this.blogContent = '';
        this.blogCategory = '';
        this.blogFile = undefined;
        this.loadBlogPosts();
      },
      error: err => console.error('Blog post oluşturulamadı', err)
    });
  }

  // ★ Blog post sil
  deleteBlogPost(id: string) {
    if (!confirm('Bu blog postu silmek istediğinize emin misiniz?')) return;
    this.blogSvc.deleteBlog(id).subscribe(() => this.loadBlogPosts());
  }

  private loadHeroSlides() {
    this.heroSvc.getSlides().subscribe(slides => this.heroSlides = slides);
  }

  // Yeni: slayt için dosya seçince tetiklenir
  onSlideFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.slideFile = input.files[0];
  }

  // Yeni: Hero slayt oluştur
  createSlide() {
    if (!this.slideFile) return alert('Lütfen bir resim seçin.');
    const form = new FormData();
    form.append('image', this.slideFile);
    form.append('title', this.slideTitle);
    form.append('subtitle', this.slideSubtitle);
    form.append('order', this.slideOrder.toString());

    this.heroSvc.createSlide(form).subscribe({
      next: slide => {
        // formu sıfırla ve listeyi yenile
        this.slideFile = undefined;
        this.slideTitle = '';
        this.slideSubtitle = '';
        this.slideOrder = 0;
        this.loadHeroSlides();
      },
      error: err => console.error('Slide oluşturulamadı', err)
    });
  }

  // Yeni: Hero slayt sil
  deleteSlide(id: string) {
    if (!confirm('Bu slaytı silmek istediğinizden emin misiniz?')) return;
    this.heroSvc.deleteSlide(id).subscribe(() => this.loadHeroSlides());
  }


  load() {
    this.svc.getAllProducts().subscribe((list) => (this.products = list));
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  addTag() {
    if (this.tagInput.trim()) {
      this.model.tags.push(this.tagInput.trim());
      this.tagInput = '';
    }
  }

  removeTag(i: number) {
    this.model.tags.splice(i, 1);
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '/assets/placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5269${imageUrl}`;
  }

  onImageError(event: any): void {
    event.target.src = '/assets/placeholder.jpg';
  }

  editProduct(p: Product) {
    this.isEditMode = true;
    this.model = { ...p, tags: [...(p.tags || [])] };
  }

  deleteProduct(id: string) {
    this.svc.deleteProduct(id).subscribe(() => this.load());
  }
  private loadCategories() {
    // Admin sayfası olduğu için tüm kategorileri çekiyoruz
    this.categorySvc.getAllCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Kategori yüklenemedi', err)
    });
  }
  onSubmit() {
    const form = new FormData();

    form.append('Name', this.model.name);
    form.append('Description', this.model.description);
    form.append('Price', this.model.price.toString());
    if (this.model.discountedPrice != null)
      form.append('DiscountedPrice', this.model.discountedPrice.toString());
    if (this.model.discountPercentage != null)
      form.append(
        'DiscountPercentage',
        this.model.discountPercentage.toString()
      );
    form.append('Category', this.model.category);
    form.append('IsActive', this.model.isActive ? 'true' : 'true');
    this.model.tags.forEach((tag) => form.append('Tags', tag));
    if (this.selectedFile)
      form.append('ImageFile', this.selectedFile, this.selectedFile.name);

    if (this.isEditMode) {
      this.svc.updateProduct(this.model.id!, form).subscribe(() => {
        this.afterSave();
      });
    } else {
      this.svc.createProduct(form).subscribe(() => {
        this.afterSave();
      });
    }
  }

  private afterSave() {
    this.isEditMode = false;
    this.model = { tags: [] };
    this.selectedFile = undefined;
    this.load();
  }

  createCategory() {
    if (!this.newCategoryName.trim()) return;
    this.categorySvc
      .createCategory({ name: this.newCategoryName.trim() })
      .subscribe(() => {
        this.newCategoryName = '';
        this.loadCategories();
      });
  }

  // Aktif/pasif toggle
  toggleCategory(id: string) {
    this.categorySvc.toggleStatus(id)
      .subscribe(() => this.loadCategories());
  }

  // Sil
  deleteCategory(id: string) {
    if (!confirm('Kategori silinsin mi?')) return;
    this.categorySvc.deleteCategory(id)
      .subscribe(() => this.loadCategories());
  }
}
