import { Routes } from '@angular/router';

export const videosRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { 
    path: 'list', 
    loadComponent: () => import('./videos-list/videos-list.component').then(m => m.VideosListComponent) 
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
