import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { HeroService } from '../../services/HeroService';
import { HeroSlide } from '../../models/HeroSlides.model';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.scss']
})
export class HeroSectionComponent implements OnInit {
  slides: HeroSlide[] = [];
  currentSlide = 0;

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.heroService.getSlides().subscribe(data => {
      this.slides = data;
      this.startSlideShow();
    });
  }

  startSlideShow(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000);
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
