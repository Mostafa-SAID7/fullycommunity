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

  // Register form
  isRegisterMode = signal(false);
  registerFirstName = '';
  registerLastName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  showConfirmPassword = signal(false);

  toggleMode() {
    this.isRegisterMode.update(v => !v);
    this.error.set(null);
    this.clearForms();
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(v => !v);
  }

  onRegisterSubmit() {
    if (!this.registerFirstName || !this.registerLastName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.error.set('Please fill in all fields');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // TODO: Implement actual registration logic
    // For now, simulate a delay
    setTimeout(() => {
      this.loading.set(false);
      // Maybe log them in or switch to login mode?
      this.toggleMode();
      this.error.set('Registration successful! Please sign in.');
    }, 1000);
  }

  loginWithGoogle() {
    console.log('Login with Google');
  }

  loginWithFacebook() {
    console.log('Login with Facebook');
  }


}
