import { GroupPrivacy, GroupType, GroupRole, MemberStatus } from './group.enums';

/**
 * Group DTO - matches GroupDto.cs from backend
 */
export interface Group {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  ownerId: string;
  ownerName: string;
  coverImageUrl: string | null;
  avatarUrl: string | null;
  privacy: GroupPrivacy;
  type: GroupType;
  requiresApproval: boolean;
  allowMemberPosts: boolean;
  memberCount: number;
  postCount: number;
  city: string | null;
  country: string | null;
  rules: string | null;
  currentUserRole: GroupRole | null;
  currentUserStatus: MemberStatus | null;
  createdAt: string;
}

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
