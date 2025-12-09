import { User } from '../user.interface';

/**
 * Login response interface
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
  requiresTwoFactor?: boolean;
  requiresVerification?: boolean;
}
