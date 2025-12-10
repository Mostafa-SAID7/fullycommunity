/**
 * Content Management Components
 * Components used in advanced content management
 */

import {
  WarningType,
  DifficultyLevel,
  AgeRating,
  MediaType,
  ScheduleFrequency
} from '../enums/admin-enums';

import {
  ModerationInfo,
  PriorityLevel
} from '../../../common/admin-common.interface';

/**
 * Content Moderation Info
 */
export interface ContentModerationInfo extends ModerationInfo {
  aiScore: number;
  humanReviewed: boolean;
  appealCount: number;
  lastAppealAt: string | null;
  contentWarnings: ContentWarning[];
}

/**
 * Content Warning
 */
export interface ContentWarning {
  type: WarningType;
  severity: PriorityLevel;
  description: string;
  autoDetected: boolean;
}

/**
 * Content Metadata
 */
export interface ContentMetadata {
  wordCount?: number;
  readingTime?: number;
  language: string;
  difficulty?: DifficultyLevel;
  ageRating?: AgeRating;
  customFields: { [key: string]: any };
}

/**
 * SEO Info
 */
export interface SEOInfo {
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  structuredData: any;
}

/**
 * Media Info
 */
export interface MediaInfo {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string | null;
  alt: string | null;
  caption: string | null;
  fileSize: number;
  dimensions?: MediaDimensions;
  duration?: number;
}

/**
 * Media Dimensions
 */
export interface MediaDimensions {
  width: number;
  height: number;
}

/**
 * Content Engagement
 */
export interface ContentEngagement {
  views: number;
  uniqueViews: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  saves: number;
  reports: number;
  engagementRate: number;
  averageTimeSpent: number;
}

/**
 * Content Analytics
 */
export interface ContentAnalytics {
  impressions: number;
  clickThroughRate: number;
  bounceRate: number;
  conversionRate: number;
  revenueGenerated: number;
  topReferrers: string[];
  topKeywords: string[];
  audienceDemographics: AudienceDemographics;
}

/**
 * Audience Demographics
 */
export interface AudienceDemographics {
  ageGroups: { [key: string]: number };
  genders: { [key: string]: number };
  locations: { [key: string]: number };
  devices: { [key: string]: number };
}

/**
 * Content Scheduling
 */
export interface ContentScheduling {
  publishAt: string | null;
  unpublishAt: string | null;
  timezone: string;
  recurringSchedule: RecurringSchedule | null;
}

/**
 * Recurring Schedule
 */
export interface RecurringSchedule {
  frequency: ScheduleFrequency;
  interval: number;
  daysOfWeek: number[];
  endDate: string | null;
}