/**
 * Profile Activity
 * User activity and engagement
 */
export interface ProfileActivity {
  userId: string;
  
  // Content Created
  postsCreated: number;
  videosCreated: number;
  podcastsCreated: number;
  productsListed: number;
  servicesOffered: number;
  
  // Engagement Given
  likesGiven: number;
  commentsGiven: number;
  sharesGiven: number;
  
  // Engagement Received
  likesReceived: number;
  commentsReceived: number;
  sharesReceived: number;
  viewsReceived: number;
  
  // Social
  followersGained: number;
  followingCount: number;
  friendsCount: number;
  
  // Achievements
  badgesEarned: number;
  level: number;
  experiencePoints: number;
  
  // Time
  totalTimeSpent: number;
  lastActiveAt: string;
}

/**
 * Activity Log
 */
export interface ActivityLog {
  id: string;
  userId: string;
  activityType: ActivityType;
  description: string;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  location: string | null;
  createdAt: string;
}

/**
 * Activity Type
 */
export enum ActivityType {
  Login = 0,
  Logout = 1,
  ProfileUpdate = 2,
  PasswordChange = 3,
  EmailChange = 4,
  PhoneChange = 5,
  AvatarUpdate = 6,
  PrivacyUpdate = 7,
  PostCreated = 8,
  PostDeleted = 9,
  VideoUploaded = 10,
  PodcastPublished = 11,
  ProductListed = 12,
  ServiceCreated = 13,
  AccountDeactivated = 14,
  AccountReactivated = 15
}

/**
 * Login History
 */
export interface LoginHistory {
  id: string;
  userId: string;
  loginTime: string;
  logoutTime: string | null;
  ipAddress: string;
  userAgent: string;
  device: string | null;
  browser: string | null;
  location: string | null;
  isSuccessful: boolean;
  failureReason: string | null;
}

/**
 * Active Session
 */
export interface ActiveSession {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string | null;
  isCurrent: boolean;
  lastActivityAt: string;
  createdAt: string;
}
