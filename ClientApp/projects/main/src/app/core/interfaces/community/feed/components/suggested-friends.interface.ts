/**
 * Friend suggestions based on mutual connections and interests
 */
export interface SuggestedFriend {
  userId: string;
  userName: string;
  avatarUrl: string | null;
  bio: string | null;
  mutualFriends: number;
  mutualGroups: number;
  commonInterests: string[];
  reason: string; // Why suggested
}
