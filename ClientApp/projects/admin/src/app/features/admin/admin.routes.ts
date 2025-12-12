import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      // Default redirect
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      
      // Dashboard
      { 
        path: 'dashboard', 
        loadComponent: () => import('../dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard - Community Car',
        data: {
          breadcrumb: 'Dashboard',
          description: 'Administrative dashboard with system overview and key metrics',
          roles: ['admin', 'super-admin', 'content-admin', 'user-admin']
        }
      },
      
      // User Management
      { 
        path: 'users', 
        loadComponent: () => import('./users/user-management.component').then(m => m.UserManagementComponent),
        canActivate: [roleGuard],
        title: 'User Management - Community Car Admin',
        data: {
          breadcrumb: 'Users',
          description: 'Manage users, roles, and permissions',
          roles: ['admin', 'super-admin', 'user-admin'],
          requiredPermissions: ['users.read', 'users.manage']
        }
      },
      
      // Role Management
      { 
        path: 'roles', 
        loadComponent: () => import('./role-management/role-management.component').then(m => m.RoleManagementComponent),
        canActivate: [roleGuard],
        title: 'Role Management - Community Car Admin',
        data: {
          breadcrumb: 'Roles',
          description: 'Manage user roles and permissions',
          roles: ['super-admin'],
          requiredPermissions: ['roles.manage']
        }
      },
      
      // Content Management
      { 
        path: 'content', 
        loadChildren: () => import('../admin-content/content.routes').then(m => m.contentRoutes),
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'Content',
          roles: ['admin', 'super-admin', 'content-admin'],
          requiredPermissions: ['content.read']
        }
      },
      

      
      // Reports & Analytics
      { 
        path: 'reports', 
        loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [roleGuard],
        title: 'Reports & Analytics - Community Car Admin',
        data: {
          breadcrumb: 'Reports',
          description: 'System reports, analytics, and performance metrics',
          roles: ['admin', 'super-admin', 'content-admin'],
          requiredPermissions: ['reports.read']
        }
      },
      
      // Moderation
      { 
        path: 'moderation', 
        loadComponent: () => import('./moderation/moderation.component').then(m => m.ModerationComponent),
        canActivate: [roleGuard],
        title: 'Content Moderation - Community Car Admin',
        data: {
          breadcrumb: 'Moderation',
          description: 'Content moderation queue and tools',
          roles: ['admin', 'super-admin', 'content-admin', 'moderator'],
          requiredPermissions: ['moderation.read', 'content.moderate']
        }
      },
      
      // System Settings
      { 
        path: 'settings', 
        loadComponent: () => import('./settings/admin-settings.component').then(m => m.AdminSettingsComponent),
        canActivate: [roleGuard],
        title: 'System Settings - Community Car Admin',
        data: {
          breadcrumb: 'Settings',
          description: 'System configuration and administrative settings',
          roles: ['super-admin'],
          requiredPermissions: ['settings.manage']
        }
      },
      
      // System Health Monitor - TODO: Create component
      // { 
      //   path: 'system-health', 
      //   loadComponent: () => import('../admin-dev/system-health/system-health.component').then(m => m.SystemHealthComponent),
      //   canActivate: [roleGuard],
      //   title: 'System Health - Community Car Admin',
      //   data: {
      //     breadcrumb: 'System Health',
      //     description: 'Real-time system monitoring and health status',
      //     roles: ['super-admin'],
      //     requiredPermissions: ['system.monitor']
      //   }
      // },

      // Activity Log
      { 
        path: 'activity-log', 
        loadComponent: () => import('./activity-log/activity-log.component').then(m => m.ActivityLogComponent),
        canActivate: [roleGuard],
        title: 'Activity Log - Community Car Admin',
        data: {
          breadcrumb: 'Activity Log',
          description: 'Track all administrative actions and system events',
          roles: ['super-admin', 'admin'],
          requiredPermissions: ['activity.read']
        }
      },

      // Admin Profile
      { 
        path: 'profile', 
        loadComponent: () => import('../../shared/common/profile/admin-profile.component').then(m => m.AdminProfileComponent),
        title: 'Admin Profile - Community Car Admin',
        data: {
          breadcrumb: 'Profile',
          description: 'Manage your admin profile and preferences'
        }
      },

      // Notifications Management - TODO: Create component
      // { 
      //   path: 'notifications', 
      //   loadComponent: () => import('./notifications/notifications-management.component').then(m => m.NotificationsManagementComponent),
      //   canActivate: [roleGuard],
      //   title: 'Notifications - Community Car Admin',
      //   data: {
      //     breadcrumb: 'Notifications',
      //     description: 'Manage system notifications and alerts',
      //     roles: ['admin', 'super-admin'],
      //     requiredPermissions: ['notifications.manage']
      //   }
      // },

      // Backup & Maintenance - TODO: Create component
      // { 
      //   path: 'maintenance', 
      //   loadComponent: () => import('../admin-dev/maintenance/maintenance-management.component').then(m => m.MaintenanceManagementComponent),
      //   canActivate: [roleGuard],
      //   title: 'Maintenance - Community Car Admin',
      //   data: {
      //     breadcrumb: 'Maintenance',
      //     description: 'System maintenance, backups, and updates',
      //     roles: ['super-admin'],
      //     requiredPermissions: ['system.maintenance']
      //   }
      // },

      // API Management
      { 
        path: 'api', 
        loadComponent: () => import('../admin-dev/api/api-management.component').then(m => m.ApiManagementComponent),
        canActivate: [roleGuard],
        title: 'API Management - Community Car Admin',
        data: {
          breadcrumb: 'API',
          description: 'API keys, rate limiting, and endpoint management',
          roles: ['super-admin'],
          requiredPermissions: ['api.manage']
        }
      },

      // Security Center
      { 
        path: 'security', 
        loadComponent: () => import('./security/security-center.component').then(m => m.SecurityCenterComponent),
        canActivate: [roleGuard],
        title: 'Security Center - Community Car Admin',
        data: {
          breadcrumb: 'Security',
          description: 'Security monitoring, threat detection, and access control',
          roles: ['super-admin'],
          requiredPermissions: ['security.manage']
        }
      },

      // Localization Management
      { 
        path: 'localization', 
        loadComponent: () => import('../admin-cms/localization/localization-management.component').then(m => m.LocalizationManagementComponent),
        canActivate: [roleGuard],
        title: 'Localization Management - Community Car Admin',
        data: {
          breadcrumb: 'Localization',
          description: 'Manage languages, translations, and multilingual content',
          roles: ['super-admin', 'admin'],
          requiredPermissions: ['localization.manage']
        }
      },

      // Help & Documentation
      { 
        path: 'help', 
        loadComponent: () => import('./help/admin-help.component').then(m => m.AdminHelpComponent),
        title: 'Help & Documentation - Community Car Admin',
        data: {
          breadcrumb: 'Help',
          description: 'Admin documentation and support resources'
        }
      }
    ]
  }
];