import { VideoType } from '../enums/video-enums';

/**
 * Video List Item
 * Lightweight interface for video lists/grids
 */
export interface VideoListItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  duration: string;
  type: VideoType;
  channelHandle: string;
  channelDisplayName: string;
  channelAvatarUrl: string | null;
  channelIsVerified: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt: string | null;
}
