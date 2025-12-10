/**
 * Profile Statistics
 * Comprehensive profile statistics
 */
export interface ProfileStatistics {
  userId: string;
  
  // Content Stats
  postsCount: number;
  videosCount: number;
  podcastsCount: number;
  productsCount: number;
  servicesCount: number;
  reviewsCount: number;
  guidesCount: number;
  
  // Engagement Stats
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  totalSaves: number;
  
  // Social Stats
  followersCount: number;
  followingCount: number;
  friendsCount: number;
  groupsCount: number;
  pagesCount: number;
  
  // Activity Stats
  totalTimeSpent: number;
  averageSessionDuration: number;
  lastActiveAt: string;
  joinedAt: string;
  daysSinceJoined: number;
  
  // Achievement Stats
  level: number;
  experiencePoints: number;
  achievementsUnlocked: number;
  badgesEarned: number;
  
  // Reputation
  reputationScore: number;
  trustScore: number;
  
  // Rankings
  globalRank: number | null;
  categoryRank: number | null;
  
  updatedAt: string;
}

/**
 * Content Statistics
 */
export interface ContentStatistics {
  contentId: string;
  contentType: string;
  
  // Views
  viewCount: number;
  uniqueViewCount: number;
  averageViewDuration: number;
  
  // Engagement
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  
  // Rates
  engagementRate: number;
  likeRate: number;
  commentRate: number;
  shareRate: number;
  
  // Reach
  reachCount: number;
  impressionCount: number;
  
  // Demographics
  topCountries: CountryStats[];
  topCities: CityStats[];
  ageGroups: AgeGroupStats[];
  genderDistribution: GenderStats[];
  
  // Time
  peakHours: HourStats[];
  peakDays: DayStats[];
  
  createdAt: string;
  lastUpdated: string;
}

/**
 * Country Stats
 */
export interface CountryStats {
  country: string;
  viewCount: number;
  percentage: number;
}

/**
 * City Stats
 */
export interface CityStats {
  city: string;
  country: string;
  viewCount: number;
  percentage: number;
}

/**
 * Age Group Stats
 */
export interface AgeGroupStats {
  ageGroup: string;
  viewCount: number;
  percentage: number;
}

/**
 * Gender Stats
 */
export interface GenderStats {
  gender: string;
  viewCount: number;
  percentage: number;
}

/**
 * Hour Stats
 */
export interface HourStats {
  hour: number;
  viewCount: number;
}

/**
 * Day Stats
 */
export interface DayStats {
  dayOfWeek: number;
  viewCount: number;
}

/**
 * Growth Statistics
 */
export interface GrowthStatistics {
  userId: string;
  timeRange: string;
  
  // Follower Growth
  followersGained: number;
  followersLost: number;
  netFollowerGrowth: number;
  followerGrowthRate: number;
  
  // Content Growth
  contentCreated: number;
  contentGrowthRate: number;
  
  // Engagement Growth
  engagementGained: number;
  engagementGrowthRate: number;
  
  // View Growth
  viewsGained: number;
  viewGrowthRate: number;
  
  // Comparison
  comparedToPrevious: GrowthComparison;
}

/**
 * Growth Comparison
 */
export interface GrowthComparison {
  followersChange: number;
  contentChange: number;
  engagementChange: number;
  viewsChange: number;
}
