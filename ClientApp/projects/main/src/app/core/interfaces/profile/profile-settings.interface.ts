/**
 * Profile Settings
 * User profile configuration and preferences
 */
export interface ProfileSettings {
  id: string;
  userId: string;
  
  // Privacy Settings
  isPrivate: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showBirthday: boolean;
  showLocation: boolean;
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  
  // Who Can...
  whoCanFollow: PrivacyLevel;
  whoCanMessage: PrivacyLevel;
  whoCanComment: PrivacyLevel;
  whoCanTag: PrivacyLevel;
  whoCanSeeFollowers: PrivacyLevel;
  whoCanSeeFollowing: PrivacyLevel;
  whoCanSeePosts: PrivacyLevel;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  
  // Content Preferences
  contentLanguages: string[];
  contentCategories: string[];
  blockedKeywords: string[];
  
  // Display
  theme: string;
  language: string;
  timezone: string;
  
  updatedAt: string;
}

/**
 * Privacy Level
 */
export enum PrivacyLevel {
  Everyone = 0,
  Following = 1,
  Followers = 2,
  Friends = 3,
  OnlyMe = 4
}

/**
 * Account Settings
 */
export interface AccountSettings {
  id: string;
  userId: string;
  
  // Security
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
  sessionTimeout: number;
  
  // Email
  emailVerified: boolean;
  emailNotifications: boolean;
  
  // Phone
  phoneVerified: boolean;
  smsNotifications: boolean;
  
  // Data
  dataDownloadEnabled: boolean;
  activityLogEnabled: boolean;
  
  // Deactivation
  canDeactivate: boolean;
  deactivatedAt: string | null;
  
  updatedAt: string;
}

/**
 * Blocked User
 */
export interface BlockedUser {
  id: string;
  userId: string;
  blockedUserId: string;
  blockedUserName: string;
  blockedUserAvatarUrl: string | null;
  reason: string | null;
  blockedAt: string;
}

/**
 * Privacy Settings Request
 */
export interface UpdatePrivacySettingsRequest {
  isPrivate: boolean | null;
  showEmail: boolean | null;
  showPhone: boolean | null;
  showBirthday: boolean | null;
  showLocation: boolean | null;
  showOnlineStatus: boolean | null;
  whoCanFollow: PrivacyLevel | null;
  whoCanMessage: PrivacyLevel | null;
  whoCanComment: PrivacyLevel | null;
  whoCanTag: PrivacyLevel | null;
}
