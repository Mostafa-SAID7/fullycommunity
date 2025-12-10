/**
 * Profile Social
 * Social connections and relationships
 */
export interface ProfileSocial {
  userId: string;
  followerCount: number;
  followingCount: number;
  friendsCount: number;
  mutualFriendsCount: number;
  isFollowing: boolean;
  isFollower: boolean;
  isFriend: boolean;
  isBlocked: boolean;
}

/**
 * Follower
 */
export interface Follower {
  id: string;
  userId: string;
  followerId: string;
  followerName: string;
  followerUsername: string | null;
  followerAvatarUrl: string | null;
  followerVerified: boolean;
  mutualFriendsCount: number;
  followedAt: string;
}

/**
 * Following
 */
export interface Following {
  id: string;
  userId: string;
  followingId: string;
  followingName: string;
  followingUsername: string | null;
  followingAvatarUrl: string | null;
  followingVerified: boolean;
  mutualFriendsCount: number;
  followedAt: string;
}

/**
 * Friend Request
 */
export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string | null;
  senderAvatarUrl: string | null;
  receiverId: string;
  message: string | null;
  status: FriendRequestStatus;
  sentAt: string;
  respondedAt: string | null;
}

/**
 * Friend Request Status
 */
export enum FriendRequestStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Cancelled = 3
}

/**
 * Social Link
 */
export interface SocialLink {
  id: string;
  userId: string;
  platform: SocialPlatform;
  url: string;
  username: string | null;
  isVerified: boolean;
  displayOrder: number;
}

/**
 * Social Platform
 */
export enum SocialPlatform {
  Facebook = 0,
  Twitter = 1,
  Instagram = 2,
  LinkedIn = 3,
  YouTube = 4,
  TikTok = 5,
  Snapchat = 6,
  Pinterest = 7,
  Reddit = 8,
  Discord = 9,
  Twitch = 10,
  GitHub = 11,
  Website = 12
}
