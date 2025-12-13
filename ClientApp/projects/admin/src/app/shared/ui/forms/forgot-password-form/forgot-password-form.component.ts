import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LogoButtonComponent } from '../../../components/logo-button/logo-button.component';
import { CopyrightComponent } from '../../components/copyright/copyright.component';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LogoButtonComponent, CopyrightComponent],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss'
})
export class ForgotPasswordFormComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  emailSent = signal(false);

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get emailControl() { return this.forgotPasswordForm.get('email'); }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loading.set(false);
        this.emailSent.set(true);
        this.successMessage.set('Password reset instructions have been sent to your email address.');
      },
      error: (err: any) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.errorMessage.set('No account found with this email address.');
        } else {
          this.errorMessage.set(err.error?.message || 'Failed to send reset email. Please try again.');
        }
      }
    });
  }

  onBackToLogin() {
    this.router.navigate(['/auth/login']);
  }

  onResendEmail() {
    if (this.emailControl?.value) {
      this.emailSent.set(false);
      this.onSubmit();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.forgotPasswordForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }
}