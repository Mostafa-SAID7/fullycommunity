import { FeedItemType, FeedSectionType } from '../enums';

/**
 * Request to update feed preferences
 */
export interface UpdatePreferencesRequest {
  preferredContentTypes?: FeedItemType[];
  preferredSections?: FeedSectionType[];
  interests?: string[]; // User interests/tags
  excludedTopics?: string[];
  showFollowingFirst?: boolean;
  autoRefresh?: boolean;
  notificationsEnabled?: boolean;
}
