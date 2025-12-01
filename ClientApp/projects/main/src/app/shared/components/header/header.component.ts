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
        <a routerLink="/" class="logo">Fully Community</a>
        <div class="nav-links">
          @if (authService.currentUser()) {
            <a routerLink="/profile">Profile</a>
            <span>{{ authService.currentUser()?.firstName }}</span>
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
    .nav-links a, .nav-links button, .nav-links span { color: white; text-decoration: none; background: none; border: none; cursor: pointer; font-size: 1rem; }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
}
