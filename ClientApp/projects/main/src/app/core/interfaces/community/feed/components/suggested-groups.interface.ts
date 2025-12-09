import { GroupType, GroupPrivacy } from '../../groups/enums';

/**
 * Suggested groups based on user interests
 */
export interface SuggestedGroup {
  id: string;
  name: string;
  avatarUrl: string | null;
  description: string | null;
  type: GroupType;
  privacy: GroupPrivacy;
  memberCount: number;
  postCount: number;
  reason: string; // Why suggested
  mutualFriends: number;
}
