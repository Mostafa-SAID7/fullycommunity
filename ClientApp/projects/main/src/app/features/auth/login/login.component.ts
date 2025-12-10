import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, BrandLogoComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Login form
  loginEmail = '';
  loginPassword = '';
  
  // State
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  clearForms() {
    this.loginEmail = '';
    this.loginPassword = '';
  }

  onLoginSubmit() {
    if (!this.loginEmail || !this.loginPassword) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const loginRequest = {
      email: this.loginEmail,
      password: this.loginPassword
    };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }


}
