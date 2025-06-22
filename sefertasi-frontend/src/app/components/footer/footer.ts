import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  imports: [FormsModule],
  standalone: true
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  constructor() { }
}