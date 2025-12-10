import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TimeRange } from '../../interfaces/home/enums/home-enums';
import {
  UserAnalytics,
  EngagementMetrics,
  ContentPerformance
} from '../../interfaces/home/analytics.interface';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  /**
   * Get user analytics
   */
  getUserAnalytics(timeRange: TimeRange = TimeRange.ThisWeek): Observable<UserAnalytics> {
    return this.http.get<UserAnalytics>(`${this.apiUrl}/user`, {
      params: { timeRange: timeRange.toString() }
    });
  }

  /**
   * Get engagement metrics
   */
  getEngagementMetrics(timeRange: TimeRange = TimeRange.ThisWeek): Observable<EngagementMetrics> {
    return this.http.get<EngagementMetrics>(`${this.apiUrl}/engagement`, {
      params: { timeRange: timeRange.toString() }
    });
  }

  /**
   * Get content performance
   */
  getContentPerformance(contentId: string, contentType: number): Observable<ContentPerformance> {
    return this.http.get<ContentPerformance>(`${this.apiUrl}/content/${contentId}`, {
      params: { contentType: contentType.toString() }
    });
  }

  /**
   * Get top performing content
   */
  getTopContent(timeRange: TimeRange = TimeRange.ThisWeek, limit: number = 10): Observable<ContentPerformance[]> {
    return this.http.get<ContentPerformance[]>(`${this.apiUrl}/top-content`, {
      params: {
        timeRange: timeRange.toString(),
        limit: limit.toString()
      }
    });
  }

  /**
   * Export analytics data
   */
  exportAnalytics(timeRange: TimeRange, format: string = 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      params: {
        timeRange: timeRange.toString(),
        format
      },
      responseType: 'blob'
    });
  }
}
