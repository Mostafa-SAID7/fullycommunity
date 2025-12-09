import { FeedContentSource } from './enums/home-enums';

/**
 * Recommendation
 * AI-powered content recommendation
 */
export interface Recommendation {
  id: string;
  userId: string;
  contentId: string;
  contentType: number; // FeedItemType
  source: FeedContentSource;
  
  // Scoring
  relevanceScore: number;
  confidenceScore: number;
  
  // Reasoning
  reason: string;
  reasonDetails: ReasonDetail[];
  
  // Metadata
  generatedAt: string;
  expiresAt: string;
  
  // Feedback
  wasShown: boolean;
  wasClicked: boolean;
  wasHelpful: boolean | null;
}

/**
 * Reason Detail
 */
export interface ReasonDetail {
  factor: string;
  weight: number;
  description: string;
}

/**
 * Similar Content
 */
export interface SimilarContent {
  contentId: string;
  contentType: number;
  title: string;
  thumbnailUrl: string | null;
  authorName: string;
  similarityScore: number;
  matchingTags: string[];
}

/**
 * Trending Content
 */
export interface TrendingContent {
  contentId: string;
  contentType: number;
  source: FeedContentSource;
  title: string;
  thumbnailUrl: string | null;
  authorName: string;
  
  // Trending Metrics
  trendScore: number;
  velocityScore: number;
  engagementRate: number;
  
  // Stats
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // Trend Info
  isRising: boolean;
  trendingRank: number;
  trendingSince: string;
}
