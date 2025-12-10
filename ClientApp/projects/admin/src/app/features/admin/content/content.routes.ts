import { Routes } from '@angular/router';
import { roleGuard } from '../../../core/guards/role.guard';

export const contentRoutes: Routes = [
  // Default redirect
  { 
    path: '', 
    redirectTo: 'overview', 
    pathMatch: 'full' 
  },
  
  // Content Overview Dashboard
  { 
    path: 'overview', 
    loadComponent: () => import('./content-overview/content-overview.component').then(m => m.ContentOverviewComponent),
    title: 'Content Overview - Community Car Admin',
    data: {
      breadcrumb: 'Content Overview',
      description: 'Overview of all content types and moderation status',
      roles: ['admin', 'super-admin', 'content-admin']
    }
  },
  
  // Video Content Management
  { 
    path: 'videos', 
    loadChildren: () => import('./videos/videos.routes').then(m => m.videosRoutes),
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'Videos',
      roles: ['admin', 'super-admin', 'content-admin'],
      requiredPermissions: ['videos.read']
    }
  },
  
  // Podcast Content Management
  { 
    path: 'podcasts', 
    loadChildren: () => import('./podcasts/podcasts.routes').then(m => m.podcastsRoutes),
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'Podcasts',
      roles: ['admin', 'super-admin', 'content-admin'],
      requiredPermissions: ['podcasts.read']
    }
  },
  
  // Community Content Management
  { 
    path: 'community', 
    loadChildren: () => import('./community/community.routes').then(m => m.communityRoutes),
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'Community',
      roles: ['admin', 'super-admin', 'content-admin'],
      requiredPermissions: ['community.read']
    }
  },
  
  // Q&A Management
  { 
    path: 'qa', 
    loadChildren: () => import('./community/qa/qa.routes').then(m => m.qaRoutes),
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'Q&A',
      roles: ['admin', 'super-admin', 'content-admin'],
      requiredPermissions: ['qa.read']
    }
  },
  
  // Content Management (Placeholder for future features)
  { 
    path: 'management', 
    loadComponent: () => import('./content-management.component').then(m => m.ContentManagementComponent),
    canActivate: [roleGuard],
    title: 'Content Management - Community Car Admin',
    data: {
      breadcrumb: 'Management',
      description: 'General content management tools',
      roles: ['admin', 'super-admin', 'content-admin'],
      requiredPermissions: ['content.manage']
    }
  }
];
