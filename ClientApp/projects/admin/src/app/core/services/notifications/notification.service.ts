import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  NotificationActionResponse,
  NotificationType
} from '../../interfaces/notifications/notification.interface';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/admin/notifications`;
  
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);
  loading = signal(false);

  loadNotifications(page = 1, pageSize = 20, unreadOnly = false) {
    this.loading.set(true);
    return this.http.get<NotificationsResponse>(`${this.apiUrl}`, {
      params: { page: page.toString(), pageSize: pageSize.toString(), unreadOnly: unreadOnly.toString() }
    }).pipe(
      tap(res => {
        this.notifications.set(res.notifications);
        this.unreadCount.set(res.unreadCount);
        this.loading.set(false);
      })
    );
  }

  getUnreadCount() {
    return this.http.get<UnreadCountResponse>(`${this.apiUrl}/unread-count`).pipe(
      tap(res => this.unreadCount.set(res.count))
    );
  }

  markAsRead(id: string) {
    return this.http.post<NotificationActionResponse>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const notifications = this.notifications();
        const updated = notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        this.notifications.set(updated);
        this.unreadCount.update(c => Math.max(0, c - 1));
      })
    );
  }

  markAllAsRead() {
    return this.http.post<NotificationActionResponse>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        const notifications = this.notifications();
        const updated = notifications.map(n => ({ ...n, isRead: true }));
        this.notifications.set(updated);
        this.unreadCount.set(0);
      })
    );
  }

  deleteNotification(id: string) {
    return this.http.delete<NotificationActionResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const notifications = this.notifications();
        const notification = notifications.find(n => n.id === id);
        const updated = notifications.filter(n => n.id !== id);
        this.notifications.set(updated);
        if (notification && !notification.isRead) {
          this.unreadCount.update(c => Math.max(0, c - 1));
        }
      })
    );
  }

  clearAll() {
    return this.http.delete<NotificationActionResponse>(`${this.apiUrl}/clear-all`).pipe(
      tap(() => {
        this.notifications.set([]);
        this.unreadCount.set(0);
      })
    );
  }

  createTestNotification() {
    return this.http.post<NotificationActionResponse>(`${this.apiUrl}/test`, {});
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'NewFollower': '👤',
      'NewLike': '❤️',
      'NewComment': '💬',
      'NewMention': '@',
      'NewMessage': '✉️',
      'SecurityAlert': '🔒',
      'AccountUpdate': '⚙️',
      'SystemAnnouncement': '📢',
      'NewOrder': '🛒',
      'OrderStatusUpdate': '📦',
      'EventReminder': '📅',
      'default': '🔔'
    };
    return icons[type] || icons['default'];
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  }
}
