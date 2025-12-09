/**
 * External login request interface (Google, Facebook, etc.)
 */
export interface ExternalLoginRequest {
  provider: string;
  providerKey: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  deviceId?: string | null;
}
