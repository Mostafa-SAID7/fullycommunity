/**
 * Trending Podcasts
 */
export interface TrendingPodcasts {
  episodes: TrendingEpisode[];
  category: string | null;
  timeRange: string;
  lastUpdated: string;
}

/**
 * Trending Episode
 */
export interface TrendingEpisode {
  id: string;
  episodeId: string;
  title: string;
  thumbnailUrl: string | null;
  duration: number;
  showName: string;
  showAvatarUrl: string | null;
  playCount: number;
  trendScore: number;
  velocityScore: number;
  trendingRank: number;
  publishedAt: string;
}
