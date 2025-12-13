import { FriendshipStatus } from '../enums';

/**
 * Friend Request DTO - matches FriendRequestDto.cs from backend
 */
export interface FriendRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatarUrl: string | null;
  status: FriendshipStatus;
  createdAt: string;
  mutualFriends?: number;
}
