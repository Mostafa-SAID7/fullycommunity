/**
 * Suggested Videos
 */
export interface SuggestedVideos {
  videos: SuggestedVideo[];
  suggestionReason: string;
  totalCount: number;
}

/**
 * Suggested Video
 */
export interface SuggestedVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  duration: number;
  channelName: string;
  channelAvatarUrl: string | null;
  viewCount: number;
  relevanceScore: number;
  suggestionReason: string;
  publishedAt: string;
}
