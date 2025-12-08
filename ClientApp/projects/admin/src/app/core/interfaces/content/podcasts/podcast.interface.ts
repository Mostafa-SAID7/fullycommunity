export interface Podcast {
  id: string;
  channelId: string;
  channelName: string;
  channelAvatarUrl: string;
  title: string;
  description?: string;
  slug?: string;
  coverImageUrl?: string;
  category: string;
  episodeCount: number;
  subscriberCount: number;
  averageRating: number;
  publishedAt?: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  podcastTitle: string;
  podcastCoverImageUrl?: string;
  title: string;
  description?: string;
  slug?: string;
  seasonNumber?: number;
  episodeNumber: number;
  thumbnailUrl?: string;
  audioUrl: string;
  duration: string;
  type: string;
  publishedAt?: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PodcastCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  podcastCount?: number;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
}

export interface ProgressUpdate {
  currentPosition: string;
  listenDuration: string;
  listenPercent: number;
  isCompleted: boolean;
}

export interface HistoryItem {
  id: string;
  episodeId: string;
  episode: Episode;
  listenedAt: string;
  currentPosition: string;
  listenDuration: string;
  listenPercent: number;
  isCompleted: boolean;
}

export type ReactionType = 'like' | 'love' | 'insightful' | 'funny';

// Admin Interfaces
export interface PodcastShow {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  hostName: string;
  episodeCount: number;
  subscriberCount: number;
  status: string;
  createdAt: string;
}

export interface PodcastShowsResponse {
  items: PodcastShow[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
