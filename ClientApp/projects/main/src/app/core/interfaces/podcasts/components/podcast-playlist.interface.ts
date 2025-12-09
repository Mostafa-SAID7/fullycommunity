import { PodcastVisibility } from '../enums/podcast-enums';

/**
 * Podcast Playlist
 */
export interface PodcastPlaylist {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  visibility: PodcastVisibility;
  episodeCount: number;
  totalDuration: string; // TimeSpan
  items: PlaylistItem[] | null;
  createdAt: string;
}

/**
 * Playlist Item
 */
export interface PlaylistItem {
  position: number;
  episodeId: string;
  episodeTitle: string;
  podcastTitle: string;
  thumbnailUrl: string | null;
  duration: string; // TimeSpan
  addedAt: string;
}
