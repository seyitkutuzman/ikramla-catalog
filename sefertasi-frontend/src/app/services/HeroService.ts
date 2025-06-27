// src/app/services/hero.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroSlide } from '../models/HeroSlides.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private apiUrl = `${environment.apiUrl}/api/hero`;

  constructor(private http: HttpClient) {}

  // var olan slaytları çeker
  getSlides(): Observable<HeroSlide[]> {
    return this.http.get<HeroSlide[]>(this.apiUrl);
  }

  // yeni slayt ekler
  createSlide(form: FormData): Observable<HeroSlide> {
    return this.http.post<HeroSlide>(this.apiUrl, form);
  }

  // slaytı siler
  deleteSlide(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
