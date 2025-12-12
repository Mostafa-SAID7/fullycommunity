import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';

export interface VerificationData {
  email: string;
  code: string;
  type: 'email' | 'phone' | 'account';
}

@Component({
  selector: 'app-verification-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verification-form.component.html',
  styleUrl: './verification-form.component.scss'
})
export class VerificationFormComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  @Input() email = '';
  @Input() phone = '';
  @Input() verificationType: 'email' | 'phone' | 'account' = 'email';
  @Input() title = 'Verify Your Account';
  @Input() subtitle = 'Enter the verification code sent to your email';
  @Output() verified = new EventEmitter<VerificationData>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() resendCode = new EventEmitter<void>();

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  resendLoading = signal(false);
  countdown = signal(0);
  codeDigits = signal(['', '', '', '', '', '']);
  private countdownInterval?: number;

  verificationForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  ngOnInit() {
    this.updateSubtitle();
    this.startResendCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private updateSubtitle() {
    if (this.verificationType === 'email') {
      this.subtitle = `Enter the 6-digit code sent to ${this.email}`;
    } else if (this.verificationType === 'phone') {
      this.subtitle = `Enter the 6-digit code sent to ${this.phone}`;
    } else {
      this.subtitle = 'Enter the verification code to complete account setup';
    }
  }

  onDigitInput(event: any, index: number) {
    const value = event.target.value;
    const digits = this.codeDigits();
    
    // Only allow single digit
    if (value.length > 1) {
      event.target.value = value.slice(-1);
    }
    
    digits[index] = event.target.value;
    this.codeDigits.set([...digits]);
    
    // Update form control
    const fullCode = digits.join('');
    this.verificationForm.patchValue({ code: fullCode });
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = event.target.parentElement.children[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    // Auto-submit when all digits are filled
    if (fullCode.length === 6) {
      setTimeout(() => this.onSubmit(), 100);
    }
  }

  onDigitKeydown(event: any, index: number) {
    // Handle backspace
    if (event.key === 'Backspace') {
      const digits = this.codeDigits();
      
      if (!event.target.value && index > 0) {
        // Focus previous input if current is empty
        const prevInput = event.target.parentElement.children[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      } else {
        // Clear current digit
        digits[index] = '';
        this.codeDigits.set([...digits]);
        this.verificationForm.patchValue({ code: digits.join('') });
      }
    }
    
    // Handle paste
    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
      setTimeout(() => this.handlePaste(event), 0);
    }
  }

  private handlePaste(event: any) {
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    if (digits.length === 6) {
      this.codeDigits.set(digits);
      this.verificationForm.patchValue({ code: digits.join('') });
      
      // Focus last input
      const inputs = event.target.parentElement.children;
      if (inputs[5]) {
        inputs[5].focus();
      }
    }
  }

  onSubmit() {
    if (this.verificationForm.invalid) {
      this.errorMessage.set('Please enter a valid 6-digit code');
      return;
    }

    const code = this.verificationForm.value.code;
    this.loading.set(true);
    this.errorMessage.set('');

    const verificationData: VerificationData = {
      email: this.email,
      code: code,
      type: this.verificationType
    };

    // Simulate API call based on verification type
    const apiCall = this.verificationType === 'email' 
      ? this.authService.verifyEmail(this.email, code)
      : this.verificationType === 'phone'
      ? this.authService.verifyPhone(this.phone, code)
      : this.authService.verifyAccount(code);

    apiCall.subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.successMessage.set('Verification successful!');
        setTimeout(() => {
          this.verified.emit(verificationData);
        }, 1000);
      },
      error: (err: any) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.errorMessage.set('Invalid verification code. Please try again.');
          this.clearCode();
        } else if (err.status === 410) {
          this.errorMessage.set('Verification code has expired. Please request a new one.');
          this.clearCode();
        } else {
          this.errorMessage.set(err.error?.message || 'Verification failed. Please try again.');
        }
      }
    });
  }

  onResendCode() {
    this.resendLoading.set(true);
    this.errorMessage.set('');
    this.clearCode();

    const apiCall = this.verificationType === 'email'
      ? this.authService.resendEmailVerification(this.email)
      : this.verificationType === 'phone'
      ? this.authService.resendPhoneVerification(this.phone)
      : this.authService.resendAccountVerification();

    apiCall.subscribe({
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

  private clearCode() {
    this.codeDigits.set(['', '', '', '', '', '']);
    this.verificationForm.patchValue({ code: '' });
    
    // Focus first input
    const firstInput = document.querySelector('.digit-input') as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
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

  getVerificationIcon(): string {
    switch (this.verificationType) {
      case 'email':
        return 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
      case 'phone':
        return 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z';
      default:
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
}