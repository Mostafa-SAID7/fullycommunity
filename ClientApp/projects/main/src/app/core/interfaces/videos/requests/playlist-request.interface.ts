import { VideoVisibility } from '../enums/video-enums';

/**
 * Create Playlist Request
 */
export interface CreatePlaylistRequest {
  title: string;
  description?: string;
  visibility?: VideoVisibility;
  thumbnailFile?: File;
}

/**
 * Update Playlist Request
 */
export interface UpdatePlaylistRequest {
  title?: string;
  description?: string;
  visibility?: VideoVisibility;
  thumbnailFile?: File;
}

/**
 * Add Video to Playlist Request
 */
export interface AddToPlaylistRequest {
  videoId: string;
  playlistId: string;
}

/**
 * Remove Video from Playlist Request
 */
export interface RemoveFromPlaylistRequest {
  videoId: string;
  playlistId: string;
}

/**
 * Reorder Playlist Request
 */
export interface ReorderPlaylistRequest {
  playlistId: string;
  videoIds: string[]; // Ordered list of video IDs
}
