/**
 * Register form data interface
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  agreeToTerms: boolean;
}
