/**
 * Unified Admin Dashboard Service
 * Service for dashboard operations and real-time data
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import {
  UnifiedAdminDashboard,
  AdminOverview,
  AdminActivity,
  AdminAlert,
  QuickStats,
  PendingAction,
  SystemHealthResponse,
  DashboardResponse
} from '../../interfaces/unified-admin';

@Injectable({
  providedIn: 'root'
})
export class UnifiedAdminDashboardService {
  private readonly apiUrl = `${environment.apiUrl}/admin/unified/dashboard`;
  private refreshInterval$ = new BehaviorSubject<number>(30000); // 30 seconds default

  constructor(private http: HttpClient) {}

  /**
   * Get unified dashboard data
   */
  getDashboard(): Observable<UnifiedAdminDashboard> {
    return this.http.get<UnifiedAdminDashboard>(`${this.apiUrl}`);
  }

  /**
   * Get dashboard with real-time updates
   */
  getDashboardRealTime(): Observable<UnifiedAdminDashboard> {
    return this.refreshInterval$.pipe(
      switchMap(intervalMs => 
        intervalMs === 0 ? 
          this.getDashboard() : 
          interval(intervalMs).pipe(switchMap(() => this.getDashboard()))
      ),
      shareReplay(1)
    );
  }

  /**
   * Get admin overview
   */
  getOverview(): Observable<AdminOverview> {
    return this.http.get<AdminOverview>(`${this.apiUrl}/overview`);
  }

  /**
   * Get recent admin activities
   */
  getRecentActivities(limit: number = 10): Observable<AdminActivity[]> {
    return this.http.get<AdminActivity[]>(`${this.apiUrl}/activities`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get admin alerts
   */
  getAlerts(unreadOnly: boolean = false): Observable<AdminAlert[]> {
    let params = new HttpParams();
    if (unreadOnly) {
      params = params.set('unreadOnly', 'true');
    }
    return this.http.get<AdminAlert[]>(`${this.apiUrl}/alerts`, { params });
  }

  /**
   * Mark alert as read
   */
  markAlertAsRead(alertId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/alerts/${alertId}/read`, {});
  }

  /**
   * Mark all alerts as read
   */
  markAllAlertsAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/alerts/read-all`, {});
  }

  /**
   * Get quick stats
   */
  getQuickStats(): Observable<QuickStats> {
    return this.http.get<QuickStats>(`${this.apiUrl}/quick-stats`);
  }

  /**
   * Get pending actions
   */
  getPendingActions(assignedToMe: boolean = false): Observable<PendingAction[]> {
    let params = new HttpParams();
    if (assignedToMe) {
      params = params.set('assignedToMe', 'true');
    }
    return this.http.get<PendingAction[]>(`${this.apiUrl}/pending-actions`, { params });
  }

  /**
   * Assign pending action
   */
  assignPendingAction(actionId: string, assigneeId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pending-actions/${actionId}/assign`, {
      assigneeId
    });
  }

  /**
   * Complete pending action
   */
  completePendingAction(actionId: string, notes?: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pending-actions/${actionId}/complete`, {
      notes
    });
  }

  /**
   * Get system health
   */
  getSystemHealth(): Observable<SystemHealthResponse> {
    return this.http.get<SystemHealthResponse>(`${this.apiUrl}/system-health`);
  }

  /**
   * Get comprehensive dashboard data
   */
  getComprehensiveDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/comprehensive`);
  }

  /**
   * Set refresh interval for real-time updates
   */
  setRefreshInterval(intervalMs: number): void {
    this.refreshInterval$.next(intervalMs);
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates(): void {
    this.refreshInterval$.next(0);
  }

  /**
   * Export dashboard data
   */
  exportDashboardData(format: 'pdf' | 'excel' | 'csv' = 'pdf'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  /**
   * Get dashboard widgets configuration
   */
  getWidgetsConfiguration(): Observable<any> {
    return this.http.get(`${this.apiUrl}/widgets-config`);
  }

  /**
   * Update dashboard widgets configuration
   */
  updateWidgetsConfiguration(config: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/widgets-config`, config);
  }

  /**
   * Reset dashboard to default configuration
   */
  resetDashboardConfiguration(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-config`, {});
  }
}