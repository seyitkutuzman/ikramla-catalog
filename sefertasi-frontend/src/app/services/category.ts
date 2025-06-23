import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) {}

  /** Sadece aktif kategorileri alır (public sayfalar için) */
  getActiveCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  /** Tüm kategorileri alır (admin) */
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/all`);
  }

  /** Yeni kategori oluşturur */
  createCategory(dto: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, dto);
  }

  /** Var olanı günceller */
  updateCategory(id: string, dto: Partial<Category>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  /** Kategoriyi siler */
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** Aktif/pasif durumunu çevirir */
  toggleStatus(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/toggle-status`, {});
  }
}
