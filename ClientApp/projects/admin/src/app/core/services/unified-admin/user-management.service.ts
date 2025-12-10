/**
 * Unified User Management Service
 * Service for advanced user management operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseAdminService } from '../base/base-admin.service';

import {
  AdvancedUserManagement,
  UserListResponse,
  UserDetailsResponse,
  UserActionResponse,
  UserStatisticsResponse,
  UserExportResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserActionRequest,
  BulkUserActionRequest,
  UserFilterRequest,
  UserRoleAssignmentRequest,
  UserPermissionRequest,
  UserModerationRequest,
  UserPreferencesUpdateRequest
} from '../../interfaces/unified-admin';

@Injectable({
  providedIn: 'root'
})
export class UnifiedUserManagementService extends BaseAdminService {
  private readonly apiPath = '/unified/users';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get users with filtering and pagination
   */
  getUsers(filter: UserFilterRequest): Observable<UserListResponse> {
    const params = this.buildParams(filter);
    return this.get<UserListResponse>(this.apiPath, params);
  }

  /**
   * Get user details by ID
   */
  getUserDetails(userId: string): Observable<UserDetailsResponse> {
    return this.get<UserDetailsResponse>(`${this.apiPath}/${userId}`);
  }

  /**
   * Create new user
   */
  createUser(request: CreateUserRequest): Observable<AdvancedUserManagement> {
    return this.post<AdvancedUserManagement>(this.apiPath, request);
  }

  /**
   * Update user
   */
  updateUser(userId: string, request: UpdateUserRequest): Observable<AdvancedUserManagement> {
    return this.put<AdvancedUserManagement>(`${this.apiPath}/${userId}`, request);
  }

  /**
   * Delete user
   */
  deleteUser(userId: string, reason?: string): Observable<void> {
    const params = reason ? this.buildParams({ reason }) : undefined;
    return this.delete<void>(`${this.apiPath}/${userId}`, params);
  }

  /**
   * Perform user action (activate, suspend, ban, etc.)
   */
  performUserAction(request: UserActionRequest): Observable<UserActionResponse> {
    return this.post<UserActionResponse>(`${this.apiPath}/actions`, request);
  }

  /**
   * Perform bulk user actions
   */
  performBulkUserAction(request: BulkUserActionRequest): Observable<UserActionResponse> {
    return this.post<UserActionResponse>(`${this.apiPath}/bulk-actions`, request);
  }

  /**
   * Assign roles to user
   */
  assignUserRoles(request: UserRoleAssignmentRequest): Observable<void> {
    return this.post<void>(`${this.apiPath}/roles/assign`, request);
  }

  /**
   * Update user permissions
   */
  updateUserPermissions(request: UserPermissionRequest): Observable<void> {
    return this.post<void>(`${this.apiPath}/permissions/update`, request);
  }

  /**
   * Apply moderation action to user
   */
  moderateUser(request: UserModerationRequest): Observable<UserActionResponse> {
    return this.post<UserActionResponse>(`${this.apiPath}/moderation`, request);
  }

  /**
   * Update user preferences
   */
  updateUserPreferences(request: UserPreferencesUpdateRequest): Observable<void> {
    return this.put<void>(`${this.apiPath}/preferences`, request);
  }

  /**
   * Get user statistics
   */
  getUserStatistics(): Observable<UserStatisticsResponse> {
    return this.getStatistics<UserStatisticsResponse>(`${this.apiPath}/statistics`);
  }

  /**
   * Get user activity log
   */
  getUserActivityLog(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ page, pageSize });
    return this.get(`${this.apiPath}/${userId}/activity-log`, params);
  }

  /**
   * Get user login history
   */
  getUserLoginHistory(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ page, pageSize });
    return this.get(`${this.apiPath}/${userId}/login-history`, params);
  }

  /**
   * Get user device history
   */
  getUserDeviceHistory(userId: string): Observable<any> {
    return this.get(`${this.apiPath}/${userId}/device-history`);
  }

  /**
   * Reset user password
   */
  resetUserPassword(userId: string, sendEmail: boolean = true): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/reset-password`, { sendEmail });
  }

  /**
   * Force user logout
   */
  forceUserLogout(userId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/force-logout`, {});
  }

  /**
   * Lock user account
   */
  lockUserAccount(userId: string, duration?: number, reason?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/lock`, { duration, reason });
  }

  /**
   * Unlock user account
   */
  unlockUserAccount(userId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/unlock`, {});
  }

  /**
   * Verify user account
   */
  verifyUserAccount(userId: string, verificationType: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/verify`, { verificationType });
  }

  /**
   * Export users data
   */
  exportUsers(filter: UserFilterRequest, format: 'csv' | 'excel' = 'csv'): Observable<UserExportResponse> {
    return this.post<UserExportResponse>(`${this.apiPath}/export`, { filter, format });
  }

  /**
   * Import users data
   */
  importUsers(file: File): Observable<any> {
    return this.uploadFile(`${this.apiPath}/import`, file);
  }

  /**
   * Get available roles
   */
  getAvailableRoles(): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/roles`);
  }

  /**
   * Get available permissions
   */
  getAvailablePermissions(): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/permissions`);
  }

  /**
   * Search users
   */
  searchUsers(query: string, limit: number = 10): Observable<AdvancedUserManagement[]> {
    return this.search<AdvancedUserManagement>(`${this.apiPath}/search`, query, limit);
  }

  /**
   * Get user engagement metrics
   */
  getUserEngagementMetrics(userId: string, timeRange: string = '30d'): Observable<any> {
    const params = this.buildParams({ timeRange });
    return this.get(`${this.apiPath}/${userId}/engagement-metrics`, params);
  }

  /**
   * Get user content summary
   */
  getUserContentSummary(userId: string): Observable<any> {
    return this.get(`${this.apiPath}/${userId}/content-summary`);
  }

  /**
   * Get user security events
   */
  getUserSecurityEvents(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ page, pageSize });
    return this.get(`${this.apiPath}/${userId}/security-events`, params);
  }

  /**
   * Enable two-factor authentication for user
   */
  enableTwoFactorAuth(userId: string): Observable<any> {
    return this.post(`${this.apiPath}/${userId}/2fa/enable`, {});
  }

  /**
   * Disable two-factor authentication for user
   */
  disableTwoFactorAuth(userId: string, reason?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/2fa/disable`, { reason });
  }

  /**
   * Get user subscription details
   */
  getUserSubscription(userId: string): Observable<any> {
    return this.get(`${this.apiPath}/${userId}/subscription`);
  }

  /**
   * Update user subscription
   */
  updateUserSubscription(userId: string, subscriptionData: any): Observable<any> {
    return this.put(`${this.apiPath}/${userId}/subscription`, subscriptionData);
  }

  /**
   * Get user payment history
   */
  getUserPaymentHistory(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ page, pageSize });
    return this.get(`${this.apiPath}/${userId}/payment-history`, params);
  }

  /**
   * Refund user payment
   */
  refundUserPayment(userId: string, paymentId: string, amount?: number, reason?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/payments/${paymentId}/refund`, {
      amount,
      reason
    });
  }

  /**
   * Get user referrals
   */
  getUserReferrals(userId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${userId}/referrals`);
  }

  /**
   * Get user notifications settings
   */
  getUserNotificationSettings(userId: string): Observable<any> {
    return this.get(`${this.apiPath}/${userId}/notification-settings`);
  }

  /**
   * Update user notification settings
   */
  updateUserNotificationSettings(userId: string, settings: any): Observable<void> {
    return this.put<void>(`${this.apiPath}/${userId}/notification-settings`, settings);
  }

  /**
   * Get user privacy settings
   */
  getUserPrivacySettings(userId: string): Observable<any> {
    return this.get(`${this.apiPath}/${userId}/privacy-settings`);
  }

  /**
   * Update user privacy settings
   */
  updateUserPrivacySettings(userId: string, settings: any): Observable<void> {
    return this.put<void>(`${this.apiPath}/${userId}/privacy-settings`, settings);
  }

  /**
   * Get user blocked users list
   */
  getUserBlockedUsers(userId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${userId}/blocked-users`);
  }

  /**
   * Block user for another user
   */
  blockUserForUser(userId: string, targetUserId: string, reason?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/block-user`, {
      targetUserId,
      reason
    });
  }

  /**
   * Unblock user for another user
   */
  unblockUserForUser(userId: string, targetUserId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/unblock-user`, {
      targetUserId
    });
  }

  /**
   * Get user followers
   */
  getUserFollowers(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ page, pageSize });
    return this.get(`${this.apiPath}/${userId}/followers`, params);
  }

  /**
   * Get user following
   */
  getUserFollowing(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ page, pageSize });
    return this.get(`${this.apiPath}/${userId}/following`, params);
  }

  /**
   * Get user badges and achievements
   */
  getUserBadges(userId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${userId}/badges`);
  }

  /**
   * Award badge to user
   */
  awardBadgeToUser(userId: string, badgeId: string, reason?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/badges/award`, {
      badgeId,
      reason
    });
  }

  /**
   * Revoke badge from user
   */
  revokeBadgeFromUser(userId: string, badgeId: string, reason?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/badges/revoke`, {
      badgeId,
      reason
    });
  }

  /**
   * Get user trust score details
   */
  getUserTrustScore(userId: string): Observable<any> {
    return this.get(`${this.apiPath}/${userId}/trust-score`);
  }

  /**
   * Update user trust score
   */
  updateUserTrustScore(userId: string, score: number, reason: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/trust-score/update`, {
      score,
      reason
    });
  }

  /**
   * Get user content violations
   */
  getUserContentViolations(userId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ page, pageSize });
    return this.get(`${this.apiPath}/${userId}/content-violations`, params);
  }

  /**
   * Add content violation for user
   */
  addContentViolation(userId: string, violation: any): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/content-violations`, violation);
  }

  /**
   * Remove content violation for user
   */
  removeContentViolation(userId: string, violationId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/${userId}/content-violations/${violationId}`);
  }

  /**
   * Get user communication restrictions
   */
  getUserCommunicationRestrictions(userId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${userId}/communication-restrictions`);
  }

  /**
   * Add communication restriction
   */
  addCommunicationRestriction(userId: string, restriction: any): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/communication-restrictions`, restriction);
  }

  /**
   * Remove communication restriction
   */
  removeCommunicationRestriction(userId: string, restrictionId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/${userId}/communication-restrictions/${restrictionId}`);
  }

  /**
   * Get user feature access
   */
  getUserFeatureAccess(userId: string): Observable<any> {
    return this.get(`${this.apiPath}/${userId}/feature-access`);
  }

  /**
   * Update user feature access
   */
  updateUserFeatureAccess(userId: string, features: any): Observable<void> {
    return this.put<void>(`${this.apiPath}/${userId}/feature-access`, features);
  }

  /**
   * Get user API usage
   */
  getUserApiUsage(userId: string, timeRange: string = '30d'): Observable<any> {
    const params = this.buildParams({ timeRange });
    return this.get(`${this.apiPath}/${userId}/api-usage`, params);
  }

  /**
   * Reset user API limits
   */
  resetUserApiLimits(userId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/api-limits/reset`, {});
  }

  /**
   * Get user data export status
   */
  getUserDataExportStatus(userId: string): Observable<any> {
    return this.get(`${this.apiPath}/${userId}/data-export/status`);
  }

  /**
   * Request user data export
   */
  requestUserDataExport(userId: string, includeContent: boolean = true): Observable<any> {
    return this.post(`${this.apiPath}/${userId}/data-export/request`, {
      includeContent
    });
  }

  /**
   * Delete user data (GDPR compliance)
   */
  deleteUserData(userId: string, reason: string, retentionPeriod?: number): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/data-deletion`, {
      reason,
      retentionPeriod
    });
  }

  /**
   * Anonymize user data
   */
  anonymizeUserData(userId: string, reason: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/anonymize`, {
      reason
    });
  }

  /**
   * Get user merge candidates (duplicate accounts)
   */
  getUserMergeCandidates(userId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${userId}/merge-candidates`);
  }

  /**
   * Merge user accounts
   */
  mergeUserAccounts(primaryUserId: string, secondaryUserId: string, mergeOptions: any): Observable<void> {
    return this.post<void>(`${this.apiPath}/${primaryUserId}/merge`, {
      secondaryUserId,
      mergeOptions
    });
  }

  /**
   * Get user impersonation history
   */
  getUserImpersonationHistory(userId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/${userId}/impersonation-history`);
  }

  /**
   * Start user impersonation session
   */
  startUserImpersonation(userId: string, reason: string): Observable<any> {
    return this.post(`${this.apiPath}/${userId}/impersonate/start`, {
      reason
    });
  }

  /**
   * End user impersonation session
   */
  endUserImpersonation(userId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/${userId}/impersonate/end`, {});
  }
}