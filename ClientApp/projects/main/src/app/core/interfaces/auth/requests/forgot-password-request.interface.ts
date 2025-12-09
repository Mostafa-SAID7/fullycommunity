/**
 * Forgot password request interface
 */
export interface ForgotPasswordRequest {
  email: string;
  resetUrl?: string | null;
}
