/**
 * Common Admin Interfaces and Enums
 * Shared across all admin modules to eliminate duplication
 */

/**
 * Moderation Status - Used across all content types
 */
export enum ModerationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Flagged = 3,
  UnderReview = 4,
  RequiresAction = 5,
  AutoApproved = 6,
  AutoRejected = 7
}

/**
 * Content Status - Generic status for all content types
 */
export enum ContentStatus {
  Draft = 0,
  Published = 1,
  Scheduled = 2,
  Archived = 3,
  Deleted = 4,
  Hidden = 5,
  Suspended = 6,
  Flagged = 7,
  Pending = 8,
  Private = 9,
  Unlisted = 10
}

/**
 * Account Status - User account states
 */
export enum AccountStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Deactivated = 3,
  Deleted = 4,
  Banned = 5,
  PendingVerification = 6,
  Locked = 7,
  Expired = 8
}

/**
 * Verification Status - For users, businesses, content
 */
export enum VerificationStatus {
  Unverified = 0,
  Pending = 1,
  Verified = 2,
  Rejected = 3,
  Expired = 4,
  Suspended = 5,
  UnderReview = 6
}

/**
 * Payment Status - For transactions and orders
 */
export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3,
  PartiallyRefunded = 4,
  Cancelled = 5,
  Disputed = 6,
  Chargeback = 7,
  Processing = 8
}

/**
 * Priority Level - For tickets, reports, tasks
 */
export enum PriorityLevel {
  Low = 0,
  Normal = 1,
  High = 2,
  Critical = 3,
  Emergency = 4
}

/**
 * Action Type - For audit logs and user actions
 */
export enum ActionType {
  Create = 0,
  Read = 1,
  Update = 2,
  Delete = 3,
  Approve = 4,
  Reject = 5,
  Flag = 6,
  Hide = 7,
  Suspend = 8,
  Ban = 9,
  Verify = 10,
  Login = 11,
  Logout = 12,
  Export = 13,
  Import = 14,
  Backup = 15,
  Restore = 16
}

/**
 * Base Admin Entity - Common fields for all admin entities
 */
export interface BaseAdminEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Moderation Info - Common moderation fields
 */
export interface ModerationInfo {
  moderationStatus: ModerationStatus;
  flaggedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  moderationNotes: string | null;
  moderationReason: string | null;
  autoModerated: boolean;
}

/**
 * Statistics Base - Common statistics structure
 */
export interface BaseStatistics {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  flagged: number;
  deleted: number;
  growth: GrowthStats;
  engagement: EngagementStats;
}

/**
 * Growth Statistics
 */
export interface GrowthStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  lastYear: number;
  growthRate: number;
}

/**
 * Engagement Statistics
 */
export interface EngagementStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  reports: number;
  engagementRate: number;
  averageRating: number;
}

/**
 * Category Statistics
 */
export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
  engagementRate: number;
  growthRate: number;
}

/**
 * User Statistics
 */
export interface UserStats {
  userId: string;
  userName: string;
  contentCount: number;
  engagementScore: number;
  rating: number;
  revenue?: number;
}

/**
 * Filter Base - Common filtering structure
 */
export interface BaseFilter {
  search: string | null;
  status: ContentStatus | null;
  moderationStatus: ModerationStatus | null;
  dateFrom: string | null;
  dateTo: string | null;
  createdBy: string | null;
  category: string | null;
  tags: string[] | null;
  hasReports: boolean | null;
  isFlagged: boolean | null;
  isVerified: boolean | null;
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

/**
 * Bulk Action Request
 */
export interface BulkActionRequest {
  ids: string[];
  action: ActionType;
  reason?: string;
  data?: any;
}

/**
 * Bulk Action Response
 */
export interface BulkActionResponse {
  successful: string[];
  failed: BulkActionError[];
  totalProcessed: number;
  successCount: number;
  failureCount: number;
}

/**
 * Bulk Action Error
 */
export interface BulkActionError {
  id: string;
  error: string;
  code?: string;
}

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: ActionType;
  entityType: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

/**
 * Report Info
 */
export interface ReportInfo {
  id: string;
  reportedBy: string;
  reporterName: string;
  reason: string;
  category: string;
  description: string | null;
  status: ModerationStatus;
  priority: PriorityLevel;
  assignedTo: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  createdAt: string;
}

/**
 * Notification Info
 */
export interface NotificationInfo {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  expiresAt: string | null;
}

/**
 * Export Request
 */
export interface ExportRequest {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  filters?: any;
  fields?: string[];
  includeDeleted?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

/**
 * Import Request
 */
export interface ImportRequest {
  file: File;
  format: 'csv' | 'xlsx' | 'json';
  mapping?: { [key: string]: string };
  validateOnly?: boolean;
  skipErrors?: boolean;
}

/**
 * Import Result
 */
export interface ImportResult {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: ImportError[];
  warnings: ImportWarning[];
}

/**
 * Import Error
 */
export interface ImportError {
  row: number;
  field: string;
  value: any;
  error: string;
}

/**
 * Import Warning
 */
export interface ImportWarning {
  row: number;
  field: string;
  value: any;
  warning: string;
}

/**
 * System Health Info
 */
export interface SystemHealthInfo {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  version: string;
  environment: string;
  database: HealthCheck;
  cache: HealthCheck;
  storage: HealthCheck;
  externalServices: HealthCheck[];
  lastChecked: string;
}

/**
 * Health Check
 */
export interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  message?: string;
  lastChecked: string;
}

/**
 * Configuration Setting
 */
export interface ConfigurationSetting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  description: string;
  isRequired: boolean;
  isSecret: boolean;
  defaultValue: any;
  validationRules?: any;
  updatedAt: string;
  updatedBy: string;
}

/**
 * Feature Flag
 */
export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPercentage: number;
  targetUsers?: string[];
  targetRoles?: string[];
  conditions?: any;
  createdAt: string;
  updatedAt: string;
}