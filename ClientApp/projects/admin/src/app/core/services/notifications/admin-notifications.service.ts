import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'in-app';
  subject: string;
  content: string;
  isActive: boolean;
  triggers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  batchSize: number;
  retryAttempts: number;
  cooldownPeriod: number;
}

export interface NotificationStats {
  emailsSentToday: number;
  pushNotificationsToday: number;
  smsSentToday: number;
  deliveryRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/admin/notifications`;

  getNotificationTemplates(): Observable<NotificationTemplate[]> {
    return this.http.get<NotificationTemplate[]>(`${this.apiUrl}/templates`);
  }

  createNotificationTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<NotificationTemplate> {
    return this.http.post<NotificationTemplate>(`${this.apiUrl}/templates`, template);
  }

  updateNotificationTemplate(id: string, template: Partial<NotificationTemplate>): Observable<NotificationTemplate> {
    return this.http.put<NotificationTemplate>(`${this.apiUrl}/templates/${id}`, template);
  }

  deleteNotificationTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/templates/${id}`);
  }

  getNotificationSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(`${this.apiUrl}/settings`);
  }

  updateNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(`${this.apiUrl}/settings`, settings);
  }

  getNotificationStats(): Observable<NotificationStats> {
    return this.http.get<NotificationStats>(`${this.apiUrl}/stats`);
  }

  sendTestNotification(templateId: string, recipient: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/test`, { templateId, recipient });
  }

  // Mock data methods for development
  getMockTemplates(): Observable<NotificationTemplate[]> {
    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        type: 'email',
        subject: 'Welcome to Community Car!',
        content: 'Thank you for joining our community...',
        isActive: true,
        triggers: ['user_registered'],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        name: 'Content Approved',
        type: 'push',
        subject: 'Your content has been approved',
        content: 'Great news! Your content has been approved and is now live.',
        isActive: true,
        triggers: ['content_approved'],
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 7200000)
      }
    ];

    return of(mockTemplates);
  }

  getMockSettings(): Observable<NotificationSettings> {
    const mockSettings: NotificationSettings = {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      batchSize: 100,
      retryAttempts: 3,
      cooldownPeriod: 300
    };

    return of(mockSettings);
  }

  getMockStats(): Observable<NotificationStats> {
    const mockStats: NotificationStats = {
      emailsSentToday: 1247,
      pushNotificationsToday: 892,
      smsSentToday: 156,
      deliveryRate: 98.5
    };

    return of(mockStats);
  }
}