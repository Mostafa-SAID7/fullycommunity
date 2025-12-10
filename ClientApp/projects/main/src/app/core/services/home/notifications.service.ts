import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Notification,
  NotificationSettings,
  NotificationSummary
} from '../../interfaces/home/notifications.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  /**
   * Get notifications
   */
  getNotifications(page: number = 1, pageSize: number = 20, unreadOnly: boolean = false): Observable<PagedResult<Notification>> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    if (unreadOnly) params = params.set('unreadOnly', 'true');
    
    return this.http.get<PagedResult<Notification>>(this.apiUrl, { params });
  }

  /**
   * Get notification summary
   */
  getSummary(): Observable<NotificationSummary> {
    return this.http.get<NotificationSummary>(`${this.apiUrl}/summary`);
  }

  /**
   * Mark as read
   */
  markAsRead(notificationId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read-all`, {});
  }

  /**
   * Mark as seen
   */
  markAsSeen(notificationId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/seen`, {});
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
  }

  /**
   * Clear all notifications
   */
  clearAll(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear-all`);
  }

  /**
   * Get notification settings
   */
  getSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(`${this.apiUrl}/settings`);
  }

  /**
   * Update notification settings
   */
  updateSettings(settings: Partial<NotificationSettings>): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(`${this.apiUrl}/settings`, settings);
  }
}
