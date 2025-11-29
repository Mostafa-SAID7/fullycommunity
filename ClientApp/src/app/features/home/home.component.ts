import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <h1>Share Your Car, Share the Journey</h1>
      <p>Community Car connects car owners with people who need a ride.</p>
      <a routerLink="/cars" class="btn btn-primary">Browse Cars</a>
    </section>
  `,
  styles: [`
    .hero { text-align: center; padding: 4rem 0; }
    h1 { font-size: 2.5rem; margin-bottom: 1rem; }
    p { font-size: 1.2rem; color: #666; margin-bottom: 2rem; }
  `]
})
export class HomeComponent {}
