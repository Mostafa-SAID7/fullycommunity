/**
 * Content Management Responses
 * Response interfaces for content management operations
 */

import { AdvancedContentManagement } from '../advanced-content-management.interface';

/**
 * Content List Response
 */
export interface ContentListResponse {
  content: AdvancedContentManagement[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Content Details Response
 */
export interface ContentDetailsResponse extends AdvancedContentManagement {
  moderationHistory: ContentModerationHistoryEntry[];
  reportHistory: ContentReportEntry[];
  appealHistory: ContentAppealEntry[];
  versionHistory: ContentVersionEntry[];
}

/**
 * Content Moderation History Entry
 */
export interface ContentModerationHistoryEntry {
  id: string;
  action: string;
  moderatorId: string;
  moderatorName: string;
  reason?: string;
  notes?: string;
  timestamp: string;
  previousStatus: string;
  newStatus: string;
}

/**
 * Content Report Entry
 */
export interface ContentReportEntry {
  id: string;
  reportType: string;
  reason: string;
  reporterId?: string;
  reporterName?: string;
  status: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

/**
 * Content Appeal Entry
 */
export interface ContentAppealEntry {
  id: string;
  reason: string;
  evidence?: string[];
  status: string;
  reviewedBy?: string;
  reviewedAt?: string;
  response?: string;
  createdAt: string;
}

/**
 * Content Version Entry
 */
export interface ContentVersionEntry {
  id: string;
  version: number;
  title: string;
  changes: string[];
  editedBy: string;
  editedAt: string;
  approved: boolean;
}

/**
 * Content Action Response
 */
export interface ContentActionResponse {
  success: boolean;
  message: string;
  affectedContent: number;
  errors?: ContentActionError[];
}

/**
 * Content Action Error
 */
export interface ContentActionError {
  contentId: string;
  error: string;
  code: string;
}

/**
 * Content Statistics Response
 */
export interface ContentStatisticsResponse {
  overview: ContentOverviewStats;
  moderation: ContentModerationStats;
  engagement: ContentEngagementStats;
  performance: ContentPerformanceStats;
  categories: ContentCategoryStats[];
}

/**
 * Content Overview Stats
 */
export interface ContentOverviewStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  archivedContent: number;
  flaggedContent: number;
  newContentToday: number;
  newContentThisWeek: number;
  newContentThisMonth: number;
}

/**
 * Content Moderation Stats
 */
export interface ContentModerationStats {
  pendingModeration: number;
  approvedToday: number;
  rejectedToday: number;
  flaggedToday: number;
  averageReviewTime: number;
  moderationQueue: number;
  appealsPending: number;
}

/**
 * Content Engagement Stats
 */
export interface ContentEngagementStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagementRate: number;
  topPerformingContent: TopContentItem[];
}

/**
 * Top Content Item
 */
export interface TopContentItem {
  contentId: string;
  title: string;
  type: string;
  views: number;
  engagement: number;
  score: number;
}

/**
 * Content Performance Stats
 */
export interface ContentPerformanceStats {
  averageViews: number;
  averageLikes: number;
  averageComments: number;
  averageShares: number;
  conversionRate: number;
  bounceRate: number;
  timeSpent: number;
}

/**
 * Content Category Stats
 */
export interface ContentCategoryStats {
  category: string;
  contentCount: number;
  totalViews: number;
  averageEngagement: number;
  growthRate: number;
  topContent: TopContentItem[];
}

/**
 * Content Moderation Queue Response
 */
export interface ContentModerationQueueResponse {
  queue: ContentModerationQueueItem[];
  total: number;
  priorityHigh: number;
  priorityMedium: number;
  priorityLow: number;
  averageWaitTime: number;
}

/**
 * Content Moderation Queue Item
 */
export interface ContentModerationQueueItem {
  contentId: string;
  title: string;
  type: string;
  authorName: string;
  priority: string;
  reason: string;
  submittedAt: string;
  waitTime: number;
  aiScore?: number;
  riskLevel: string;
}

/**
 * Content Export Response
 */
export interface ContentExportResponse {
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