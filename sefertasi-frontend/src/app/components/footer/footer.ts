// footer.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  categories: string[] = [];
  currentYear: number = new Date().getFullYear();

  companyInfo = {
    name: 'E-Ticaret',
    address: 'İstanbul, Türkiye',
    phone: '+90 212 123 45 67',
    email: 'info@eticaret.com'
  };

  quickLinks = [
    { name: 'Hakkımızda', link: '/about' },
    { name: 'İletişim', link: '/contact' },
    { name: 'S.S.S.', link: '/faq' },
    { name: 'Blog', link: '/blog' }
  ];

  customerService = [
    { name: 'Sipariş Takibi', link: '/order-tracking' },
    { name: 'İade ve Değişim', link: '/returns' },
    { name: 'Kargo Bilgileri', link: '/shipping' },
    { name: 'Ödeme Seçenekleri', link: '/payment' }
  ];

  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', link: 'https://facebook.com' },
    { name: 'Twitter', icon: 'fab fa-twitter', link: 'https://twitter.com' },
    { name: 'Instagram', icon: 'fab fa-instagram', link: 'https://instagram.com' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', link: 'https://linkedin.com' }
  ];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 5); // İlk 5 kategoriyi göster
      },
      error: (error) => {
        console.error('Footer kategorileri yüklenemedi:', error);
      }
    });
  }

  subscribeNewsletter(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
  const email = emailInput.value;

  // Burada newsletter service'inizi kullanabilirsiniz
  console.log('Newsletter subscription:', email);
  
  // Başarılı mesajı göster
  alert('Bültenimize başarıyla abone oldunuz!');
  
  // Formu temizle
  form.reset();
}
}