import { BaseFilter } from '../../../../types';

export interface SearchFriendsRequest extends BaseFilter {
  userId?: string;
}
