import { FeedItemType, FeedContentSource, TimeRange } from './enums/home-enums';

/**
 * User Analytics
 * Comprehensive user behavior analytics
 */
export interface UserAnalytics {
  userId: string;
  timeRange: TimeRange;
  
  // Engagement Overview
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  
  // Time Spent (minutes)
  totalTimeSpent: number;
  averageSessionDuration: number;
  sessionCount: number;
  
  // Content Breakdown
  contentByType: ContentTypeBreakdown[];
  contentBySource: ContentSourceBreakdown[];
  
  // Activity Patterns
  activityByHour: HourlyActivity[];
  activityByDay: DailyActivity[];
  
  // Top Interests
  topCategories: CategoryStats[];
  topTags: TagStats[];
  
  // Generated
  generatedAt: string;
}

/**
 * Content Type Breakdown
 */
export interface ContentTypeBreakdown {
  type: FeedItemType;
  viewCount: number;
  likeCount: number;
  timeSpent: number;
  percentage: number;
}

/**
 * Content Source Breakdown
 */
export interface ContentSourceBreakdown {
  source: FeedContentSource;
  viewCount: number;
  likeCount: number;
  timeSpent: number;
  percentage: number;
}

/**
 * Hourly Activity
 */
export interface HourlyActivity {
  hour: number;
  activityCount: number;
  timeSpent: number;
}

/**
 * Daily Activity
 */
export interface DailyActivity {
  date: string;
  dayOfWeek: number;
  activityCount: number;
  timeSpent: number;
  sessionCount: number;
}

/**
 * Category Stats
 */
export interface CategoryStats {
  category: string;
  viewCount: number;
  interactionCount: number;
  timeSpent: number;
}

/**
 * Tag Stats
 */
export interface TagStats {
  tag: string;
  viewCount: number;
  interactionCount: number;
}

/**
 * Engagement Metrics
 */
export interface EngagementMetrics {
  userId: string;
  timeRange: TimeRange;
  
  // Rates
  engagementRate: number;
  likeRate: number;
  commentRate: number;
  shareRate: number;
  saveRate: number;
  
  // Trends
  engagementTrend: number;
  viewTrend: number;
  
  // Comparison
  comparedToPrevious: MetricComparison;
}

/**
 * Metric Comparison
 */
export interface MetricComparison {
  viewsChange: number;
  likesChange: number;
  commentsChange: number;
  sharesChange: number;
  timeSpentChange: number;
}

/**
 * Content Performance
 */
export interface ContentPerformance {
  contentId: string;
  contentType: FeedItemType;
  title: string;
  
  // Metrics
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  
  // Engagement
  engagementRate: number;
  averageViewDuration: number;
  completionRate: number;
  
  // Reach
  reachCount: number;
  impressionCount: number;
  
  publishedAt: string;
}
