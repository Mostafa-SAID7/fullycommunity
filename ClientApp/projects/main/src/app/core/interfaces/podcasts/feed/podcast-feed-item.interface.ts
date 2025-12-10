/**
 * Podcast Feed Item
 * Feed item specific to podcasts section
 */
export interface PodcastFeedItem {
  id: string;
  episodeId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: number;
  
  // Show
  showId: string;
  showName: string;
  showAvatarUrl: string | null;
  showVerified: boolean;
  
  // Stats
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // User Actions
  isLiked: boolean;
  isSaved: boolean;
  isSubscribed: boolean;
  playProgress: number | null;
  
  // Metadata
  tags: string[];
  category: string | null;
  publishedAt: string;
  
  // Relevance
  relevanceScore: number;
  recommendationReason: string | null;
}
