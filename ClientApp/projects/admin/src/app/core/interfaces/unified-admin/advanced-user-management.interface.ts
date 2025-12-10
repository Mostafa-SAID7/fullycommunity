/**
 * Advanced User Management
 * Comprehensive user management interface
 */

import {
  BaseAdminEntity,
  AccountStatus,
  VerificationStatus
} from '../../common/admin-common.interface';

import {
  UserAccountType,
  SubscriptionTier
} from './enums/admin-enums';

import {
  UserRole,
  Permission,
  UserStatistics,
  UserModerationInfo,
  UserFinancialInfo,
  UserPreferences
} from './components/user-components.interface';

/**
 * Advanced User Management
 */
export interface AdvancedUserManagement extends BaseAdminEntity {
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  avatarUrl: string | null;
  
  // Account Info
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  accountType: UserAccountType;
  subscriptionTier: SubscriptionTier;
  
  // Verification
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  isBusinessVerified: boolean;
  
  // Security
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  lastActivityAt: string | null;
  loginAttempts: number;
  isLocked: boolean;
  lockedUntil: string | null;
  
  // Roles and Permissions
  roles: UserRole[];
  permissions: Permission[];
  
  // Statistics
  stats: UserStatistics;
  
  // Moderation
  moderation: UserModerationInfo;
  
  // Financial
  financial: UserFinancialInfo;
  
  // Preferences
  preferences: UserPreferences;
}