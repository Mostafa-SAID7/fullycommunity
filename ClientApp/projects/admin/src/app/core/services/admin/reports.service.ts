import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  UserGrowthData,
  ContentEngagementData,
  TopContent,
  AnalyticsOverview,
  ReportData,
  RealtimeStats,
  PlatformSummary,
  ReportPeriod,
  ReportType,
  ExportFormat
} from '../../interfaces/admin/reports.interface';

@Injectable({ providedIn: 'root' })
export class AdminReportsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/reports`;

  getAnalyticsOverview(period: ReportPeriod = 'month'): Observable<AnalyticsOverview> {
    const params = new HttpParams().set('period', period);
    return this.http.get<AnalyticsOverview>(`${this.apiUrl}/overview`, { params });
  }

  getUserGrowth(startDate: string, endDate: string): Observable<UserGrowthData[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<UserGrowthData[]>(`${this.apiUrl}/user-growth`, { params });
  }

  getContentEngagement(startDate: string, endDate: string): Observable<ContentEngagementData[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<ContentEngagementData[]>(`${this.apiUrl}/content-engagement`, { params });
  }

  getTopContent(limit = 10, type?: string): Observable<TopContent[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (type) params = params.set('type', type);
    return this.http.get<TopContent[]>(`${this.apiUrl}/top-content`, { params });
  }

  exportReport(type: ReportType, format: ExportFormat): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.http.get(`${this.apiUrl}/export/${type}`, { 
      params, 
      responseType: 'blob' 
    });
  }

  getRealtimeStats(): Observable<RealtimeStats> {
    return this.http.get<RealtimeStats>(`${this.apiUrl}/realtime`);
  }

  getSummary(): Observable<PlatformSummary> {
    return this.http.get<PlatformSummary>(`${this.apiUrl}/summary`);
  }
}
