/**
 * Unified Admin Service
 * Main orchestrator service for all unified admin operations
 */

import { Injectable } from '@angular/core';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { UnifiedAdminDashboardService } from './dashboard.service';
import { UnifiedUserManagementService } from './user-management.service';
import { UnifiedContentManagementService } from './content-management.service';
import { UnifiedAnalyticsService } from './analytics.service';
import { UnifiedSystemManagementService } from './system-management.service';
import { EnhancedFeaturesService } from './enhanced-features.service';

import {
  UnifiedAdminDashboard,
  AdvancedUserManagement,
  AdvancedContentManagement,
  AdvancedAnalyticsManagement,
  AdvancedSystemManagement
} from '../../interfaces/unified-admin';

@Injectable({
  providedIn: 'root'
})
export class UnifiedAdminService {
  
  constructor(
    private dashboardService: UnifiedAdminDashboardService,
    private userManagementService: UnifiedUserManagementService,
    private contentManagementService: UnifiedContentManagementService,
    private analyticsService: UnifiedAnalyticsService,
    private systemManagementService: UnifiedSystemManagementService,
    private enhancedFeaturesService: EnhancedFeaturesService
  ) {}

  // Dashboard Services
  get dashboard() {
    return this.dashboardService;
  }

  // User Management Services
  get userManagement() {
    return this.userManagementService;
  }

  // Content Management Services
  get contentManagement() {
    return this.contentManagementService;
  }

  // Analytics Services
  get analytics() {
    return this.analyticsService;
  }

  // System Management Services
  get systemManagement() {
    return this.systemManagementService;
  }

  // Enhanced Features Services
  get enhanced() {
    return this.enhancedFeaturesService;
  }

  /**
   * Get complete unified admin data
   */
  getUnifiedAdminData(): Observable<{
    dashboard: UnifiedAdminDashboard;
    analytics: AdvancedAnalyticsManagement;
    systemManagement: AdvancedSystemManagement;
  }> {
    return forkJoin({
      dashboard: this.dashboardService.getDashboard(),
      analytics: this.analyticsService.getAnalyticsManagement(),
      systemManagement: this.systemManagementService.getSystemManagement()
    });
  }

  /**
   * Get admin overview with key metrics
   */
  getAdminOverview(): Observable<any> {
    return combineLatest([
      this.dashboardService.getOverview(),
      this.dashboardService.getQuickStats(),
      this.systemManagementService.getSystemHealth(),
      this.analyticsService.getRealTimeStats()
    ]).pipe(
      map(([overview, quickStats, systemHealth, realTimeStats]) => ({
        overview,
        quickStats,
        systemHealth,
        realTimeStats,
        lastUpdated: new Date().toISOString()
      }))
    );
  }

  /**
   * Get critical alerts across all systems
   */
  getCriticalAlerts(): Observable<any[]> {
    return combineLatest([
      this.dashboardService.getAlerts(true),
      this.systemManagementService.getSystemHealth()
    ]).pipe(
      map(([dashboardAlerts, systemHealth]) => {
        const alerts = [...dashboardAlerts];
        
        // Add system health alerts
        if (systemHealth.alerts) {
          alerts.push(...systemHealth.alerts);
        }
        
        // Filter and sort by severity
        return alerts
          .filter(alert => alert.severity === 'high' || alert.severity === 'critical')
          .sort((a, b) => {
            const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
            return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
          });
      })
    );
  }

