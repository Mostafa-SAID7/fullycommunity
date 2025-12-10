/**
 * Video Details Response Interfaces
 * Detailed video information and analytics response interfaces
 */

import { VideoAdmin, VideoComment, DetailedVideoAnalytics, ModerationHistoryEntry, VideoStats } from '../components/video-components';

export interface VideoDetailsResponse {
  video: VideoAdmin;
  relatedVideos: VideoAdmin[];
  comments: VideoComment[];
  analytics: DetailedVideoAnalytics;
  moderationHistory: ModerationHistoryEntry[];
}

export interface VideoStatsResponse {
  stats: VideoStats;
  trends: {
    uploadsToday: number;
    uploadsWeek: number;
    uploadsMonth: number;
    viewsToday: number;
    viewsWeek: number;
    viewsMonth: number;
    revenueToday: number;
    revenueWeek: number;
    revenueMonth: number;
  };
  topCategories: {
    categoryId: string;
    categoryName: string;
    videoCount: number;
    viewCount: number;
    percentage: number;
  }[];
  topCreators: {
    creatorId: string;
    creatorName: string;
    videoCount: number;
    totalViews: number;
    subscriberCount: number;
  }[];
}

export interface VideoAnalyticsResponse {
  videoId: string;
  analytics: DetailedVideoAnalytics;
  comparisons?: {
    previousPeriod: DetailedVideoAnalytics;
    averageForCategory: DetailedVideoAnalytics;
    topPerformingVideos: DetailedVideoAnalytics[];
  };
}

export interface VideoComparisonResponse {
  videos: {
    videoId: string;
    title: string;
    metrics: {
      [key: string]: number;
    };
  }[];
  comparison: {
    metric: string;
    values: {
      videoId: string;
      value: number;
      rank: number;
      percentile: number;
    }[];
  }[];
  insights: {
    bestPerforming: string;
    worstPerforming: string;
    averages: { [key: string]: number };
    trends: { [key: string]: 'increasing' | 'decreasing' | 'stable' };
  };
}

export interface VideoRecommendationResponse {
  videoId: string;
  recommendations: {
    videoId: string;
    title: string;
    thumbnail: string;
    score: number;
    reason: string;
    analytics?: {
      views: number;
      rating: number;
      engagement: number;
    };
  }[];
  algorithm: string;
  generatedAt: string;
  metadata: {
    totalCandidates: number;
    processingTime: number;
    factors: string[];
  };
}