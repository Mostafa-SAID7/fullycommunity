import { PodcastVisibility } from '../enums/podcast-enums';

/**
 * Create Playlist Request
 */
export interface CreatePlaylistRequest {
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  visibility: PodcastVisibility;
}

/**
 * Update Playlist Request
 */
export interface UpdatePlaylistRequest {
  title: string | null;
  description: string | null;
  coverImageUrl: string | null;
  visibility: PodcastVisibility | null;
}
