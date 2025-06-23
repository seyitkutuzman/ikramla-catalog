import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroSlide } from '../models/HeroSlides.model';
import { environment } from '../../environments/environments'; // tekil environment

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private apiUrl = `${environment.apiUrl}/api/hero`;

  constructor(private http: HttpClient) {}

  getSlides(): Observable<HeroSlide[]> {
    return this.http.get<HeroSlide[]>(this.apiUrl);
  }

  // (isteğe bağlı admin CRUD metodları da ekleyebilirsin)
}
