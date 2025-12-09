import { VideoType, VideoOrientation } from '../enums/video-enums';

/**
 * Video Feed Item
 * Optimized for feed/scroll views with user interaction states
 */
export interface VideoFeedItem {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: string;
  type: VideoType;
  orientation: VideoOrientation;
  
  // Channel
  channelId: string;
  channelHandle: string;
  channelDisplayName: string;
  channelAvatarUrl: string | null;
  channelIsVerified: boolean;
  
  // Stats
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // User States
  isLikedByUser: boolean;
  isSavedByUser: boolean;
  isFollowingChannel: boolean;
  
  // Sound
  soundId: string | null;
  soundTitle: string | null;
  
  // Tags
  hashtags: string[];
  
  // Timestamp
  publishedAt: string | null;
}
