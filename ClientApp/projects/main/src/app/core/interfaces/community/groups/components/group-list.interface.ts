import { GroupPrivacy, GroupType } from '../enums';

/**
 * Group List DTO - matches GroupListDto.cs from backend
 */
export interface GroupList {
  id: string;
  name: string;
  avatarUrl: string | null;
  privacy: GroupPrivacy;
  type: GroupType;
  memberCount: number;
  city: string | null;
  country: string | null;
  isMember: boolean;
}
