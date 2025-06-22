import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HeroSectionComponent implements OnInit {
  currentSlide = 0;
  
  slides = [
    {
      image: 'assets/hero-1.jpg',
      title: 'Lezzetli İkramlar',
      subtitle: 'Özel günleriniz için hazır paketler'
    },
    {
      image: 'assets/hero-2.jpg',
      title: 'Taze ve Kaliteli',
      subtitle: 'Günlük üretim, hızlı teslimat'
    },
    {
      image: 'assets/hero-3.jpg',
      title: 'Cenaze Yemekleri',
      subtitle: 'Zor günlerinizde yanınızdayız'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.startSlideShow();
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
