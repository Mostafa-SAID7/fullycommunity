/**
 * Admin Role-Based Access Control Interfaces
 */

export enum AdminRole {
  SuperAdmin = 0,
  Admin = 1,
  ContentAdmin = 2
}

export enum AdminPermission {
  // User Management
  ManageUsers = 'manage_users',
  ViewUsers = 'view_users',
  CreateUsers = 'create_users',
  EditUsers = 'edit_users',
  DeleteUsers = 'delete_users',
  ManageRoles = 'manage_roles',
  
  // Content Management
  ManageAllContent = 'manage_all_content',
  ManageCommunityContent = 'manage_community_content',
  ManageVideoContent = 'manage_video_content',
  ManagePodcastContent = 'manage_podcast_content',
  ModerateContent = 'moderate_content',
  
  // System Management
  ManageSystem = 'manage_system',
  ViewSystemLogs = 'view_system_logs',
  ManageBackups = 'manage_backups',
  ManageIntegrations = 'manage_integrations',
  
  // Analytics
  ViewAnalytics = 'view_analytics',
  ManageReports = 'manage_reports',
  ExportData = 'export_data',
  
  // Marketplace
  ManageMarketplace = 'manage_marketplace',
  ManageProducts = 'manage_products',
  ManageOrders = 'manage_orders',
  
  // Services
  ManageServices = 'manage_services',
  ManageBookings = 'manage_bookings',
  
  // CMS
  ManageCMS = 'manage_cms',
  ManagePages = 'manage_pages',
  ManageMenus = 'manage_menus'
}

export interface AdminRoleDefinition {
  role: AdminRole;
  name: string;
  description: string;
  permissions: AdminPermission[];
  canManageRoles: AdminRole[];
  restrictions?: AdminRestriction[];
}

export interface AdminRestriction {
  type: 'feature' | 'action' | 'data';
  target: string;
  condition?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  customPermissions?: AdminPermission[];
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  createdBy: string;
  managedBy?: string[];
}

export interface RoleAssignmentRequest {
  userId: string;
  role: AdminRole;
  customPermissions?: AdminPermission[];
  reason?: string;
}

export interface PermissionCheckRequest {
  userId: string;
  permission: AdminPermission;
  resource?: string;
}

export interface PermissionCheckResponse {
  hasPermission: boolean;
  reason?: string;
  restrictions?: AdminRestriction[];
}

export interface RoleManagementResponse {
  success: boolean;
  message: string;
  affectedUser?: AdminUser;
}