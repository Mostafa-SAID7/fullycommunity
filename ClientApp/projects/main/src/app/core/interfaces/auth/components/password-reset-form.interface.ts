/**
 * Password reset form data interface
 */
export interface PasswordResetFormData {
  email: string;
}

/**
 * New password form data interface
 */
export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

/**
 * Change password form data interface
 */
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
