/**
 * Two-factor authentication login request interface
 */
export interface TwoFactorLoginRequest {
  email: string;
  code: string;
  deviceId?: string | null;
  rememberDevice?: boolean;
  useRecoveryCode?: boolean;
}