  /**
   * Get pending actions across all systems
   */
  getAllPendingActions(): Observable<any[]> {
    return combineLatest([
      this.dashboardService.getPendingActions(),
      this.contentManagementService.getModerationQueue(1, 10),
      this.systemManagementService.getIncidents()
    ]).pipe(
      map(([dashboardActions, moderationQueue, incidents]) => {
        const actions = [...dashboardActions];
        
        // Add moderation queue items as pending actions
        if (moderationQueue.queue) {
          actions.push(...moderationQueue.queue.map(item => ({
            id: item.contentId,
            type: 'content_moderation',
            entityType: 'content',
            entityId: item.contentId,
            title: `Moderate: ${item.title}`,
            priority: item.priority,
            createdAt: item.submittedAt
          })));
        }
        
        // Add open incidents as pending actions
        if (incidents.incidents) {
          actions.push(...incidents.incidents
            .filter(incident => incident.status !== 'resolved')
            .map(incident => ({
              id: incident.id,
              type: 'incident_resolution',
              entityType: 'incident',
              entityId: incident.id,
              title: `Resolve: ${incident.title}`,
              priority: incident.severity,
              createdAt: incident.startedAt
            })));
        }
        
        return actions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
    );
  }

  /**
   * Get system-wide statistics
   */
  getSystemWideStatistics(): Observable<any> {
    return forkJoin({
      users: this.userManagementService.getUserStatistics(),
      content: this.contentManagementService.getContentStatistics(),
      system: this.systemManagementService.getSystemHealth(),
      analytics: this.analyticsService.getRealTimeStats()
    }).pipe(
      map(stats => ({
        ...stats,
        summary: {
          totalUsers: stats.users.overview.totalUsers,
          activeUsers: stats.users.overview.activeUsers,
          totalContent: stats.content.overview.totalContent,
          systemUptime: stats.system.metrics?.uptime || 0,
          errorRate: stats.system.metrics?.errorRate || 0,
          responseTime: stats.analytics.averageResponseTime || 0
        }
      }))
    );
  }

  /**
   * Perform emergency system actions
   */
  performEmergencyAction(action: string, parameters?: any): Observable<any> {
    switch (action) {
      case 'clear_cache':
        return this.systemManagementService.clearCache(parameters?.cacheType);
      
      case 'restart_service':
        return this.systemManagementService.restartService(parameters?.serviceName);
      
      case 'enable_maintenance_mode':
        return this.systemManagementService.runSystemMaintenance();
      
      case 'bulk_moderate_content':
        return this.contentManagementService.performBulkContentAction(parameters);
      
      case 'bulk_user_action':
        return this.userManagementService.performBulkUserAction(parameters);
      
      default:
        throw new Error(`Unknown emergency action: ${action}`);
    }
  }

  /**
   * Export comprehensive admin report
   */
  exportComprehensiveReport(format: 'pdf' | 'excel' = 'pdf'): Observable<Blob> {
    return this.dashboardService.exportDashboardData(format);
  }

  /**
   * Get real-time system status
   */
  getRealTimeSystemStatus(): Observable<any> {
    return this.dashboardService.getDashboardRealTime().pipe(
      map(dashboard => ({
        status: dashboard.systemHealth.overallStatus,
        uptime: dashboard.systemHealth.metrics?.uptime || 0,
        activeUsers: dashboard.quickStats.usersToday,
        systemLoad: dashboard.systemHealth.metrics?.cpuUsage || 0,
        memoryUsage: dashboard.systemHealth.metrics?.memoryUsage || 0,
        alerts: dashboard.alerts.filter(alert => !alert.isRead).length,
        pendingActions: dashboard.pendingActions.length,
        lastUpdated: new Date().toISOString()
      }))
    );
  }

  /**
   * Initialize admin session
   */
  initializeAdminSession(): Observable<any> {
    return this.getUnifiedAdminData().pipe(
      map(data => ({
        ...data,
        sessionId: this.generateSessionId(),
        initializedAt: new Date().toISOString(),
        permissions: this.getAdminPermissions()
      }))
    );
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get admin permissions (placeholder - should be implemented based on auth system)
   */
  private getAdminPermissions(): string[] {
    return [
      'admin.dashboard.view',
      'admin.users.manage',
      'admin.content.moderate',
      'admin.analytics.view',
      'admin.system.manage'
    ];
  }
}