import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-two-factor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-factor-form.component.html',
  styleUrl: './two-factor-form.component.scss'
})
export class TwoFactorFormComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  @Input() email = '';
  @Input() title = 'Two-Factor Authentication';
  @Output() verified = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() resendCode = new EventEmitter<void>();

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  resendLoading = signal(false);
  countdown = signal(0);
  private countdownInterval?: number;

  twoFactorForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  get codeControl() { return this.twoFactorForm.get('code'); }

  ngOnInit() {
    this.startResendCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onSubmit() {
    if (this.twoFactorForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const code = this.twoFactorForm.value.code;
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.verifyTwoFactor(this.email, code).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.successMessage.set('Authentication successful!');
        setTimeout(() => {
          this.verified.emit(response.token || code);
        }, 1000);
      },
      error: (err: any) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.errorMessage.set('Invalid verification code. Please try again.');
        } else {
          this.errorMessage.set(err.error?.message || 'Verification failed. Please try again.');
        }
      }
    });
  }

  onResendCode() {
    this.resendLoading.set(true);
    this.errorMessage.set('');

    this.authService.resendTwoFactorCode(this.email).subscribe({
      next: () => {
        this.resendLoading.set(false);
        this.successMessage.set('Verification code sent successfully!');
        this.startResendCountdown();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err: any) => {
        this.resendLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to resend code. Please try again.');
      }
    });
  }

  onCancel() {
    this.cancelled.emit();
  }

  private startResendCountdown() {
    this.countdown.set(60);
    this.countdownInterval = window.setInterval(() => {
      const current = this.countdown();
      if (current > 0) {
        this.countdown.set(current - 1);
      } else {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
      }
    }, 1000);
  }

  private markFormGroupTouched() {
    Object.keys(this.twoFactorForm.controls).forEach(key => {
      const control = this.twoFactorForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.twoFactorForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Verification code is required';
      if (control.errors['pattern']) return 'Please enter a valid 6-digit code';
    }
    return '';
  }

  // Auto-focus next input on digit entry
  onDigitInput(event: any, index: number) {
    const value = event.target.value;
    if (value && index < 5) {
      const nextInput = event.target.parentElement.children[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  // Handle backspace to focus previous input
  onDigitKeydown(event: any, index: number) {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      const prevInput = event.target.parentElement.children[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  }
}