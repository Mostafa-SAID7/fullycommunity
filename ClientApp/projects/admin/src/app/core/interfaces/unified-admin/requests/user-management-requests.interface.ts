/**
 * User Management Requests
 * Request interfaces for user management operations
 */

import {
  UserAccountType,
  SubscriptionTier,
  VisibilityLevel
} from '../enums/admin-enums';

import {
  AccountStatus,
  VerificationStatus,
  PriorityLevel
} from '../../../common/admin-common.interface';

/**
 * Create User Request
 */
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  password: string;
  accountType: UserAccountType;
  subscriptionTier?: SubscriptionTier;
  roles?: string[];
  sendWelcomeEmail?: boolean;
}

/**
 * Update User Request
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  accountType?: UserAccountType;
  subscriptionTier?: SubscriptionTier;
  roles?: string[];
}

/**
 * User Action Request
 */
export interface UserActionRequest {
  userId: string;
  action: UserActionType;
  reason?: string;
  duration?: number; // for suspensions in days
  notifyUser?: boolean;
  notes?: string;
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
  Delete = 11,
  Lock = 12,
  Unlock = 13
}

/**
 * Bulk User Action Request
 */
export interface BulkUserActionRequest {
  userIds: string[];
  action: UserActionType;
  reason?: string;
  duration?: number;
  notifyUsers?: boolean;
  notes?: string;
}

/**
 * User Filter Request
 */
export interface UserFilterRequest {
  search?: string;
  accountStatus?: AccountStatus;
  verificationStatus?: VerificationStatus;
  accountType?: UserAccountType;
  subscriptionTier?: SubscriptionTier;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
  isVerified?: boolean;
  hasWarnings?: boolean;
  isLocked?: boolean;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * User Role Assignment Request
 */
export interface UserRoleAssignmentRequest {
  userId: string;
  roleIds: string[];
  reason?: string;
}

/**
 * User Permission Request
 */
export interface UserPermissionRequest {
  userId: string;
  permissions: UserPermissionItem[];
  reason?: string;
}

/**
 * User Permission Item
 */
export interface UserPermissionItem {
  resource: string;
  action: string;
  granted: boolean;
  conditions?: any;
}

/**
 * User Moderation Request
 */
export interface UserModerationRequest {
  userId: string;
  action: ModerationActionType;
  reason: string;
  severity?: PriorityLevel;
  duration?: number;
  notes?: string;
}

/**
 * Moderation Action Type
 */
export enum ModerationActionType {
  Warning = 0,
  Suspension = 1,
  Ban = 2,
  ContentRestriction = 3,
  FeatureRestriction = 4,
  CommunicationRestriction = 5
}

/**
 * User Preferences Update Request
 */
export interface UserPreferencesUpdateRequest {
  userId: string;
  language?: string;
  timezone?: string;
  currency?: string;
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    inApp?: boolean;
    marketing?: boolean;
    security?: boolean;
  };
  privacy?: {
    profileVisibility?: VisibilityLevel;
    showEmail?: boolean;
    showPhone?: boolean;
    allowMessaging?: boolean;
    allowFollowing?: boolean;
    dataProcessing?: boolean;
  };
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
    keyboardNavigation?: boolean;
    reducedMotion?: boolean;
  };
}