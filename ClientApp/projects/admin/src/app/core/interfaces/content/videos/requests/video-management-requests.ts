/**
 * Video Management Request Interfaces
 * Video update, processing and management related request interfaces
 */

import { AgeRating, VideoQuality } from '../enums/video-enums';

export interface VideoUpdateRequest {
  videoId: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  language?: string;
  ageRating?: AgeRating;
  monetizationEnabled?: boolean;
  isFeatured?: boolean;
  customThumbnail?: File;
}

export interface VideoProcessingRequest {
  videoId: string;
  quality?: VideoQuality;
  generateThumbnails?: boolean;
  generateSubtitles?: boolean;
  generateTranscription?: boolean;
  language?: string;
}

export interface VideoScheduleRequest {
  videoId: string;
  publishAt: string;
  unpublishAt?: string;
  notifySubscribers?: boolean;
  socialMediaPost?: boolean;
}

export interface VideoMonetizationRequest {
  videoId: string;
  enabled: boolean;
  monetizationType?: 'ads' | 'sponsorship' | 'donations' | 'subscription' | 'payPerView';
  settings?: {
    adBreaks?: number[];
    sponsorshipDetails?: string;
    donationGoal?: number;
    subscriptionTier?: string;
    price?: number;
  };
}

export interface VideoBatchProcessingRequest {
  videoIds: string[];
  operations: {
    generateThumbnails?: boolean;
    generateSubtitles?: boolean;
    generateTranscription?: boolean;
    runAIModeration?: boolean;
    updateQuality?: VideoQuality;
  };
  priority?: 'low' | 'normal' | 'high';
}