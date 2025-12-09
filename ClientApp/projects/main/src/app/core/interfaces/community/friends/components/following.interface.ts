/**
 * Following DTO - matches FollowingDto.cs from backend
 */
export interface Following {
  userId: string;
  userName: string;
  avatarUrl: string | null;
  followedAt: string;
  isFollowedBack: boolean;
}
