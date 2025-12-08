import { Routes } from '@angular/router';

export const communityRoutes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { 
    path: 'posts', 
    loadComponent: () => import('./posts/posts-management.component').then(m => m.PostsManagementComponent) 
  },
  { 
    path: 'pages', 
    loadComponent: () => import('./pages/pages-management.component').then(m => m.PagesManagementComponent) 
  },
  { 
    path: 'groups', 
    loadComponent: () => import('./groups/groups-management.component').then(m => m.GroupsManagementComponent) 
  },
  { 
    path: 'events', 
    loadComponent: () => import('./events/events-management.component').then(m => m.EventsManagementComponent) 
  }
];
