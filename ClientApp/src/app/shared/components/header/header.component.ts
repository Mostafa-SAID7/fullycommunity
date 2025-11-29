import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <nav class="container">
        <a routerLink="/" class="logo">Community Car</a>
        <div class="nav-links">
          <a routerLink="/cars">Cars</a>
          @if (authService.currentUser()) {
            <a routerLink="/bookings">My Bookings</a>
            <button (click)="authService.logout()">Logout</button>
          } @else {
            <a routerLink="/login">Login</a>
            <a routerLink="/register">Register</a>
          }
        </div>
      </nav>
    </header>
  `,
  styles: [`
    header { background: #007bff; padding: 1rem 0; }
    nav { display: flex; justify-content: space-between; align-items: center; }
    .logo { color: white; font-size: 1.5rem; font-weight: bold; text-decoration: none; }
    .nav-links { display: flex; gap: 1rem; align-items: center; }
    .nav-links a, .nav-links button { color: white; text-decoration: none; background: none; border: none; cursor: pointer; font-size: 1rem; }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
}
