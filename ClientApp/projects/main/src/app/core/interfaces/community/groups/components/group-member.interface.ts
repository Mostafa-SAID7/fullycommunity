import { GroupRole, MemberStatus } from '../enums';

/**
 * Group Member DTO - matches GroupMemberDto.cs from backend
 */
export interface GroupMember {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  role: GroupRole;
  status: MemberStatus;
  joinedAt: string;
}
