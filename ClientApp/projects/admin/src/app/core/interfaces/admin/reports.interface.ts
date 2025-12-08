export interface UserGrowthData {
  date: string;
  newUsers: number;
  totalUsers: number;
}

export interface ContentEngagementData {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface TopContent {
  id: string;
  title: string;
  type: string;
  views: number;
  engagement: number;
}

export interface AnalyticsOverview {
  userGrowthPercent: number;
  contentEngagementPercent: number;
  activeUsersPercent: number;
  revenueGrowthPercent: number;
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
  serverTime: string;
}

export interface PlatformSummary {
  users: { total: number; newThisMonth: number };
  content: { posts: number; reviews: number; guides: number; questions: number; newThisMonth: number };
  engagement: { totalViews: number; totalLikes: number };
  generatedAt: string;
}

export type ReportPeriod = 'day' | 'week' | 'month' | 'year';
export type ReportType = 'users' | 'content' | 'engagement';
export type ExportFormat = 'csv' | 'pdf';
