/**
 * Social login provider interface
 */
export interface SocialProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

/**
 * Social login result interface
 */
export interface SocialLoginResult {
  provider: string;
  providerKey: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}
