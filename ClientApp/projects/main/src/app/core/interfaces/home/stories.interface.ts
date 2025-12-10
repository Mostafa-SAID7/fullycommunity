/**
 * Story
 * Short-lived content (24 hours)
 */
export interface Story {
  id: string;
  userId: string;
  
  // Content
  mediaUrl: string;
  mediaType: StoryMediaType;
  thumbnailUrl: string | null;
  caption: string | null;
  duration: number;
  
  // Author
  authorName: string;
  authorAvatarUrl: string | null;
  authorVerified: boolean;
  
  // Stats
  viewCount: number;
  likeCount: number;
  replyCount: number;
  
  // User Actions
  isViewed: boolean;
  isLiked: boolean;
  
  // Timestamps
  createdAt: string;
  expiresAt: string;
}

/**
 * Story Media Type
 */
export enum StoryMediaType {
  Image = 0,
  Video = 1,
  Text = 2
}

/**
 * Story Group
 * Stories grouped by user
 */
export interface StoryGroup {
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  userVerified: boolean;
  stories: Story[];
  hasUnviewed: boolean;
  lastStoryAt: string;
}

/**
 * Story View
 */
export interface StoryView {
  id: string;
  storyId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  viewedAt: string;
}

/**
 * Story Reply
 */
export interface StoryReply {
  id: string;
  storyId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  message: string;
  createdAt: string;
}

/**
 * Create Story Request
 */
export interface CreateStoryRequest {
  mediaUrl: string;
  mediaType: StoryMediaType;
  caption: string | null;
  duration: number;
}
