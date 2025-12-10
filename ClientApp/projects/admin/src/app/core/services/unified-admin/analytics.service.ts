/**
 * Unified Analytics Service
 * Service for advanced analytics and reporting operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseAdminService } from '../base/base-admin.service';

import {
  AdvancedAnalyticsManagement,
  AnalyticsDataResponse,
  DashboardResponse,
  ReportListResponse,
  ReportExecutionResponse,
  WidgetDataResponse,
  MetricsResponse,
  DimensionsResponse,
  ExportAnalyticsResponse,
  AnalyticsFilterRequest,
  CustomReportRequest,
  ReportExecutionRequest,
  DashboardWidgetRequest,
  ExportRequest
} from '../../interfaces/unified-admin';

@Injectable({
  providedIn: 'root'
})
export class UnifiedAnalyticsService extends BaseAdminService {
  private readonly apiPath = '/unified/analytics';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get analytics data
   */
  getAnalyticsData(filter: AnalyticsFilterRequest): Observable<AnalyticsDataResponse> {
    const params = this.buildAnalyticsParams(filter);
    return this.get<AnalyticsDataResponse>(`${this.apiPath}/data`, params);
  }

  /**
   * Get comprehensive analytics management data
   */
  getAnalyticsManagement(): Observable<AdvancedAnalyticsManagement> {
    return this.get<AdvancedAnalyticsManagement>(`${this.apiPath}/management`);
  }

  /**
   * Get analytics dashboard
   */
  getAnalyticsDashboard(): Observable<DashboardResponse> {
    return this.get<DashboardResponse>(`${this.apiPath}/dashboard`);
  }

  /**
   * Get real-time stats
   */
  getRealTimeStats(): Observable<any> {
    return this.get(`${this.apiPath}/real-time`);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(timeRange?: string): Observable<any> {
    const params = timeRange ? this.buildParams({ timeRange }) : undefined;
    return this.get(`${this.apiPath}/performance`, params);
  }

  /**
   * Get user behavior analytics
   */
  getUserBehaviorAnalytics(filter: AnalyticsFilterRequest): Observable<any> {
    const params = this.buildAnalyticsParams(filter);
    return this.get(`${this.apiPath}/user-behavior`, params);
  }

  /**
   * Get content performance analytics
   */
  getContentPerformanceAnalytics(filter: AnalyticsFilterRequest): Observable<any> {
    const params = this.buildAnalyticsParams(filter);
    return this.get(`${this.apiPath}/content-performance`, params);
  }

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics(filter: AnalyticsFilterRequest): Observable<any> {
    const params = this.buildAnalyticsParams(filter);
    return this.get(`${this.apiPath}/revenue`, params);
  }

  /**
   * Get system metrics
   */
  getSystemMetrics(timeRange?: string): Observable<any> {
    return this.getStatistics(`${this.apiPath}/system-metrics`, timeRange);
  }

  /**
   * Get custom reports
   */
  getCustomReports(page: number = 1, pageSize: number = 20): Observable<ReportListResponse> {
    const params = this.buildParams({ page, pageSize });
    return this.get<ReportListResponse>(`${this.apiPath}/reports`, params);
  }

  /**
   * Create custom report
   */
  createCustomReport(request: CustomReportRequest): Observable<any> {
    return this.post(`${this.apiPath}/reports`, request);
  }

  /**
   * Update custom report
   */
  updateCustomReport(reportId: string, request: CustomReportRequest): Observable<any> {
    return this.put(`${this.apiPath}/reports/${reportId}`, request);
  }

  /**
   * Delete custom report
   */
  deleteCustomReport(reportId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/reports/${reportId}`);
  }

  /**
   * Execute report
   */
  executeReport(request: ReportExecutionRequest): Observable<ReportExecutionResponse> {
    return this.post<ReportExecutionResponse>(`${this.apiPath}/reports/execute`, request);
  }

  /**
   * Get report execution status
   */
  getReportExecutionStatus(executionId: string): Observable<ReportExecutionResponse> {
    return this.get<ReportExecutionResponse>(`${this.apiPath}/reports/executions/${executionId}`);
  }

  /**
   * Cancel report execution
   */
  cancelReportExecution(executionId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/reports/executions/${executionId}/cancel`, {});
  }

  /**
   * Get widget data
   */
  getWidgetData(widgetId: string, parameters?: any): Observable<WidgetDataResponse> {
    const params = parameters ? this.buildParams(parameters) : undefined;
    return this.get<WidgetDataResponse>(`${this.apiPath}/widgets/${widgetId}/data`, params);
  }

  /**
   * Create dashboard widget
   */
  createDashboardWidget(request: DashboardWidgetRequest): Observable<any> {
    return this.post(`${this.apiPath}/widgets`, request);
  }

  /**
   * Update dashboard widget
   */
  updateDashboardWidget(widgetId: string, request: DashboardWidgetRequest): Observable<any> {
    return this.put(`${this.apiPath}/widgets/${widgetId}`, request);
  }

  /**
   * Delete dashboard widget
   */
  deleteDashboardWidget(widgetId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/widgets/${widgetId}`);
  }

  /**
   * Get available metrics
   */
  getAvailableMetrics(): Observable<MetricsResponse> {
    return this.get<MetricsResponse>(`${this.apiPath}/metrics`);
  }

  /**
   * Get available dimensions
   */
  getAvailableDimensions(): Observable<DimensionsResponse> {
    return this.get<DimensionsResponse>(`${this.apiPath}/dimensions`);
  }

  /**
   * Export analytics data
   */
  exportAnalyticsData(request: ExportRequest): Observable<ExportAnalyticsResponse> {
    return this.post<ExportAnalyticsResponse>(`${this.apiPath}/export`, request);
  }

  /**
   * Get export status
   */
  getExportStatus(exportId: string): Observable<ExportAnalyticsResponse> {
    return this.get<ExportAnalyticsResponse>(`${this.apiPath}/exports/${exportId}`);
  }

  /**
   * Download export file
   */
  downloadExportFile(exportId: string): Observable<Blob> {
    return this.downloadFile(`${this.apiPath}/exports/${exportId}/download`);
  }

  /**
   * Get conversion funnel data
   */
  getConversionFunnelData(funnelId?: string): Observable<any> {
    const params = funnelId ? this.buildParams({ funnelId }) : undefined;
    return this.get(`${this.apiPath}/conversion-funnel`, params);
  }

  /**
   * Get cohort analysis data
   */
  getCohortAnalysisData(filter: AnalyticsFilterRequest): Observable<any> {
    const params = this.buildAnalyticsParams(filter);
    return this.get(`${this.apiPath}/cohort-analysis`, params);
  }

  /**
   * Get retention analysis data
   */
  getRetentionAnalysisData(filter: AnalyticsFilterRequest): Observable<any> {
    const params = this.buildAnalyticsParams(filter);
    return this.get(`${this.apiPath}/retention-analysis`, params);
  }

  /**
   * Get A/B test results
   */
  getABTestResults(testId?: string): Observable<any> {
    const params = testId ? this.buildParams({ testId }) : undefined;
    return this.get(`${this.apiPath}/ab-tests`, params);
  }

  /**
   * Get heatmap data
   */
  getHeatmapData(page: string, dateRange?: string): Observable<any> {
    const params = this.buildParams({ page, dateRange });
    return this.get(`${this.apiPath}/heatmap`, params);
  }

  /**
   * Get anomaly detection results
   */
  getAnomalyDetectionResults(metric: string, timeRange?: string): Observable<any> {
    const params = this.buildParams({ metric, timeRange });
    return this.get(`${this.apiPath}/anomaly-detection`, params);
  }

  /**
   * Build analytics parameters
   */
  private buildAnalyticsParams(filter: AnalyticsFilterRequest) {
    const baseParams: any = {
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
      granularity: filter.granularity,
      metrics: filter.metrics?.join(','),
      dimensions: filter.dimensions?.join(','),
      limit: filter.limit,
      offset: filter.offset
    };
    
    // Handle complex filters
    if (filter.filters && filter.filters.length > 0) {
      filter.filters.forEach((f, index) => {
        baseParams[`filter[${index}][dimension]`] = f.dimension;
        baseParams[`filter[${index}][operator]`] = f.operator.toString();
        baseParams[`filter[${index}][value]`] = f.value.toString();
      });
    }
    
    return this.buildParams(baseParams);
  }
}