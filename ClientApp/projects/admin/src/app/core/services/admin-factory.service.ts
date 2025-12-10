/**
 * Admin Factory Service
 * Central factory for all admin services - eliminates duplicate services
 */

import { Injectable } from '@angular/core';
import { UnifiedAdminService } from './unified-admin/unified-admin.service';
import { UnifiedAdminDashboardService } from './unified-admin/dashboard.service';
import { UnifiedUserManagementService } from './unified-admin/user-management.service';
import { UnifiedContentManagementService } from './unified-admin/content-management.service';
import { UnifiedAnalyticsService } from './unified-admin/analytics.service';
import { UnifiedSystemManagementService } from './unified-admin/system-management.service';

// Legacy service interfaces for backward compatibility
export interface LegacyAdminServices {
  userManagement: UnifiedUserManagementService;
  contentManagement: UnifiedContentManagementService;
  analytics: UnifiedAnalyticsService;
  systemManagement: UnifiedSystemManagementService;
  dashboard: UnifiedAdminDashboardService;
}

@Injectable({
  providedIn: 'root'
})
export class AdminFactoryService {
  
  constructor(
    private unifiedAdmin: UnifiedAdminService,
    private dashboardService: UnifiedAdminDashboardService,
    private userManagementService: UnifiedUserManagementService,
    private contentManagementService: UnifiedContentManagementService,
    private analyticsService: UnifiedAnalyticsService,
    private systemManagementService: UnifiedSystemManagementService
  ) {}

  /**
   * Get the unified admin service (recommended)
   */
  get unified(): UnifiedAdminService {
    return this.unifiedAdmin;
  }

  /**
   * Get legacy services for backward compatibility
   * @deprecated Use unified service instead
   */
  get legacy(): LegacyAdminServices {
    return {
      userManagement: this.userManagementService,
      contentManagement: this.contentManagementService,
      analytics: this.analyticsService,
      systemManagement: this.systemManagementService,
      dashboard: this.dashboardService
    };
  }

  /**
   * Get dashboard service
   */
  get dashboard(): UnifiedAdminDashboardService {
    return this.dashboardService;
  }

  /**
   * Get user management service
   */
  get users(): UnifiedUserManagementService {
    return this.userManagementService;
  }

  /**
   * Get content management service
   */
  get content(): UnifiedContentManagementService {
    return this.contentManagementService;
  }

  /**
   * Get analytics service
   */
  get analytics(): UnifiedAnalyticsService {
    return this.analyticsService;
  }

  /**
   * Get system management service
   */
  get system(): UnifiedSystemManagementService {
    return this.systemManagementService;
  }

  /**
   * Initialize admin services
   */
  async initialize(): Promise<void> {
    try {
      // Initialize any required setup
      await this.unifiedAdmin.initializeAdminSession().toPromise();
    } catch (error) {
      console.error('Failed to initialize admin services:', error);
      throw error;
    }
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<any> {
    return this.unifiedAdmin.getRealTimeSystemStatus();
  }

  /**
   * Perform emergency actions
   */
  async emergency(action: string, parameters?: any): Promise<any> {
    return this.unifiedAdmin.performEmergencyAction(action, parameters);
  }
}