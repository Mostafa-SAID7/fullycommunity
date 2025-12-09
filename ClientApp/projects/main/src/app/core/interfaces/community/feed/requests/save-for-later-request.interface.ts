import { FeedItemType } from '../enums';

/**
 * Request to save content for later reading
 */
export interface SaveForLaterRequest {
  itemId: string;
  itemType: FeedItemType;
  collectionName?: string; // Optional collection/folder name
  notes?: string; // Optional user notes
}
