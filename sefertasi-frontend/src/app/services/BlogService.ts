// src/app/services/blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/BlogPost';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private apiUrl = '/api/blog';

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.apiUrl);
  }

  getBlog(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${id}`);
  }

  // ★ Yeni: FormData ile create endpoint'i çağırır
  createBlog(form: FormData): Observable<BlogPost> {
    return this.http.post<BlogPost>(this.apiUrl, form);
  }

  // ★ Yeni: silme endpoint'i çağırır
  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
