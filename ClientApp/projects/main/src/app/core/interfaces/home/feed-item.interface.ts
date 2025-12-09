import { FeedItemType, FeedContentSource } from './enums/home-enums';

/**
 * Home Feed Item
 * Unified feed item that can represent content from any platform feature
 */
export interface HomeFeedItem {
  id: string;
  type: FeedItemType;
  source: FeedContentSource;
  
  // Content
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  mediaUrl: string | null;
  
  // Author/Creator
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  authorVerified: boolean;
  
  // Engagement
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  
  // User Actions
  isLiked: boolean;
  isSaved: boolean;
  isFollowingAuthor: boolean;
  
  // Metadata
  tags: string[];
  category: string | null;
  
  // Relevance
  relevanceScore: number;
  recommendationReason: string | null;
  
  // Timestamps
  publishedAt: string;
  createdAt: string;
  
  // Source-specific data
  sourceData: any; // Original entity data
}

/**
 * Feed Section
 * Organized section of feed items
 */
export interface FeedSection {
  id: string;
  title: string;
  description: string | null;
  sectionType: string;
  items: HomeFeedItem[];
  hasMore: boolean;
  totalCount: number;
}

/**
 * Personalized Feed
 * Complete personalized home feed
 */
export interface PersonalizedFeed {
  sections: FeedSection[];
  trendingTopics: TrendingTopic[];
  suggestedUsers: SuggestedUser[];
  upcomingEvents: any[];
  totalItems: number;
  lastUpdated: string;
}

/**
 * Trending Topic
 */
export interface TrendingTopic {
  id: string;
  name: string;
  hashtag: string;
  category: string;
  postCount: number;
  trendScore: number;
  isRising: boolean;
}

/**
 * Suggested User
 */
export interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  followerCount: number;
  mutualFriendsCount: number;
  suggestionReason: string;
  isFollowing: boolean;
}
