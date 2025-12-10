/**
 * Video Filter Request Interfaces
 * Filter and search related request interfaces
 */

import { BaseFilter } from '../../../common/base.interface';
import {
  VideoStatus,
  VideoDuration,
  VideoQuality,
  MonetizationStatus,
  AgeRating
} from '../enums/video-enums';

export interface VideoAdminFilter extends BaseFilter {
  search?: string;
  status?: VideoStatus;
  category?: string;
  creator?: string;
  dateFrom?: string;
  dateTo?: string;
  duration?: VideoDuration;
  quality?: VideoQuality;
  monetization?: MonetizationStatus;
  ageRating?: AgeRating;
  language?: string;
  hasSubtitles?: boolean;
  isLive?: boolean;
  isFeatured?: boolean;
  hasReports?: boolean;
  flagCount?: number;
  viewCountMin?: number;
  viewCountMax?: number;
}

export interface VideoSearchRequest {
  query: string;
  filters?: VideoAdminFilter;
  limit?: number;
  includeTranscription?: boolean;
  includeComments?: boolean;
  fuzzySearch?: boolean;
}

export interface VideoExportRequest {
  filter: VideoAdminFilter;
  format: 'csv' | 'excel' | 'pdf';
  includeAnalytics?: boolean;
  includeComments?: boolean;
  includeReports?: boolean;
}

export interface VideoAnalyticsRequest {
  videoId?: string;
  dateFrom: string;
  dateTo: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  metrics?: string[];
  dimensions?: string[];
}

export interface VideoComparisonRequest {
  videoIds: string[];
  metrics: string[];
  timeRange?: {
    from: string;
    to: string;
  };
}

export interface VideoRecommendationRequest {
  videoId: string;
  algorithm?: 'collaborative' | 'content-based' | 'hybrid';
  limit?: number;
  excludeWatched?: boolean;
  includeAnalytics?: boolean;
}