/**
 * Advanced Analytics Management
 * Comprehensive analytics management interface
 */

import {
  RealTimeStats,
  PerformanceMetrics,
  UserBehaviorAnalytics,
  ContentPerformanceAnalytics,
  RevenueAnalytics,
  SystemMetrics,
  CustomReport
} from './components/analytics-components.interface';

/**
 * Advanced Analytics Management
 */
export interface AdvancedAnalyticsManagement {
  realTimeStats: RealTimeStats;
  performanceMetrics: PerformanceMetrics;
  userBehavior: UserBehaviorAnalytics;
  contentPerformance: ContentPerformanceAnalytics;
  revenueAnalytics: RevenueAnalytics;
  systemMetrics: SystemMetrics;
  customReports: CustomReport[];
}