/**
 * Unified Admin Dashboard
 * Main dashboard interface for the unified admin system
 */

import { SystemHealthInfo } from '../../common/admin-common.interface';
import {
  AdminOverview,
  AdminActivity,
  AdminAlert,
  QuickStats,
  PendingAction
} from './components/dashboard-components.interface';

/**
 * Unified Admin Dashboard
 */
export interface UnifiedAdminDashboard {
  overview: AdminOverview;
  recentActivity: AdminActivity[];
  systemHealth: SystemHealthInfo;
  alerts: AdminAlert[];
  quickStats: QuickStats;
  pendingActions: PendingAction[];
}