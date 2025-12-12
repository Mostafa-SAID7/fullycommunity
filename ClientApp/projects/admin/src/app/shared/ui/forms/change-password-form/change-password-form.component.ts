import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl) {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  
  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-change-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.scss'
})
export class ChangePasswordFormComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  @Input() title = 'Change Password';
  @Input() showCurrentPassword = true;
  @Output() passwordChanged = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  changePasswordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  get currentPasswordControl() { return this.changePasswordForm.get('currentPassword'); }
  get newPasswordControl() { return this.changePasswordForm.get('newPassword'); }
  get confirmPasswordControl() { return this.changePasswordForm.get('confirmPassword'); }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword.set(!this.showCurrentPassword());
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword.set(!this.showNewPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const { currentPassword, newPassword } = this.changePasswordForm.value;
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Password changed successfully!');
        this.changePasswordForm.reset();
        
        setTimeout(() => {
          this.passwordChanged.emit();
        }, 2000);
      },
      error: (err: any) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.errorMessage.set('Current password is incorrect.');
        } else {
          this.errorMessage.set(err.error?.message || 'Failed to change password. Please try again.');
        }
      }
    });
  }

  onCancel() {
    this.changePasswordForm.reset();
    this.errorMessage.set('');
    this.successMessage.set('');
    this.cancelled.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      const control = this.changePasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.changePasswordForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      if (control.errors['minlength']) return `Password must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['pattern']) return 'Password must contain uppercase, lowercase, number and special character';
    }
    
    // Check for password mismatch at form level
    if (fieldName === 'confirmPassword' && this.changePasswordForm.errors?.['passwordMismatch'] && control?.touched) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  getPasswordStrength(): { strength: string; color: string; width: string } {
    const password = this.newPasswordControl?.value || '';
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    switch (score) {
      case 0:
      case 1:
        return { strength: 'Very Weak', color: '#ef4444', width: '20%' };
      case 2:
        return { strength: 'Weak', color: '#f97316', width: '40%' };
      case 3:
        return { strength: 'Fair', color: '#eab308', width: '60%' };
      case 4:
        return { strength: 'Good', color: '#22c55e', width: '80%' };
      case 5:
        return { strength: 'Strong', color: '#16a34a', width: '100%' };
      default:
        return { strength: '', color: '', width: '0%' };
    }
  }
}