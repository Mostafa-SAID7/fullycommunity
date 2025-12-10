/**
 * Analytics Responses
 * Response interfaces for analytics operations
 */

import {
  RealTimeStats,
  PerformanceMetrics,
  UserBehaviorAnalytics,
  ContentPerformanceAnalytics,
  RevenueAnalytics,
  SystemMetrics,
  CustomReport
} from '../components/analytics-components.interface';

/**
 * Analytics Data Response
 */
export interface AnalyticsDataResponse {
  data: AnalyticsDataPoint[];
  metadata: AnalyticsMetadata;
  summary: AnalyticsSummary;
}

/**
 * Analytics Data Point
 */
export interface AnalyticsDataPoint {
  timestamp: string;
  dimensions: { [key: string]: any };
  metrics: { [key: string]: number };
}

/**
 * Analytics Metadata
 */
export interface AnalyticsMetadata {
  totalRows: number;
  samplingRate: number;
  dataFreshness: string;
  query: string;
  executionTime: number;
}

/**
 * Analytics Summary
 */
export interface AnalyticsSummary {
  totals: { [key: string]: number };
  averages: { [key: string]: number };
  changes: { [key: string]: AnalyticsChange };
}

/**
 * Analytics Change
 */
export interface AnalyticsChange {
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Dashboard Response
 */
export interface DashboardResponse {
  realTimeStats: RealTimeStats;
  performanceMetrics: PerformanceMetrics;
  userBehavior: UserBehaviorAnalytics;
  contentPerformance: ContentPerformanceAnalytics;
  revenueAnalytics: RevenueAnalytics;
  systemMetrics: SystemMetrics;
  alerts: DashboardAlert[];
}

/**
 * Dashboard Alert
 */
export interface DashboardAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: string;
  actionRequired: boolean;
}

/**
 * Report List Response
 */
export interface ReportListResponse {
  reports: CustomReport[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Report Execution Response
 */
export interface ReportExecutionResponse {
  executionId: string;
  status: ReportExecutionStatus;
  result?: ReportResult;
  error?: string;
  startedAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

/**
 * Report Execution Status
 */
export enum ReportExecutionStatus {
  Pending = 0,
  Running = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4
}

/**
 * Report Result
 */
export interface ReportResult {
  data: any[];
  columns: ReportColumn[];
  totalRows: number;
  executionTime: number;
  generatedAt: string;
}

/**
 * Report Column
 */
export interface ReportColumn {
  name: string;
  type: string;
  label: string;
  format?: string;
}

/**
 * Widget Data Response
 */
export interface WidgetDataResponse {
  widgetId: string;
  data: any;
  lastUpdated: string;
  nextUpdate?: string;
  error?: string;
}

/**
 * Metrics Response
 */
export interface MetricsResponse {
  metrics: MetricDefinition[];
  categories: MetricCategory[];
}

/**
 * Metric Definition
 */
export interface MetricDefinition {
  name: string;
  label: string;
  description: string;
  type: MetricType;
  unit?: string;
  category: string;
  aggregation: AggregationType[];
}

/**
 * Metric Type
 */
export enum MetricType {
  Counter = 0,
  Gauge = 1,
  Rate = 2,
  Duration = 3,
  Percentage = 4
}

/**
 * Aggregation Type
 */
export enum AggregationType {
  Sum = 0,
  Average = 1,
  Count = 2,
  Min = 3,
  Max = 4,
  Median = 5,
  Percentile = 6
}

/**
 * Metric Category
 */
export interface MetricCategory {
  name: string;
  label: string;
  description: string;
  metrics: string[];
}

/**
 * Dimensions Response
 */
export interface DimensionsResponse {
  dimensions: DimensionDefinition[];
}

/**
 * Dimension Definition
 */
export interface DimensionDefinition {
  name: string;
  label: string;
  description: string;
  type: DimensionType;
  values?: string[];
}

/**
 * Dimension Type
 */
export enum DimensionType {
  String = 0,
  Number = 1,
  Date = 2,
  Boolean = 3,
  Enum = 4
}

/**
 * Export Analytics Response
 */
export interface ExportAnalyticsResponse {
  exportId: string;
  status: ExportStatus;
  downloadUrl?: string;
  totalRecords: number;
  processedRecords: number;
  format: string;
  createdAt: string;
  completedAt?: string;
  expiresAt: string;
}

/**
 * Export Status
 */
export enum ExportStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Expired = 4
}