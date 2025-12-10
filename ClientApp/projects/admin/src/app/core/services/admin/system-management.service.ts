import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SystemSettings,
  SystemHealth,
  SystemLog,
  Backup,
  SystemNotification
} from '../../interfaces/admin/system-management.interface';

@Injectable({
  providedIn: 'root'
})
export class SystemManagementService {
  private readonly apiUrl = `${environment.apiUrl}/admin/system`;

  constructor(private http: HttpClient) {}

  /**
   * Get system settings
   */
  getSystemSettings(): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(`${this.apiUrl}/settings`);
  }

  /**
   * Update system settings
   */
  updateSystemSettings(settings: Partial<SystemSettings>): Observable<SystemSettings> {
    return this.http.put<SystemSettings>(`${this.apiUrl}/settings`, settings);
  }

  /**
   * Get system health
   */
  getSystemHealth(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(`${this.apiUrl}/health`);
  }

  /**
   * Get system logs
   */
  getSystemLogs(page: number = 1, pageSize: number = 50, level?: string, category?: string): Observable<{ logs: SystemLog[], total: number }> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (level) params = params.set('level', level);
    if (category) params = params.set('category', category);
    
    return this.http.get<{ logs: SystemLog[], total: number }>(`${this.apiUrl}/logs`, { params });
  }

  /**
   * Clear system logs
   */
  clearSystemLogs(olderThan?: string): Observable<void> {
    let params = new HttpParams();
    if (olderThan) params = params.set('olderThan', olderThan);
    
    return this.http.delete<void>(`${this.apiUrl}/logs`, { params });
  }

  /**
   * Get backups
   */
  getBackups(): Observable<Backup[]> {
    return this.http.get<Backup[]>(`${this.apiUrl}/backups`);
  }

  /**
   * Create backup
   */
  createBackup(name: string, type: string): Observable<Backup> {
    return this.http.post<Backup>(`${this.apiUrl}/backups`, { name, type });
  }

  /**
   * Restore backup
   */
  restoreBackup(backupId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/backups/${backupId}/restore`, {});
  }

  /**
   * Delete backup
   */
  deleteBackup(backupId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/backups/${backupId}`);
  }

  /**
   * Download backup
   */
  downloadBackup(backupId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/backups/${backupId}/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Get system notifications
   */
  getSystemNotifications(): Observable<SystemNotification[]> {
    return this.http.get<SystemNotification[]>(`${this.apiUrl}/notifications`);
  }

  /**
   * Create system notification
   */
  createSystemNotification(notification: Partial<SystemNotification>): Observable<SystemNotification> {
    return this.http.post<SystemNotification>(`${this.apiUrl}/notifications`, notification);
  }

  /**
   * Update system notification
   */
  updateSystemNotification(notificationId: string, notification: Partial<SystemNotification>): Observable<SystemNotification> {
    return this.http.put<SystemNotification>(`${this.apiUrl}/notifications/${notificationId}`, notification);
  }

  /**
   * Delete system notification
   */
  deleteSystemNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notifications/${notificationId}`);
  }

  /**
   * Enable maintenance mode
   */
  enableMaintenanceMode(message?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/maintenance/enable`, { message });
  }

  /**
   * Disable maintenance mode
   */
  disableMaintenanceMode(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/maintenance/disable`, {});
  }

  /**
   * Restart system
   */
  restartSystem(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/restart`, {});
  }

  /**
   * Clear cache
   */
  clearCache(cacheType?: string): Observable<void> {
    let params = new HttpParams();
    if (cacheType) params = params.set('type', cacheType);
    
    return this.http.post<void>(`${this.apiUrl}/cache/clear`, {}, { params });
  }

  /**
   * Get cache statistics
   */
  getCacheStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cache/statistics`);
  }

  /**
   * Test email configuration
   */
  testEmailConfiguration(testEmail: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/test-email`, { testEmail });
  }

  /**
   * Test storage configuration
   */
  testStorageConfiguration(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/test-storage`, {});
  }

  /**
   * Get system statistics
   */
  getSystemStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }
}