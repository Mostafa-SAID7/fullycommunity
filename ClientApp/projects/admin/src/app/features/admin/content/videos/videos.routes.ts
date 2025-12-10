import { Routes } from '@angular/router';

export const videosRoutes: Routes = [
  { path: '', redirectTo: 'manage', pathMatch: 'full' },
  { 
    path: 'manage', 
    loadComponent: () => import('../../videos/videos-admin.component').then(m => m.VideosAdminComponent) 
  },
  { 
    path: 'pending', 
    loadComponent: () => import('./videos-pending/videos-pending.component').then(m => m.VideosPendingComponent) 
  },
  { 
    path: 'analytics', 
    loadComponent: () => import('./videos-analytics/videos-analytics.component').then(m => m.VideosAnalyticsComponent) 
  }
];
