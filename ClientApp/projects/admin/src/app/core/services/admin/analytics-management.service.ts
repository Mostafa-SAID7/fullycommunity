import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PlatformAnalytics,
  AnalyticsFilter,
  UserMetrics,
  ContentMetrics,
  EngagementMetrics,
  RevenueMetrics,
  PerformanceMetrics
} from '../../interfaces/admin/analytics-management.interface';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsManagementService {
  private readonly apiUrl = `${environment.apiUrl}/admin/analytics`;

  constructor(private http: HttpClient) {}

  /**
   * Get platform analytics
   */
  getPlatformAnalytics(filter: AnalyticsFilter): Observable<PlatformAnalytics> {
    let params = new HttpParams();
    params = params.set('timeRange', filter.timeRange.toString());
    
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.contentType) params = params.set('contentType', filter.contentType);
    if (filter.country) params = params.set('country', filter.country);
    if (filter.ageGroup) params = params.set('ageGroup', filter.ageGroup);
    if (filter.gender) params = params.set('gender', filter.gender);
    
    return this.http.get<PlatformAnalytics>(this.apiUrl, { params });
  }

  /**
   * Get user metrics
   */
  getUserMetrics(filter: AnalyticsFilter): Observable<UserMetrics> {
    let params = new HttpParams();
    params = params.set('timeRange', filter.timeRange.toString());
    
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.country) params = params.set('country', filter.country);
    if (filter.ageGroup) params = params.set('ageGroup', filter.ageGroup);
    if (filter.gender) params = params.set('gender', filter.gender);
    
    return this.http.get<UserMetrics>(`${this.apiUrl}/users`, { params });
  }

  /**
   * Get content metrics
   */
  getContentMetrics(filter: AnalyticsFilter): Observable<ContentMetrics> {
    let params = new HttpParams();
    params = params.set('timeRange', filter.timeRange.toString());
    
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.contentType) params = params.set('contentType', filter.contentType);
    
    return this.http.get<ContentMetrics>(`${this.apiUrl}/content`, { params });
  }

  /**
   * Get engagement metrics
   */
  getEngagementMetrics(filter: AnalyticsFilter): Observable<EngagementMetrics> {
    let params = new HttpParams();
    params = params.set('timeRange', filter.timeRange.toString());
    
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.contentType) params = params.set('contentType', filter.contentType);
    
    return this.http.get<EngagementMetrics>(`${this.apiUrl}/engagement`, { params });
  }

  /**
   * Get revenue metrics
   */
  getRevenueMetrics(filter: AnalyticsFilter): Observable<RevenueMetrics> {
    let params = new HttpParams();
    params = params.set('timeRange', filter.timeRange.toString());
    
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    
    return this.http.get<RevenueMetrics>(`${this.apiUrl}/revenue`, { params });
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(filter: AnalyticsFilter): Observable<PerformanceMetrics> {
    let params = new HttpParams();
    params = params.set('timeRange', filter.timeRange.toString());
    
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    
    return this.http.get<PerformanceMetrics>(`${this.apiUrl}/performance`, { params });
  }

  /**
   * Export analytics
   */
  exportAnalytics(filter: AnalyticsFilter, format: string = 'csv'): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('timeRange', filter.timeRange.toString());
    params = params.set('format', format);
    
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.contentType) params = params.set('contentType', filter.contentType);
    if (filter.country) params = params.set('country', filter.country);
    if (filter.ageGroup) params = params.set('ageGroup', filter.ageGroup);
    if (filter.gender) params = params.set('gender', filter.gender);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/real-time`);
  }

  /**
   * Get top content
   */
  getTopContent(timeRange: string, contentType?: string, limit: number = 10): Observable<any[]> {
    let params = new HttpParams();
    params = params.set('timeRange', timeRange);
    params = params.set('limit', limit.toString());
    
    if (contentType) params = params.set('contentType', contentType);
    
    return this.http.get<any[]>(`${this.apiUrl}/top-content`, { params });
  }

  /**
   * Get user growth trends
   */
  getUserGrowthTrends(timeRange: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-growth`, {
      params: { timeRange }
    });
  }

  /**
   * Get engagement trends
   */
  getEngagementTrends(timeRange: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/engagement-trends`, {
      params: { timeRange }
    });
  }

  /**
   * Get revenue trends
   */
  getRevenueTrends(timeRange: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/revenue-trends`, {
      params: { timeRange }
    });
  }
}