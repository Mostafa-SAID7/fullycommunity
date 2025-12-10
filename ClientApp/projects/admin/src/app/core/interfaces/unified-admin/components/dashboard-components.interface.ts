/**
 * Dashboard Components
 * Components used in the unified admin dashboard
 */

import { 
  ActionType,
  PriorityLevel,
  AlertType
} from '../../../common/admin-common.interface';

/**
 * Admin Overview
 */
export interface AdminOverview {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  pendingModeration: number;
  totalRevenue: number;
  systemUptime: number;
  lastUpdated: string;
}

/**
 * Admin Activity
 */
export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: ActionType;
  entityType: string;
  entityId: string;
  description: string;
  timestamp: string;
  ipAddress: string;
}

/**
 * Admin Alert
 */
export interface AdminAlert {
  id: string;
  type: AlertType;
  severity: PriorityLevel;
  title: string;
  message: string;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
  isRead: boolean;
}

/**
 * Quick Stats
 */
export interface QuickStats {
  usersToday: number;
  contentToday: number;
  reportsToday: number;
  revenueToday: number;
  conversionRate: number;
  averageResponseTime: number;
}

/**
 * Pending Action
 */
export interface PendingAction {
  id: string;
  type: ActionType;
  entityType: string;
  entityId: string;
  title: string;
  priority: PriorityLevel;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
}