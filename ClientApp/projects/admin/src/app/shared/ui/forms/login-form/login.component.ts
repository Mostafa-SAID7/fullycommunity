import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LogoButtonComponent } from '../../../components/logo-button/logo-button.component';
import { CopyrightComponent } from '../../components/copyright/copyright.component';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoButtonComponent, CopyrightComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginFormComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const credentials: LoginCredentials = this.loginForm.value;
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.loading.set(false);
        
        // Check if user has admin role
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage.set('You do not have permission to access the admin panel');
          this.authService.logout();
        }
      },
      error: (err: any) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Invalid email or password');
        } else if (err.status === 403) {
          this.errorMessage.set('Your account has been suspended');
        } else {
          this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
        }
      }
    });
  }

  onForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength']) return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
