import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-page">
      <div class="error-content">
        <div class="error-icon">🔍</div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div class="actions">
          <a routerLink="/" class="btn-primary">Go Home</a>
          <button (click)="goBack()" class="btn-secondary">Go Back</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; }
    .error-content { text-align: center; background: #fff; padding: 3rem; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 450px; }
    .error-icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { font-size: 5rem; font-weight: 800; color: #1877f2; margin: 0; line-height: 1; }
    h2 { font-size: 1.5rem; font-weight: 600; color: #1c1e21; margin: 0.5rem 0 1rem; }
    p { color: #65676b; margin: 0 0 2rem; }
    .actions { display: flex; gap: 1rem; justify-content: center; }
    .btn-primary { padding: 0.75rem 1.5rem; background: #1877f2; color: #fff; border: none; border-radius: 8px; text-decoration: none; font-weight: 600; cursor: pointer; }
    .btn-secondary { padding: 0.75rem 1.5rem; background: #e4e6eb; color: #050505; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
  `]
})
export class NotFoundComponent {
  goBack() { window.history.back(); }
}
