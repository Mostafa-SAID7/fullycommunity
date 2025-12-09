import { FeedItemType } from '../enums';

/**
 * Trending content across all features
 */
export interface TrendingContent {
  id: string;
  type: FeedItemType;
  title: string;
  imageUrl: string | null;
  score: number; // Trending score
  viewCount: number;
  engagementCount: number; // likes + comments + shares
  trendingRank: number;
  url: string;
}
