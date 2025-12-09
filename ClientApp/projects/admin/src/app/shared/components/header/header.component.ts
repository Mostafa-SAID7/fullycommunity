import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-gradient-to-r from-primary to-primary-hover shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <a routerLink="/" class="text-white text-2xl font-bold tracking-tight hover:scale-105 transition-transform duration-200 flex items-center gap-2">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          <span class="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">Fully Community</span>
        </a>
        <div class="flex gap-4 items-center">
          @if (authService.currentUser()) {
            <a routerLink="/profile" 
               class="text-white hover:text-gray-100 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10 font-medium">
              Profile
            </a>
            <div class="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <div class="w-8 h-8 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {{ authService.currentUser()?.firstName?.[0] || 'U' }}
              </div>
              <span class="text-white font-medium">{{ authService.currentUser()?.firstName }}</span>
            </div>
            <button (click)="authService.logout()" 
                    class="text-white bg-white/10 hover:bg-white/20 transition-all duration-200 px-5 py-2 rounded-lg font-medium backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-lg">
              Logout
            </button>
          } @else {
            <a routerLink="/login" 
               class="bg-white text-primary hover:bg-gray-100 transition-all duration-200 px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-xl hover:scale-105">
              Admin Login
            </a>
          }
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
}
