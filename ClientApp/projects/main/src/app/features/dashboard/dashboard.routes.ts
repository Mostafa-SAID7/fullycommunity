import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent) },
      { path: 'expert', loadComponent: () => import('./expert-dashboard/expert-dashboard.component').then(m => m.ExpertDashboardComponent) },
      { path: 'reviewer', loadComponent: () => import('./reviewer-dashboard/reviewer-dashboard.component').then(m => m.ReviewerDashboardComponent) },
      { path: 'content-creator', loadComponent: () => import('./content-creator-dashboard/content-creator-dashboard.component').then(m => m.ContentCreatorDashboardComponent) }
    ]
  }
];