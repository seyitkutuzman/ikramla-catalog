import { Component }         from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, NavigationEnd, Router }      from '@angular/router';
import { FormsModule }       from '@angular/forms';
import { HttpClientModule }  from '@angular/common/http';

import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { HeroSectionComponent } from './components/hero-section/hero-section';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    FooterComponent,
    HeroSectionComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'sefertasi-frontend';
  showHeaderFooter = true;
    constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        // login rotasında header/footer gizlensin
        this.showHeaderFooter = e.urlAfterRedirects !== '/login';
      });
  }
}
