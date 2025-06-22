// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Product }    from '../models/product';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;
   private _products$ = new BehaviorSubject<Product[]>([]);
  
  constructor(private http: HttpClient) { }

    // Ürün listesini dışarıya sunduğunuz Akış
  get products$(): Observable<Product[]> {
    return this._products$.asObservable();
  }

    refresh() {
    this.http.get<Product[]>(this.apiUrl)
      .subscribe(list => this._products$.next(list));
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search/${searchTerm}`);
  }

  createProduct(data: FormData) {
    return this.http.post<Product>(this.apiUrl, data)
      .pipe(tap(() => this.refresh()));   // eklemeden sonra yeniden çek
  }

  updateProduct(id: string, data: FormData) {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data)
      .pipe(tap(() => this.refresh()));   // güncellemeden sonra yeniden çek
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.refresh()));   // silmeden sonra yeniden çek
  }

}
