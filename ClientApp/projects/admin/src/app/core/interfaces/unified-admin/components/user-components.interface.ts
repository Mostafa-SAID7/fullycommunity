/**
 * User Management Components
 * Components used in advanced user management
 */

import {
  UserAccountType,
  SubscriptionTier,
  RiskLevel,
  PaymentMethodType,
  SubscriptionStatus,
  VisibilityLevel
} from '../enums/admin-enums';

/**
 * User Role
 */
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

/**
 * Permission
 */
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: any;
}

/**
 * User Statistics
 */
export interface UserStatistics {
  contentCount: number;
  followerCount: number;
  followingCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  averageRating: number;
  totalRevenue: number;
  lifetimeValue: number;
}

/**
 * User Moderation Info
 */
export interface UserModerationInfo {
  warningCount: number;
  suspensionCount: number;
  reportCount: number;
  trustScore: number;
  riskLevel: RiskLevel;
  lastWarningAt: string | null;
  lastSuspensionAt: string | null;
  moderationNotes: string[];
}

/**
 * User Financial Info
 */
export interface UserFinancialInfo {
  totalSpent: number;
  totalEarned: number;
  pendingPayouts: number;
  paymentMethods: PaymentMethod[];
  subscriptionStatus: SubscriptionStatus;
  billingAddress: Address | null;
}

/**
 * Payment Method
 */
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  isVerified: boolean;
}

/**
 * Address
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

/**
 * User Preferences
 */
export interface UserPreferences {
  language: string;
  timezone: string;
  currency: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
}

/**
 * Notification Preferences
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  marketing: boolean;
  security: boolean;
}

/**
 * Privacy Preferences
 */
export interface PrivacyPreferences {
  profileVisibility: VisibilityLevel;
  showEmail: boolean;
  showPhone: boolean;
  allowMessaging: boolean;
  allowFollowing: boolean;
  dataProcessing: boolean;
}

/**
 * Accessibility Preferences
 */
export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}