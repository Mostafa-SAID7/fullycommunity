/**
 * Extended user profile response interface with additional details
 */
export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  bio: string | null;
  birthday: string | null;
  location: string | null;
  themeColor: string | null;
  preferredLanguage: string | null;
  userType: string;
  accountStatus: string;
  verificationStatus: string;
  isVerified: boolean;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  roles: string[];
  createdAt: string;
  lastActivityAt: string | null;
}
