import { PodcastCategory, EpisodeType } from '../enums/podcast-enums';

/**
 * Podcast Search/Filter Request
 */
export interface PodcastSearchRequest {
  query: string | null;
  category: PodcastCategory | null;
  language: string | null;
  sortBy: string | null;
  page: number;
  pageSize: number;
}

/**
 * Episode Search/Filter Request
 */
export interface EpisodeSearchRequest {
  query: string | null;
  type: EpisodeType | null;
  seasonNumber: number | null;
  sortBy: string | null;
  page: number;
  pageSize: number;
}
