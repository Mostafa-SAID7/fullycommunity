/**
 * Login request interface
 */
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string | null;
  ipAddress?: string | null;
  rememberMe?: boolean;
}
