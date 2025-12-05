import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-form">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required>
        <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <p>Don't have an account? <a routerLink="/register">Register</a></p>
    </div>
  `,
  styles: [`
    .auth-form { max-width: 400px; margin: 2rem auto; }
    form { display: flex; flex-direction: column; gap: 1rem; }
    input { padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => alert('Login failed: ' + err.message)
    });
  }
}
