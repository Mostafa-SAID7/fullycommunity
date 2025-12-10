/**
 * Admin Users Interfaces
 * Interfaces for user management
 */

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  userName: string;  // Alternative property name for compatibility
  avatar?: string;
  status: UserStatus;
  accountStatus: string;  // Alternative property name for compatibility
  role: UserRole;
  roles: UserRole[];  // Alternative property name for compatibility
  isVerified: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Stats
  postCount: number;
  commentCount: number;
  likeCount: number;
  followerCount: number;
  followingCount: number;
}

export interface UserListResponse {
  users: AdminUser[];
  items: AdminUser[];  // Alternative property name for compatibility
  total: number;
  totalCount: number;  // Alternative property name for compatibility
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  verifiedUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export enum UserStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Banned = 3,
  PendingVerification = 4
}

export enum UserRole {
  User = 0,
  Moderator = 1,
  Admin = 2,
  SuperAdmin = 3
}