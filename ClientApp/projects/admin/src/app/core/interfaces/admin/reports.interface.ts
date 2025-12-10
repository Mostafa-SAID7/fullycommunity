export interface UserGrowthData {
  date: string;
  newUsers: number;
  totalUsers: number;
  activeUsers: number;
  retentionRate: number;
  churnRate: number;
}

export interface DetailedUserGrowthTrends {
  period: ReportPeriod;
  data: UserGrowthData[];
  demographics: UserDemographics;
  acquisitionChannels: AcquisitionChannel[];
  retentionMetrics: RetentionMetrics;
  growthPrediction: GrowthPrediction;
}

export interface UserDemographics {
  ageGroups: { range: string; count: number; percentage: number }[];
  genderDistribution: { gender: string; count: number; percentage: number }[];
  locationDistribution: { country: string; count: number; percentage: number }[];
  deviceTypes: { device: string; count: number; percentage: number }[];
}

export interface AcquisitionChannel {
  channel: string;
  users: number;
  percentage: number;
  cost: number;
  conversionRate: number;
}

export interface RetentionMetrics {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
  averageSessionDuration: number;
  sessionsPerUser: number;
}

export interface GrowthPrediction {
  nextMonth: number;
  nextQuarter: number;
  confidence: number;
  factors: string[];
}

export interface ContentEngagementData {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clickThroughRate: number;
  bounceRate: number;
  avgTimeSpent: number;
}

export interface DetailedContentEngagement {
  period: ReportPeriod;
  data: ContentEngagementData[];
  contentTypeBreakdown: ContentTypeEngagement[];
  topPerformingContent: TopContent[];
  engagementTrends: EngagementTrend[];
  audienceInsights: AudienceInsight[];
}

export interface ContentTypeEngagement {
  type: string;
  totalViews: number;
  avgEngagementRate: number;
  totalContent: number;
  growthRate: number;
}

export interface EngagementTrend {
  metric: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  description: string;
}

export interface AudienceInsight {
  segment: string;
  size: number;
  engagementRate: number;
  preferredContent: string[];
  peakActivity: string;
}

export interface TopContent {
  id: string;
  title: string;
  type: string;
  views: number;
  engagement: number;
  author: string;
  publishedDate: string;
  category: string;
  tags: string[];
}

export interface AnalyticsOverview {
  userGrowthPercent: number;
  contentEngagementPercent: number;
  activeUsersPercent: number;
  revenueGrowthPercent: number;
  totalRevenue: number;
  avgRevenuePerUser: number;
}

export interface ReportData {
  overview: AnalyticsOverview;
  userGrowth: UserGrowthData[];
  contentEngagement: ContentEngagementData[];
  topContent: TopContent[];
}

export interface RealtimeStats {
  activeUsers: number;
  requestsPerMinute: number;
  todayPosts: number;
  todayReviews: number;
  todayQuestions: number;
  todayGuides: number;
  serverTime: string;
  serverLoad: number;
  memoryUsage: number;
}

export interface PlatformSummary {
  users: { total: number; newThisMonth: number; activeThisMonth: number };
  content: { posts: number; reviews: number; guides: number; questions: number; newThisMonth: number };
  engagement: { totalViews: number; totalLikes: number; totalComments: number; totalShares: number };
  revenue: { total: number; thisMonth: number; avgPerUser: number };
  generatedAt: string;
}

// Localization Management Interfaces
export interface LocalizationData {
  languages: SupportedLanguage[];
  translations: Translation[];
  contentTranslations: ContentTranslation[];
  translationStats: TranslationStats;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  isActive: boolean;
  completionPercentage: number;
  lastUpdated: string;
  flag: string;
}

export interface Translation {
  id: string;
  key: string;
  category: string;
  defaultValue: string;
  translations: { [languageCode: string]: string };
  isPlural: boolean;
  context?: string;
  lastModified: string;
  status: 'complete' | 'partial' | 'missing';
}

export interface ContentTranslation {
  id: string;
  contentId: string;
  contentType: 'post' | 'guide' | 'page' | 'notification';
  title: string;
  originalLanguage: string;
  translations: {
    [languageCode: string]: {
      title: string;
      content: string;
      status: 'draft' | 'review' | 'published';
      translator: string;
      lastModified: string;
    };
  };
}

export interface TranslationStats {
  totalKeys: number;
  translatedKeys: number;
  missingTranslations: number;
  recentlyUpdated: number;
  languageProgress: { [languageCode: string]: number };
}

export type ReportPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';
export type ReportType = 'users' | 'content' | 'engagement' | 'revenue' | 'localization';
export type ExportFormat = 'csv' | 'pdf' | 'xlsx' | 'json';
