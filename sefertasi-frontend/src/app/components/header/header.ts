// src/app/components/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService }    from '../../services/product';
import { FormsModule }       from '@angular/forms';
import { RouterModule }      from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ FormsModule, RouterModule ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  searchTerm = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {}

  onSearch(): void {
    if (this.searchTerm.trim()) {
      console.log('Searching for:', this.searchTerm);
    }
  }
}
