/**
 * Admin Analytics
 * Platform analytics and insights
 */
export interface PlatformAnalytics {
  timeRange: string;
  
  // User Analytics
  userMetrics: UserMetrics;
  
  // Content Analytics
  contentMetrics: ContentMetrics;
  
  // Engagement Analytics
  engagementMetrics: EngagementMetrics;
  
  // Revenue Analytics
  revenueMetrics: RevenueMetrics;
  
  // Performance Analytics
  performanceMetrics: PerformanceMetrics;
  
  generatedAt: string;
}

/**
 * User Metrics
 */
export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retainedUsers: number;
  churnedUsers: number;
  
  // Growth
  userGrowthRate: number;
  retentionRate: number;
  churnRate: number;
  
  // Activity
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  
  // Demographics
  topCountries: CountryMetric[];
  ageGroups: AgeGroupMetric[];
  genderDistribution: GenderMetric[];
}

/**
 * Content Metrics
 */
export interface ContentMetrics {
  totalContent: number;
  newContent: number;
  publishedContent: number;
  
  // By Type
  contentByType: ContentTypeMetric[];
  
  // Engagement
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  
  // Top Content
  topContent: TopContentItem[];
  
  // Growth
  contentGrowthRate: number;
}

/**
 * Engagement Metrics
 */
export interface EngagementMetrics {
  totalEngagements: number;
  engagementRate: number;
  
  // Actions
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  follows: number;
  
  // Trends
  engagementTrend: TrendData[];
  
  // Peak Times
  peakHours: HourMetric[];
  peakDays: DayMetric[];
}

/**
 * Revenue Metrics
 */
export interface RevenueMetrics {
  totalRevenue: number;
  revenueGrowthRate: number;
  
  // Sources
  subscriptionRevenue: number;
  marketplaceRevenue: number;
  serviceRevenue: number;
  advertisingRevenue: number;
  
  // Trends
  revenueTrend: TrendData[];
  
  // Top Earners
  topEarners: TopEarnerItem[];
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  averageLoadTime: number;
  errorRate: number;
  uptime: number;
  
  // API Performance
  apiResponseTime: number;
  apiErrorRate: number;
  
  // Database Performance
  databaseResponseTime: number;
  databaseConnections: number;
  
  // Server Metrics
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

/**
 * Supporting Interfaces
 */
export interface CountryMetric {
  country: string;
  userCount: number;
  percentage: number;
}

export interface AgeGroupMetric {
  ageGroup: string;
  userCount: number;
  percentage: number;
}

export interface GenderMetric {
  gender: string;
  userCount: number;
  percentage: number;
}

export interface ContentTypeMetric {
  type: string;
  count: number;
  percentage: number;
  engagementRate: number;
}

export interface TopContentItem {
  id: string;
  title: string;
  type: string;
  authorName: string;
  viewCount: number;
  engagementRate: number;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface HourMetric {
  hour: number;
  value: number;
}

export interface DayMetric {
  day: string;
  value: number;
}

export interface TopEarnerItem {
  userId: string;
  userName: string;
  revenue: number;
  source: string;
}

/**
 * Analytics Filter
 */
export interface AnalyticsFilter {
  timeRange: AnalyticsTimeRange;
  dateFrom: string | null;
  dateTo: string | null;
  contentType: string | null;
  country: string | null;
  ageGroup: string | null;
  gender: string | null;
}

/**
 * Analytics Time Range
 */
export enum AnalyticsTimeRange {
  Today = 0,
  Yesterday = 1,
  Last7Days = 2,
  Last30Days = 3,
  Last90Days = 4,
  ThisMonth = 5,
  LastMonth = 6,
  ThisYear = 7,
  LastYear = 8,
  Custom = 9
}