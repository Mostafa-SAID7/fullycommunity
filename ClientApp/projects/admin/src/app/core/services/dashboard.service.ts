import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminDashboardOverview {
  users: UserStatistics;
  content: ContentStatistics;
  community: CommunityStatistics;
  revenue: RevenueStatistics;
  system: SystemHealth;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  pendingApprovals: number;
  usersByRole: { [key: string]: number };
}

export interface ContentStatistics {
  totalPosts: number;
  totalQuestions: number;
  totalReviews: number;
  totalGuides: number;
  totalVideos: number;
  totalPodcasts: number;
  pendingModeration: number;
}

export interface CommunityStatistics {
  totalGroups: number;
  totalEvents: number;
  activeDiscussions: number;
  totalComments: number;
}

export interface RevenueStatistics {
  totalRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
  totalOrders: number;
  pendingOrders: number;
}

export interface SystemHealth {
  status: string;
  databaseSize: number;
  storageUsed: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface QuickStats {
  totalUsers: number;
  totalContent: number;
  activeCommunities: number;
  pendingApprovals: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getOverview(): Observable<AdminDashboardOverview> {
    return this.http.get<AdminDashboardOverview>(`${this.apiUrl}/overview`);
  }

  getQuickStats(): Observable<QuickStats> {
    return this.http.get<QuickStats>(`${this.apiUrl}/quick-stats`);
  }

  getRecentActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent-activity`);
  }
}
