import { PodcastCategory, ExplicitContent } from '../enums/podcast-enums';

/**
 * Podcast Show List Item
 * Lightweight interface for podcast lists/grids
 */
export interface PodcastShowListItem {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  coverImageUrl: string | null;
  ownerName: string;
  ownerAvatarUrl: string | null;
  category: PodcastCategory;
  episodeCount: number;
  subscriberCount: number;
  averageRating: number;
  explicitContent: ExplicitContent;
  publishedAt: string | null;
}

/**
 * Episode List Item
 * Lightweight interface for episode lists
 */
export interface EpisodeListItem {
  id: string;
  podcastShowId: string;
  podcastTitle: string;
  podcastCoverImageUrl: string | null;
  title: string;
  description: string | null;
  slug: string | null;
  seasonNumber: number | null;
  episodeNumber: number;
  thumbnailUrl: string | null;
  duration: string;
  type: number; // EpisodeType
  explicitContent: ExplicitContent;
  publishedAt: string | null;
  playCount: number;
  likeCount: number;
  commentCount: number;
}
