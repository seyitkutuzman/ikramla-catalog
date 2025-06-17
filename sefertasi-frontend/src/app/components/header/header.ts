// header.component.ts
import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() categories: string[] = [];
  @Output() categorySelected = new EventEmitter<string>();
  @Output() searchTerm = new EventEmitter<string>();

  searchQuery: string = '';
  isScrolled: boolean = false;
  isMobileMenuOpen: boolean = false;
  isSearchExpanded: boolean = false;
  selectedCategory: string = '';

  ngOnInit(): void {
    // Component başlangıç ayarları
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchTerm.emit(this.searchQuery);
      this.isSearchExpanded = false;
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchTerm.emit('');
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleSearch(): void {
    this.isSearchExpanded = !this.isSearchExpanded;
    if (this.isSearchExpanded) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }
}