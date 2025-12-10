/**
 * Trending Videos
 */
export interface TrendingVideos {
  videos: TrendingVideo[];
  category: string | null;
  timeRange: string;
  lastUpdated: string;
}

/**
 * Trending Video
 */
export interface TrendingVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  duration: number;
  channelName: string;
  channelAvatarUrl: string | null;
  viewCount: number;
  trendScore: number;
  velocityScore: number;
  trendingRank: number;
  publishedAt: string;
}
