// src/app/components/blog-list/blog-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/BlogService';
import { BlogPost } from '../../models/BlogPost';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
})
export class BlogListComponent implements OnInit {
  blogs: BlogPost[] = [];

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe(data => this.blogs = data);
  }
}
