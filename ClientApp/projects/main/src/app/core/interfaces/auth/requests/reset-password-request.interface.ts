/**
 * Reset password request interface
 */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}
