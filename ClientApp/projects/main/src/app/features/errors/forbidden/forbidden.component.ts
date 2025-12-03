import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-page">
      <div class="error-content">
        <div class="error-icon">🚫</div>
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <div class="actions">
          <a routerLink="/" class="btn-primary">Go Home</a>
          <a routerLink="/login" class="btn-secondary">Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 2rem; }
    .error-content { text-align: center; background: #fff; padding: 3rem; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 450px; }
    .error-icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { font-size: 5rem; font-weight: 800; color: #f5a623; margin: 0; line-height: 1; }
    h2 { font-size: 1.5rem; font-weight: 600; color: #1c1e21; margin: 0.5rem 0 1rem; }
    p { color: #65676b; margin: 0 0 2rem; }
    .actions { display: flex; gap: 1rem; justify-content: center; }
    .btn-primary { padding: 0.75rem 1.5rem; background: #1877f2; color: #fff; border: none; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .btn-secondary { padding: 0.75rem 1.5rem; background: #e4e6eb; color: #050505; border: none; border-radius: 8px; text-decoration: none; font-weight: 600; }
  `]
})
export class ForbiddenComponent {}
