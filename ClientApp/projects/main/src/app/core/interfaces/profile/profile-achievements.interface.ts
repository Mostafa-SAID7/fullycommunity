/**
 * Achievement
 * User achievement/badge
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  requirement: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

/**
 * Achievement Category
 */
export enum AchievementCategory {
  Social = 0,
  Content = 1,
  Engagement = 2,
  Milestone = 3,
  Special = 4,
  Seasonal = 5
}

/**
 * Achievement Rarity
 */
export enum AchievementRarity {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  Epic = 3,
  Legendary = 4
}

/**
 * User Level
 */
export interface UserLevel {
  userId: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  nextLevelXP: number;
  progressPercent: number;
  rank: string;
  rankIconUrl: string | null;
}

/**
 * XP Activity
 */
export interface XPActivity {
  id: string;
  userId: string;
  activityType: string;
  xpEarned: number;
  description: string;
  earnedAt: string;
}

/**
 * Leaderboard Entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  isVerified: boolean;
  score: number;
  level: number;
  badges: number;
}

/**
 * Leaderboard Type
 */
export enum LeaderboardType {
  Overall = 0,
  Weekly = 1,
  Monthly = 2,
  AllTime = 3,
  Category = 4
}
