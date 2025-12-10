/**
 * Role Definitions Configuration
 */

import { AdminRole, AdminPermission, AdminRoleDefinition } from './admin-roles.interface';

export const ADMIN_ROLE_DEFINITIONS: AdminRoleDefinition[] = [
  {
    role: AdminRole.SuperAdmin,
    name: 'Super Administrator',
    description: 'Full access to all system features and can manage all admin roles',
    permissions: [
      // All permissions
      AdminPermission.ManageUsers,
      AdminPermission.ViewUsers,
      AdminPermission.CreateUsers,
      AdminPermission.EditUsers,
      AdminPermission.DeleteUsers,
      AdminPermission.ManageRoles,
      AdminPermission.ManageAllContent,
      AdminPermission.ManageCommunityContent,
      AdminPermission.ManageVideoContent,
      AdminPermission.ManagePodcastContent,
      AdminPermission.ModerateContent,
      AdminPermission.ManageSystem,
      AdminPermission.ViewSystemLogs,
      AdminPermission.ManageBackups,
      AdminPermission.ManageIntegrations,
      AdminPermission.ViewAnalytics,
      AdminPermission.ManageReports,
      AdminPermission.ExportData,
      AdminPermission.ManageMarketplace,
      AdminPermission.ManageProducts,
      AdminPermission.ManageOrders,
      AdminPermission.ManageServices,
      AdminPermission.ManageBookings,
      AdminPermission.ManageCMS,
      AdminPermission.ManagePages,
      AdminPermission.ManageMenus
    ],
    canManageRoles: [AdminRole.SuperAdmin, AdminRole.Admin, AdminRole.ContentAdmin]
  },
  {
    role: AdminRole.Admin,
    name: 'Administrator',
    description: 'Access to services, marketplace, and CMS management',
    permissions: [
      AdminPermission.ViewUsers,
      AdminPermission.ViewAnalytics,
      AdminPermission.ManageMarketplace,
      AdminPermission.ManageProducts,
      AdminPermission.ManageOrders,
      AdminPermission.ManageServices,
      AdminPermission.ManageBookings,
      AdminPermission.ManageCMS,
      AdminPermission.ManagePages,
      AdminPermission.ManageMenus,
      AdminPermission.ExportData
    ],
    canManageRoles: [],
    restrictions: [
      {
        type: 'feature',
        target: 'user_management',
        condition: 'read_only'
      },
      {
        type: 'feature',
        target: 'system_management',
        condition: 'no_access'
      }
    ]
  },
  {
    role: AdminRole.ContentAdmin,
    name: 'Content Administrator',
    description: 'Specialized content management for community, videos, and podcasts',
    permissions: [
      AdminPermission.ViewUsers,
      AdminPermission.ManageCommunityContent,
      AdminPermission.ManageVideoContent,
      AdminPermission.ManagePodcastContent,
      AdminPermission.ModerateContent,
      AdminPermission.ViewAnalytics
    ],
    canManageRoles: [],
    restrictions: [
      {
        type: 'data',
        target: 'analytics',
        condition: 'content_only'
      },
      {
        type: 'feature',
        target: 'user_management',
        condition: 'read_only'
      },
      {
        type: 'feature',
        target: 'system_management',
        condition: 'no_access'
      },
      {
        type: 'feature',
        target: 'marketplace',
        condition: 'no_access'
      },
      {
        type: 'feature',
        target: 'services',
        condition: 'no_access'
      }
    ]
  }
];

export const CONTENT_ADMIN_SUBTYPES = {
  CommunityAdmin: {
    name: 'Community Content Admin',
    permissions: [AdminPermission.ManageCommunityContent, AdminPermission.ModerateContent]
  },
  VideoAdmin: {
    name: 'Video Content Admin',
    permissions: [AdminPermission.ManageVideoContent, AdminPermission.ModerateContent]
  },
  PodcastAdmin: {
    name: 'Podcast Content Admin',
    permissions: [AdminPermission.ManagePodcastContent, AdminPermission.ModerateContent]
  }
};