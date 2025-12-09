import { VideoType, ContentRating } from '../enums/video-enums';

/**
 * Video Search Request
 */
export interface VideoSearchRequest {
  keywords?: string;
  type?: VideoType;
  categoryId?: string;
  channelId?: string;
  hashtag?: string;
  soundId?: string;
  location?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  minDuration?: string; // TimeSpan
  maxDuration?: string; // TimeSpan
  hasCaptions?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * Video Feed Request
 */
export interface VideoFeedRequest {
  feedType: FeedType;
  categoryId?: string;
  country?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Feed Type
 */
export enum FeedType {
  ForYou = 0,
  Following = 1,
  Trending = 2,
  Latest = 3,
  Category = 4
}

/**
 * Trending Hashtag
 */
export interface TrendingHashtag {
  hashtag: string;
  videoCount: number;
  totalViews: number;
  rank: number;
}

/**
 * Video Upload Response
 */
export interface VideoUploadResponse {
  videoId: string;
  uploadUrl: string;
  thumbnailUploadUrl: string | null;
  expiresAt: string;
}
