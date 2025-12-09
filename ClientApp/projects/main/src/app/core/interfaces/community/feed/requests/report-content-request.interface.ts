import { FeedItemType } from '../enums';

/**
 * Request to report inappropriate content in feed
 */
export interface ReportContentRequest {
  itemId: string;
  itemType: FeedItemType;
  reason: 'spam' | 'inappropriate' | 'misleading' | 'harassment' | 'other';
  description?: string;
}
