/**
 * Analytics Management Components
 * Components used in advanced analytics management
 */

import {
  ParameterType,
  ReportFormat,
  ScheduleFrequency
} from '../enums/admin-enums';

/**
 * Real Time Stats
 */
export interface RealTimeStats {
  activeUsers: number;
  pageViews: number;
  newRegistrations: number;
  newContent: number;
  revenue: number;
  errors: number;
  lastUpdated: string;
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  averageLoadTime: number;
  serverResponseTime: number;
  databaseQueryTime: number;
  cacheHitRate: number;
  errorRate: number;
  uptime: number;
}

/**
 * User Behavior Analytics
 */
export interface UserBehaviorAnalytics {
  sessionDuration: number;
  pageViewsPerSession: number;
  bounceRate: number;
  returnVisitorRate: number;
  conversionFunnel: ConversionStep[];
  heatmapData: HeatmapData[];
}

/**
 * Conversion Step
 */
export interface ConversionStep {
  step: string;
  users: number;
  conversionRate: number;
}

/**
 * Heatmap Data
 */
export interface HeatmapData {
  page: string;
  element: string;
  clicks: number;
  hoverTime: number;
}

/**
 * Content Performance Analytics
 */
export interface ContentPerformanceAnalytics {
  topContent: ContentPerformance[];
  contentByCategory: CategoryPerformance[];
  engagementTrends: EngagementTrend[];
  viralContent: ViralContent[];
}

/**
 * Content Performance
 */
export interface ContentPerformance {
  contentId: string;
  title: string;
  type: string;
  views: number;
  engagement: number;
  revenue: number;
  score: number;
}

/**
 * Category Performance
 */
export interface CategoryPerformance {
  category: string;
  contentCount: number;
  totalViews: number;
  averageEngagement: number;
  growthRate: number;
}

/**
 * Engagement Trend
 */
export interface EngagementTrend {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

/**
 * Viral Content
 */
export interface ViralContent {
  contentId: string;
  title: string;
  viralScore: number;
  shareVelocity: number;
  peakEngagement: number;
  viralDate: string;
}

/**
 * Revenue Analytics
 */
export interface RevenueAnalytics {
  totalRevenue: number;
  recurringRevenue: number;
  oneTimeRevenue: number;
  revenueBySource: RevenueSource[];
  revenueByRegion: RevenueRegion[];
  churnRate: number;
  lifetimeValue: number;
}

/**
 * Revenue Source
 */
export interface RevenueSource {
  source: string;
  revenue: number;
  percentage: number;
  growth: number;
}

/**
 * Revenue Region
 */
export interface RevenueRegion {
  region: string;
  revenue: number;
  users: number;
  averageValue: number;
}

/**
 * System Metrics
 */
export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: number;
  activeConnections: number;
  queueSize: number;
}

/**
 * Custom Report
 */
export interface CustomReport {
  id: string;
  name: string;
  description: string;
  query: string;
  parameters: ReportParameter[];
  schedule: ReportSchedule | null;
  recipients: string[];
  format: ReportFormat;
  createdBy: string;
  createdAt: string;
}

/**
 * Report Parameter
 */
export interface ReportParameter {
  name: string;
  type: ParameterType;
  defaultValue: any;
  required: boolean;
  options?: any[];
}

/**
 * Report Schedule
 */
export interface ReportSchedule {
  frequency: ScheduleFrequency;
  time: string;
  timezone: string;
  enabled: boolean;
}