import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  searchTerm: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      // Search functionality will be implemented
      console.log('Searching for:', this.searchTerm);
    }
  }
}