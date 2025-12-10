/**
 * Advanced Content Management
 * Comprehensive content management interface
 */

import {
  BaseAdminEntity,
  ContentStatus
} from '../../common/admin-common.interface';

import {
  ContentModerationInfo,
  ContentMetadata,
  SEOInfo,
  MediaInfo,
  ContentEngagement,
  ContentAnalytics,
  ContentScheduling
} from './components/content-components.interface';

/**
 * Advanced Content Management
 */
export interface AdvancedContentManagement extends BaseAdminEntity {
  title: string;
  contentType: string;
  authorId: string;
  authorName: string;
  
  // Status and Moderation
  status: ContentStatus;
  moderation: ContentModerationInfo;
  
  // Content Details
  content: string;
  excerpt: string | null;
  metadata: ContentMetadata;
  
  // SEO
  seo: SEOInfo;
  
  // Media
  media: MediaInfo[];
  
  // Categorization
  categories: string[];
  tags: string[];
  
  // Engagement
  engagement: ContentEngagement;
  
  // Analytics
  analytics: ContentAnalytics;
  
  // Scheduling
  scheduling: ContentScheduling;
}