/**
 * Suggested Episodes
 */
export interface SuggestedEpisodes {
  episodes: SuggestedEpisode[];
  suggestionReason: string;
  totalCount: number;
}

/**
 * Suggested Episode
 */
export interface SuggestedEpisode {
  id: string;
  episodeId: string;
  title: string;
  thumbnailUrl: string | null;
  duration: number;
  showName: string;
  showAvatarUrl: string | null;
  playCount: number;
  relevanceScore: number;
  suggestionReason: string;
  publishedAt: string;
}
