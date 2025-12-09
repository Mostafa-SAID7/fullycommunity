/**
 * Follower DTO - matches FollowerDto.cs from backend
 */
export interface Follower {
  userId: string;
  userName: string;
  avatarUrl: string | null;
  followedAt: string;
  isFollowingBack: boolean;
}
