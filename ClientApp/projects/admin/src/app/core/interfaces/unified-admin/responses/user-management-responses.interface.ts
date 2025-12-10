/**
 * User Management Responses
 * Response interfaces for user management operations
 */

import { AdvancedUserManagement } from '../advanced-user-management.interface';
import { UserStatistics } from '../components/user-components.interface';

/**
 * User List Response
 */
export interface UserListResponse {
  users: AdvancedUserManagement[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * User Details Response
 */
export interface UserDetailsResponse extends AdvancedUserManagement {
  activityLog: UserActivityLogEntry[];
  loginHistory: UserLoginHistory[];
  deviceHistory: UserDeviceHistory[];
}

/**
 * User Activity Log Entry
 */
export interface UserActivityLogEntry {
  id: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  metadata?: any;
}

/**
 * User Login History
 */
export interface UserLoginHistory {
  id: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
  failureReason?: string;
  timestamp: string;
}

/**
 * User Device History
 */
export interface UserDeviceHistory {
  id: string;
  deviceType: string;
  deviceName: string;
  browser: string;
  os: string;
  firstSeen: string;
  lastSeen: string;
  isActive: boolean;
}

/**
 * User Action Response
 */
export interface UserActionResponse {
  success: boolean;
  message: string;
  affectedUsers: number;
  errors?: UserActionError[];
}

/**
 * User Action Error
 */
export interface UserActionError {
  userId: string;
  error: string;
  code: string;
}

/**
 * User Statistics Response
 */
export interface UserStatisticsResponse {
  overview: UserOverviewStats;
  growth: UserGrowthStats;
  engagement: UserEngagementStats;
  demographics: UserDemographicsStats;
  retention: UserRetentionStats;
}

/**
 * User Overview Stats
 */
export interface UserOverviewStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
}

/**
 * User Growth Stats
 */
export interface UserGrowthStats {
  dailyGrowth: GrowthDataPoint[];
  weeklyGrowth: GrowthDataPoint[];
  monthlyGrowth: GrowthDataPoint[];
  growthRate: number;
  churnRate: number;
}

/**
 * Growth Data Point
 */
export interface GrowthDataPoint {
  date: string;
  newUsers: number;
  totalUsers: number;
  churnedUsers: number;
}

/**
 * User Engagement Stats
 */
export interface UserEngagementStats {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  averagePageViews: number;
  engagementRate: number;
}

/**
 * User Demographics Stats
 */
export interface UserDemographicsStats {
  ageGroups: { [key: string]: number };
  genders: { [key: string]: number };
  locations: { [key: string]: number };
  devices: { [key: string]: number };
  languages: { [key: string]: number };
}

/**
 * User Retention Stats
 */
export interface UserRetentionStats {
  day1Retention: number;
  day7Retention: number;
  day30Retention: number;
  cohortAnalysis: CohortData[];
}

/**
 * Cohort Data
 */
export interface CohortData {
  cohort: string;
  size: number;
  retention: { [key: string]: number };
}

/**
 * User Export Response
 */
export interface UserExportResponse {
  exportId: string;
  status: ExportStatus;
  downloadUrl?: string;
  totalRecords: number;
  processedRecords: number;
  createdAt: string;
  completedAt?: string;
  expiresAt: string;
}

/**
 * Export Status
 */
export enum ExportStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Expired = 4
}