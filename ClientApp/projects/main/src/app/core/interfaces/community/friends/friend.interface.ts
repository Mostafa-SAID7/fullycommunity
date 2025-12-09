/**
 * Friend DTO - matches FriendDto.cs from backend
 */
export interface Friend {
  userId: string;
  userName: string;
  avatarUrl: string | null;
  bio: string | null;
  friendsSince: string;
  isOnline: boolean;
}
