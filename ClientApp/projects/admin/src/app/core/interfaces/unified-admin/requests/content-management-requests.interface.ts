/**
 * Content Management Requests
 * Request interfaces for content management operations
 */

import {
  ContentStatus,
  ModerationStatus,
  PriorityLevel
} from '../../../common/admin-common.interface';

import {
  WarningType,
  DifficultyLevel,
  AgeRating,
  MediaType,
  ScheduleFrequency
} from '../enums/admin-enums';

/**
 * Content Moderation Request
 */
export interface ContentModerationRequest {
  contentId: string;
  action: ContentModerationAction;
  reason?: string;
  notes?: string;
  warnings?: ContentWarningRequest[];
}

/**
 * Content Moderation Action
 */
export enum ContentModerationAction {
  Approve = 0,
  Reject = 1,
  Flag = 2,
  Hide = 3,
  Delete = 4,
  Restore = 5,
  Archive = 6,
  Feature = 7,
  Unfeature = 8
}

/**
 * Content Warning Request
 */
export interface ContentWarningRequest {
  type: WarningType;
  severity: PriorityLevel;
  description: string;
  autoDetected?: boolean;
}

/**
 * Bulk Content Action Request
 */
export interface BulkContentActionRequest {
  contentIds: string[];
  action: ContentModerationAction;
  reason?: string;
  notes?: string;
}

/**
 * Content Filter Request
 */
export interface ContentFilterRequest {
  search?: string;
  contentType?: string;
  status?: ContentStatus;
  moderationStatus?: ModerationStatus;
  authorId?: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  hasReports?: boolean;
  isFlagged?: boolean;
  hasWarnings?: boolean;
  ageRating?: AgeRating;
  difficulty?: DifficultyLevel;
  language?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Content Update Request
 */
export interface ContentUpdateRequest {
  contentId: string;
  title?: string;
  content?: string;
  excerpt?: string;
  categories?: string[];
  tags?: string[];
  status?: ContentStatus;
  metadata?: ContentMetadataRequest;
  seo?: SEOUpdateRequest;
  scheduling?: ContentSchedulingRequest;
}

/**
 * Content Metadata Request
 */
export interface ContentMetadataRequest {
  language?: string;
  difficulty?: DifficultyLevel;
  ageRating?: AgeRating;
  customFields?: { [key: string]: any };
}

/**
 * SEO Update Request
 */
export interface SEOUpdateRequest {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  structuredData?: any;
}

/**
 * Content Scheduling Request
 */
export interface ContentSchedulingRequest {
  publishAt?: string;
  unpublishAt?: string;
  timezone?: string;
  recurringSchedule?: RecurringScheduleRequest;
}

/**
 * Recurring Schedule Request
 */
export interface RecurringScheduleRequest {
  frequency: ScheduleFrequency;
  interval: number;
  daysOfWeek?: number[];
  endDate?: string;
}

/**
 * Media Upload Request
 */
export interface MediaUploadRequest {
  file: File;
  type: MediaType;
  alt?: string;
  caption?: string;
  contentId?: string;
}

/**
 * Media Update Request
 */
export interface MediaUpdateRequest {
  mediaId: string;
  alt?: string;
  caption?: string;
  description?: string;
}

/**
 * Content Appeal Request
 */
export interface ContentAppealRequest {
  contentId: string;
  reason: string;
  evidence?: string[];
  contactEmail?: string;
}

/**
 * Content Report Request
 */
export interface ContentReportRequest {
  contentId: string;
  reportType: ContentReportType;
  reason: string;
  evidence?: string[];
  reporterId?: string;
}

/**
 * Content Report Type
 */
export enum ContentReportType {
  Spam = 0,
  Harassment = 1,
  Violence = 2,
  Adult = 3,
  Hate = 4,
  Copyright = 5,
  Misinformation = 6,
  Other = 7
}