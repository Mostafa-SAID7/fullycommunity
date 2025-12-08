/**
 * Admin Role & Permissions Interfaces
 */

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_MODERATOR: 'content_moderator',
  USER_MANAGER: 'user_manager'
} as const;

export type AdminRoleType = typeof ADMIN_ROLES[keyof typeof ADMIN_ROLES];

export interface AdminPermissions {
  canManageUsers: boolean;
  canModerateContent: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  canAccessAllFeatures: boolean;
}

export interface AdminRoleInfo {
  role: AdminRoleType;
  displayName: string;
  permissions: AdminPermissions;
}
