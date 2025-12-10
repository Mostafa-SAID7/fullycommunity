/**
 * User Profile
 * Complete user profile information
 */
export interface UserProfile {
  id: string;
  
  // Basic Info
  email: string;
  username: string | null;
  firstName: string;
  lastName: string;
  displayName: string;
  
  // Contact
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  
  // Media
  avatarUrl: string | null;
  backgroundUrl: string | null;
  bannerUrl: string | null;
  
  // Bio
  bio: string | null;
  tagline: string | null;
  website: string | null;
  
  // Personal
  birthday: string | null;
  gender: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  
  // Preferences
  themeColor: string | null;
  preferredLanguage: string | null;
  timezone: string | null;
  
  // Account
  userType: string;
  accountStatus: string;
  verificationStatus: string;
  isVerified: boolean;
  emailConfirmed: boolean;
  twoFactorEnabled: boolean;
  
  // Roles & Permissions
  roles: string[];
  badges: ProfileBadge[];
  
  // Stats
  followerCount: number;
  followingCount: number;
  postCount: number;
  videoCount: number;
  podcastCount: number;
  
  // Timestamps
  createdAt: string;
  lastActivityAt: string | null;
  
  // Privacy
  isPrivate: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showBirthday: boolean;
  showLocation: boolean;
}

/**
 * Profile Badge
 */
export interface ProfileBadge {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  color: string | null;
  earnedAt: string;
}

/**
 * Public Profile
 * Limited profile info for public viewing
 */
export interface PublicProfile {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  bio: string | null;
  tagline: string | null;
  website: string | null;
  location: string | null;
  isVerified: boolean;
  badges: ProfileBadge[];
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
  isPrivate: boolean;
  createdAt: string;
}
