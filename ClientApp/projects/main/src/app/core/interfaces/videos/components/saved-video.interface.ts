/**
 * Saved Video
 */
export interface SavedVideo {
  id: string;
  videoId: string;
  userId: string;
  collectionId: string | null;
  savedAt: string;
  video: SavedVideoInfo;
}

/**
 * Saved Video Info
 */
export interface SavedVideoInfo {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  duration: string;
  channelHandle: string;
  channelDisplayName: string;
  viewCount: number;
}

/**
 * Video Collection
 */
export interface VideoCollection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  videoCount: number;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}
