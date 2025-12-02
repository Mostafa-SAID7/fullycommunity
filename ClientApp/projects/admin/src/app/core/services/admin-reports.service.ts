import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

@Injectable({ providedIn: 'root' })
export class AdminReportsService {
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/reports`;

  constructor(private http: HttpClient) {}

  getAnalyticsOverview(period: 'day' | 'week' | 'month' | 'year' = 'month'): Observable<AnalyticsOverview> {
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

  exportReport(type: 'users' | 'content' | 'engagement', format: 'csv' | 'pdf'): Observable<Blob> {
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
