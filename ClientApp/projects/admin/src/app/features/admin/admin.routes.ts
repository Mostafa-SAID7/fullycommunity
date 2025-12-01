import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./users/user-management.component').then(m => m.UserManagementComponent) },
      { path: 'content', loadComponent: () => import('./content/content-management.component').then(m => m.ContentManagementComponent) },
      { path: 'reports', loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'settings', loadComponent: () => import('./settings/admin-settings.component').then(m => m.AdminSettingsComponent) },
      { path: 'moderation', loadComponent: () => import('./moderation/moderation.component').then(m => m.ModerationComponent) }
    ]
  }
];