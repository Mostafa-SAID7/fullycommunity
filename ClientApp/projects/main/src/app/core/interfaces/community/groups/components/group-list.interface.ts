import { GroupPrivacy, GroupType } from '../enums';

/**
 * Group List DTO - matches GroupListDto.cs from backend
 */
export interface GroupList {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  privacy: GroupPrivacy;
  type: GroupType;
  memberCount: number;
  postCount: number;
  city: string | null;
  country: string | null;
  isMember: boolean;
}
