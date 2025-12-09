import { 
  FeedFilterType, 
  ContentPreference, 
  FeedSortBy,
  TimeRange 
} from '../enums/home-enums';

/**
 * Feed Request
 * Request parameters for personalized feed
 */
export interface FeedRequest {
  filterType: FeedFilterType;
  contentTypes: ContentPreference[] | null;
  categories: string[] | null;
  tags: string[] | null;
  sortBy: FeedSortBy;
  timeRange: TimeRange | null;
  latitude: number | null;
  longitude: number | null;
  radiusKm: number | null;
  page: number;
  pageSize: number;
}

/**
 * Update Preferences Request
 */
export interface UpdatePreferencesRequest {
  preferredContentTypes: ContentPreference[] | null;
  preferredCategories: string[] | null;
  interests: string[] | null;
  followedTopics: string[] | null;
  mutedTopics: string[] | null;
  defaultFeedFilter: FeedFilterType | null;
  showRecommendations: boolean | null;
  showTrending: boolean | null;
  allowPersonalization: boolean | null;
}

/**
 * Recommendation Feedback Request
 */
export interface RecommendationFeedbackRequest {
  recommendationId: string;
  wasHelpful: boolean;
  feedbackReason: string | null;
}
