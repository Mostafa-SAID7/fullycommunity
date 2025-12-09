/**
 * Password strength validation result
 */
export interface PasswordStrength {
  score: number; // 0-4
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
