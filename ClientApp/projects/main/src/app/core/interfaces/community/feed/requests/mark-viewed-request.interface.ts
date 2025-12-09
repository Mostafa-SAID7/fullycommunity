import { FeedItemType } from '../enums';

/**
 * Request to mark content as viewed for personalization
 */
export interface MarkViewedRequest {
  itemId: string;
  itemType: FeedItemType;
  viewDuration?: number; // Seconds spent viewing
  scrollDepth?: number; // Percentage scrolled (0-100)
}
