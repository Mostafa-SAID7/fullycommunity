/**
 * Analytics Requests
 * Request interfaces for analytics operations
 */

import {
  ReportFormat,
  ParameterType,
  ScheduleFrequency
} from '../enums/admin-enums';

/**
 * Analytics Filter Request
 */
export interface AnalyticsFilterRequest {
  dateFrom: string;
  dateTo: string;
  granularity?: AnalyticsGranularity;
  metrics?: string[];
  dimensions?: string[];
  filters?: AnalyticsFilter[];
  limit?: number;
  offset?: number;
}

/**
 * Analytics Granularity
 */
export enum AnalyticsGranularity {
  Hour = 0,
  Day = 1,
  Week = 2,
  Month = 3,
  Quarter = 4,
  Year = 5
}

/**
 * Analytics Filter
 */
export interface AnalyticsFilter {
  dimension: string;
  operator: FilterOperator;
  value: any;
}

/**
 * Filter Operator
 */
export enum FilterOperator {
  Equals = 0,
  NotEquals = 1,
  GreaterThan = 2,
  LessThan = 3,
  GreaterThanOrEqual = 4,
  LessThanOrEqual = 5,
  Contains = 6,
  NotContains = 7,
  In = 8,
  NotIn = 9
}

/**
 * Custom Report Request
 */
export interface CustomReportRequest {
  name: string;
  description?: string;
  query: string;
  parameters?: ReportParameterRequest[];
  schedule?: ReportScheduleRequest;
  recipients?: string[];
  format: ReportFormat;
}

/**
 * Report Parameter Request
 */
export interface ReportParameterRequest {
  name: string;
  type: ParameterType;
  defaultValue?: any;
  required?: boolean;
  options?: any[];
  label?: string;
  description?: string;
}

/**
 * Report Schedule Request
 */
export interface ReportScheduleRequest {
  frequency: ScheduleFrequency;
  time: string;
  timezone: string;
  enabled?: boolean;
}

/**
 * Report Execution Request
 */
export interface ReportExecutionRequest {
  reportId: string;
  parameters?: { [key: string]: any };
  format?: ReportFormat;
  email?: boolean;
  recipients?: string[];
}

/**
 * Dashboard Widget Request
 */
export interface DashboardWidgetRequest {
  type: WidgetType;
  title: string;
  configuration: WidgetConfiguration;
  position?: WidgetPosition;
  size?: WidgetSize;
}

/**
 * Widget Type
 */
export enum WidgetType {
  Chart = 0,
  Table = 1,
  Metric = 2,
  List = 3,
  Map = 4,
  Gauge = 5,
  Progress = 6
}

/**
 * Widget Configuration
 */
export interface WidgetConfiguration {
  dataSource: string;
  query?: string;
  filters?: AnalyticsFilter[];
  chartType?: ChartType;
  metrics?: string[];
  dimensions?: string[];
  refreshInterval?: number;
  customSettings?: { [key: string]: any };
}

/**
 * Chart Type
 */
export enum ChartType {
  Line = 0,
  Bar = 1,
  Pie = 2,
  Doughnut = 3,
  Area = 4,
  Scatter = 5,
  Bubble = 6,
  Radar = 7,
  Heatmap = 8
}

/**
 * Widget Position
 */
export interface WidgetPosition {
  x: number;
  y: number;
}

/**
 * Widget Size
 */
export interface WidgetSize {
  width: number;
  height: number;
}

/**
 * Export Request
 */
export interface ExportRequest {
  type: ExportType;
  filters: AnalyticsFilterRequest;
  format: ReportFormat;
  includeHeaders?: boolean;
  compression?: boolean;
}

/**
 * Export Type
 */
export enum ExportType {
  Users = 0,
  Content = 1,
  Analytics = 2,
  Reports = 3,
  Logs = 4,
  All = 5
}