/**
 * Session information interface
 */
export interface SessionInfo {
  token: string;
  refreshToken: string;
  expiresAt: string;
  issuedAt: string;
  deviceId?: string | null;
}
