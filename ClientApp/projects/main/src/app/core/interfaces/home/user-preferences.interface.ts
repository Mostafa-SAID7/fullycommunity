import { ContentPreference, FeedFilterType } from './enums/home-enums';

/**
 * User Preferences
 * User's content preferences and settings
 */
export interface UserPreferences {
  id: string;
  userId: string;
  
  // Content Preferences
  preferredContentTypes: ContentPreference[];
  preferredCategories: string[];
  preferredLanguages: string[];
  
  // Feed Settings
  defaultFeedFilter: FeedFilterType;
  showRecommendations: boolean;
  showTrending: boolean;
  showNearby: boolean;
  
  // Interests
  interests: string[];
  followedTopics: string[];
  mutedTopics: string[];
  
  // Notifications
  notifyOnNewContent: boolean;
  notifyOnTrending: boolean;
  notifyOnRecommendations: boolean;
  
  // Privacy
  showActivityToOthers: boolean;
  allowPersonalization: boolean;
  
  // Updated
  updatedAt: string;
}

/**
 * User Activity
 * Tracks user behavior for personalization
 */
export interface UserActivity {
  userId: string;
  
  // Engagement Metrics
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  
  // Content Consumption
  videosWatched: number;
  podcastsListened: number;
  articlesRead: number;
  productsViewed: number;
  servicesBooked: number;
  
  // Time Spent (minutes)
  timeOnCommunity: number;
  timeOnVideos: number;
  timeOnPodcasts: number;
  timeOnMarketplace: number;
  timeOnServices: number;
  
  // Most Active Times
  mostActiveHour: number;
  mostActiveDayOfWeek: number;
  
  // Last Activity
  lastActiveAt: string;
}

/**
 * Content Interaction
 * User interaction with specific content
 */
export interface ContentInteraction {
  id: string;
  userId: string;
  contentId: string;
  contentType: number; // FeedItemType
  
  // Actions
  viewed: boolean;
  liked: boolean;
  commented: boolean;
  shared: boolean;
  saved: boolean;
  
  // Engagement
  viewDuration: number; // seconds
  completionPercent: number;
  
  // Timestamps
  firstViewedAt: string;
  lastInteractedAt: string;
}
