/**
 * Video Feed Item
 * Feed item specific to videos section
 */
export interface VideoFeedItem {
  id: string;
  videoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: number;
  
  // Channel
  channelId: string;
  channelName: string;
  channelAvatarUrl: string | null;
  channelVerified: boolean;
  
  // Stats
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // User Actions
  isLiked: boolean;
  isSaved: boolean;
  isSubscribed: boolean;
  watchProgress: number | null;
  
  // Metadata
  tags: string[];
  category: string | null;
  publishedAt: string;
  
  // Relevance
  relevanceScore: number;
  recommendationReason: string | null;
}
