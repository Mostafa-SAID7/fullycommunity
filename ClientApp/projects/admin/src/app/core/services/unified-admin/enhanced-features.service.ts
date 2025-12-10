/**
 * Enhanced Features Service
 * Additional advanced features for the unified admin system
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, timer } from 'rxjs';
import { map, switchMap, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { BaseAdminService } from '../base/base-admin.service';

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AdminWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'active' | 'paused' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  order: number;
  estimatedDuration: number;
  actualDuration?: number;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

export interface AdminPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  dashboardLayout: any;
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EnhancedFeaturesService extends BaseAdminService {
  private readonly apiPath = '/unified/enhanced';
  
  // Real-time data streams
  private notificationsSubject = new BehaviorSubject<AdminNotification[]>([]);
  private workflowsSubject = new BehaviorSubject<AdminWorkflow[]>([]);
  private preferencesSubject = new BehaviorSubject<AdminPreferences | null>(null);

  public notifications$ = this.notificationsSubject.asObservable();
  public workflows$ = this.workflowsSubject.asObservable();
  public preferences$ = this.preferencesSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.initializeRealTimeUpdates();
  }

  // Notifications Management
  /**
   * Get admin notifications
   */
  getNotifications(unreadOnly: boolean = false): Observable<AdminNotification[]> {
    const params = this.buildParams({ unreadOnly });
    return this.get<AdminNotification[]>(`${this.apiPath}/notifications`, params);
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/notifications/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead(): Observable<void> {
    return this.post<void>(`${this.apiPath}/notifications/read-all`, {});
  }

  /**
   * Create custom notification
   */
  createNotification(notification: Partial<AdminNotification>): Observable<AdminNotification> {
    return this.post<AdminNotification>(`${this.apiPath}/notifications`, notification);
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/notifications/${notificationId}`);
  }

  // Workflow Management
  /**
   * Get admin workflows
   */
  getWorkflows(): Observable<AdminWorkflow[]> {
    return this.get<AdminWorkflow[]>(`${this.apiPath}/workflows`);
  }

  /**
   * Create workflow
   */
  createWorkflow(workflow: Partial<AdminWorkflow>): Observable<AdminWorkflow> {
    return this.post<AdminWorkflow>(`${this.apiPath}/workflows`, workflow);
  }

  /**
   * Update workflow
   */
  updateWorkflow(workflowId: string, workflow: Partial<AdminWorkflow>): Observable<AdminWorkflow> {
    return this.put<AdminWorkflow>(`${this.apiPath}/workflows/${workflowId}`, workflow);
  }

  /**
   * Start workflow
   */
  startWorkflow(workflowId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/workflows/${workflowId}/start`, {});
  }

  /**
   * Pause workflow
   */
  pauseWorkflow(workflowId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/workflows/${workflowId}/pause`, {});
  }

  /**
   * Resume workflow
   */
  resumeWorkflow(workflowId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/workflows/${workflowId}/resume`, {});
  }

  /**
   * Cancel workflow
   */
  cancelWorkflow(workflowId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/workflows/${workflowId}/cancel`, {});
  }

  /**
   * Get workflow execution logs
   */
  getWorkflowLogs(workflowId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/workflows/${workflowId}/logs`);
  }

  // Audit Logging
  /**
   * Get audit logs
   */
  getAuditLogs(filter: any = {}): Observable<AdminAuditLog[]> {
    const params = this.buildParams(filter);
    return this.get<AdminAuditLog[]>(`${this.apiPath}/audit-logs`, params);
  }

  /**
   * Export audit logs
   */
  exportAuditLogs(filter: any = {}, format: 'csv' | 'excel' | 'pdf' = 'csv'): Observable<Blob> {
    return this.export(`${this.apiPath}/audit-logs/export`, filter, format);
  }

  // Admin Preferences
  /**
   * Get admin preferences
   */
  getPreferences(): Observable<AdminPreferences> {
    return this.get<AdminPreferences>(`${this.apiPath}/preferences`);
  }

  /**
   * Update admin preferences
   */
  updatePreferences(preferences: Partial<AdminPreferences>): Observable<AdminPreferences> {
    return this.put<AdminPreferences>(`${this.apiPath}/preferences`, preferences);
  }

  /**
   * Reset preferences to default
   */
  resetPreferences(): Observable<AdminPreferences> {
    return this.post<AdminPreferences>(`${this.apiPath}/preferences/reset`, {});
  }

  // Advanced Analytics
  /**
   * Get admin performance metrics
   */
  getAdminPerformanceMetrics(): Observable<any> {
    return this.get<any>(`${this.apiPath}/performance-metrics`);
  }

  /**
   * Get admin usage statistics
   */
  getAdminUsageStatistics(timeRange: string = '7d'): Observable<any> {
    const params = this.buildParams({ timeRange });
    return this.get<any>(`${this.apiPath}/usage-statistics`, params);
  }

  /**
   * Get admin efficiency report
   */
  getAdminEfficiencyReport(): Observable<any> {
    return this.get<any>(`${this.apiPath}/efficiency-report`);
  }

  // Automation Features
  /**
   * Get available automation rules
   */
  getAutomationRules(): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/automation/rules`);
  }

  /**
   * Create automation rule
   */
  createAutomationRule(rule: any): Observable<any> {
    return this.post<any>(`${this.apiPath}/automation/rules`, rule);
  }

  /**
   * Update automation rule
   */
  updateAutomationRule(ruleId: string, rule: any): Observable<any> {
    return this.put<any>(`${this.apiPath}/automation/rules/${ruleId}`, rule);
  }

  /**
   * Enable/disable automation rule
   */
  toggleAutomationRule(ruleId: string, enabled: boolean): Observable<void> {
    return this.post<void>(`${this.apiPath}/automation/rules/${ruleId}/toggle`, { enabled });
  }

  /**
   * Test automation rule
   */
  testAutomationRule(ruleId: string): Observable<any> {
    return this.post<any>(`${this.apiPath}/automation/rules/${ruleId}/test`, {});
  }

  // AI-Powered Features
  /**
   * Get AI insights
   */
  getAIInsights(): Observable<any> {
    return this.get<any>(`${this.apiPath}/ai/insights`);
  }

  /**
   * Get AI recommendations
   */
  getAIRecommendations(context: string): Observable<any[]> {
    const params = this.buildParams({ context });
    return this.get<any[]>(`${this.apiPath}/ai/recommendations`, params);
  }

  /**
   * Get anomaly detection results
   */
  getAnomalyDetection(): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/ai/anomalies`);
  }

  /**
   * Get predictive analytics
   */
  getPredictiveAnalytics(metric: string, timeframe: string): Observable<any> {
    const params = this.buildParams({ metric, timeframe });
    return this.get<any>(`${this.apiPath}/ai/predictions`, params);
  }

  // Collaboration Features
  /**
   * Get admin team members
   */
  getTeamMembers(): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/team/members`);
  }

  /**
   * Send message to admin team
   */
  sendTeamMessage(message: any): Observable<void> {
    return this.post<void>(`${this.apiPath}/team/messages`, message);
  }

  /**
   * Create admin task
   */
  createTask(task: any): Observable<any> {
    return this.post<any>(`${this.apiPath}/team/tasks`, task);
  }

  /**
   * Assign task to admin
   */
  assignTask(taskId: string, adminId: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/team/tasks/${taskId}/assign`, { adminId });
  }

  /**
   * Complete task
   */
  completeTask(taskId: string, notes?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/team/tasks/${taskId}/complete`, { notes });
  }

  // Real-time Updates
  /**
   * Initialize real-time updates
   */
  private initializeRealTimeUpdates(): void {
    // Poll for notifications every 30 seconds
    timer(0, 30000).pipe(
      switchMap(() => this.getNotifications()),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(notifications => {
      this.notificationsSubject.next(notifications);
    });

    // Poll for workflows every 60 seconds
    timer(0, 60000).pipe(
      switchMap(() => this.getWorkflows()),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(workflows => {
      this.workflowsSubject.next(workflows);
    });

    // Load preferences once
    this.getPreferences().subscribe(preferences => {
      this.preferencesSubject.next(preferences);
    });
  }

  /**
   * Get unread notifications count
   */
  getUnreadNotificationsCount(): Observable<number> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.read).length)
    );
  }

  /**
   * Get active workflows count
   */
  getActiveWorkflowsCount(): Observable<number> {
    return this.workflows$.pipe(
      map(workflows => workflows.filter(w => w.status === 'active').length)
    );
  }

  /**
   * Get critical alerts
   */
  getCriticalAlerts(): Observable<AdminNotification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.priority === 'critical' && !n.read))
    );
  }
}