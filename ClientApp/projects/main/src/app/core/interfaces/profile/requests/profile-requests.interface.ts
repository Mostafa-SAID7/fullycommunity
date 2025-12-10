/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  bio: string | null;
  tagline: string | null;
  website: string | null;
  birthday: string | null;
  gender: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  themeColor: string | null;
  preferredLanguage: string | null;
  timezone: string | null;
}

/**
 * Update Avatar Request
 */
export interface UpdateAvatarRequest {
  avatarUrl: string;
}

/**
 * Update Background Request
 */
export interface UpdateBackgroundRequest {
  backgroundUrl: string;
}

/**
 * Update Banner Request
 */
export interface UpdateBannerRequest {
  bannerUrl: string;
}

/**
 * Verify Email Request
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Verify Phone Request
 */
export interface VerifyPhoneRequest {
  code: string;
}

/**
 * Change Email Request
 */
export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

/**
 * Change Phone Request
 */
export interface ChangePhoneRequest {
  newPhoneNumber: string;
  password: string;
}

/**
 * Deactivate Account Request
 */
export interface DeactivateAccountRequest {
  reason: string | null;
  password: string;
}

/**
 * Delete Account Request
 */
export interface DeleteAccountRequest {
  reason: string | null;
  password: string;
  confirmText: string;
}

/**
 * Block User Request
 */
export interface BlockUserRequest {
  userId: string;
  reason: string | null;
}

/**
 * Report User Request
 */
export interface ReportUserRequest {
  userId: string;
  reason: string;
  description: string | null;
}

/**
 * Add Social Link Request
 */
export interface AddSocialLinkRequest {
  platform: number;
  url: string;
  username: string | null;
}

/**
 * Create Collection Request
 */
export interface CreateCollectionRequest {
  name: string;
  description: string | null;
  isPrivate: boolean;
}
