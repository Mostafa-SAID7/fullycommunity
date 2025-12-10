/**
 * Admin User Management
 * Complete user management for admin panel
 */
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  avatarUrl: string | null;
  userType: string;
  accountStatus: AdminAccountStatus;
  verificationStatus: AdminVerificationStatus;
  isVerified: boolean;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  roles: string[];
  
  // Stats
  followerCount: number;
  followingCount: number;
  postCount: number;
  videoCount: number;
  podcastCount: number;
  
  // Activity
  lastLoginAt: string | null;
  lastActivityAt: string | null;
  loginCount: number;
  
  // Moderation
  warningCount: number;
  suspensionCount: number;
  reportCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Account Status
 */
export enum AdminAccountStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Deactivated = 3,
  Deleted = 4,
  Banned = 5,
  PendingVerification = 6
}

/**
 * Admin Verification Status
 */
export enum AdminVerificationStatus {
  Unverified = 0,
  Pending = 1,
  Verified = 2,
  Rejected = 3,
  Expired = 4
}

/**
 * User Filter
 */
export interface UserFilter {
  search: string | null;
  status: AdminAccountStatus | null;
  verificationStatus: AdminVerificationStatus | null;
  userType: string | null;
  role: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  isVerified: boolean | null;
  hasWarnings: boolean | null;
}

/**
 * User Action
 */
export interface UserAction {
  userId: string;
  action: UserActionType;
  reason: string | null;
  duration: number | null; // for suspensions
  notifyUser: boolean;
}

/**
 * User Action Type
 */
export enum UserActionType {
  Activate = 0,
  Deactivate = 1,
  Suspend = 2,
  Unsuspend = 3,
  Ban = 4,
  Unban = 5,
  Verify = 6,
  Unverify = 7,
  Warn = 8,
  ResetPassword = 9,
  ForceLogout = 10,
  Delete = 11
}

/**
 * Bulk User Action
 */
export interface BulkUserAction {
  userIds: string[];
  action: UserActionType;
  reason: string | null;
  duration: number | null;
  notifyUsers: boolean;
}

/**
 * User Statistics
 */
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  onlineUsers: number;
  
  // Growth
  userGrowthRate: number;
  retentionRate: number;
  
  // Activity
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
}