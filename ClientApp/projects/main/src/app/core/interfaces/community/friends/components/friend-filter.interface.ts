import { BaseFilter } from '../../../../types';
import { FriendshipStatus } from '../enums';

/**
 * Filter interface for friends list
 */
export interface FriendFilter extends BaseFilter {
  userId?: string;
  status?: FriendshipStatus;
  isOnline?: boolean;
  mutualFriendsOnly?: boolean;
  hasCommonInterests?: boolean;
  location?: string;
  joinedAfter?: string;
  joinedBefore?: string;
}
