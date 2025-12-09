import { BaseFilter } from '../../../../types';
import { FeedItemType, FeedSectionType } from '../enums';

/**
 * Filter for feed content
 */
export interface FeedFilter extends BaseFilter {
  sectionType?: FeedSectionType;
  contentTypes?: FeedItemType[];
  interests?: string[]; // User interests/tags
  excludeViewed?: boolean;
  timeRange?: 'today' | 'week' | 'month' | 'all';
}
