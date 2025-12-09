import { FriendshipStatus } from './friendship.enums';

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
}
