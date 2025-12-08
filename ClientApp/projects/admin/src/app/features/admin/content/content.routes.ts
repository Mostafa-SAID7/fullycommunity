import { Routes } from '@angular/router';

export const contentRoutes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { 
    path: 'overview', 
    loadComponent: () => import('./content-overview/content-overview.component').then(m => m.ContentOverviewComponent) 
  },
  { 
    path: 'qa', 
    loadChildren: () => import('./community/qa/qa.routes').then(m => m.qaRoutes) 
  },
  { 
    path: 'community', 
    loadChildren: () => import('./community/community.routes').then(m => m.communityRoutes) 
  },
  { 
    path: 'videos', 
    loadChildren: () => import('./videos/videos.routes').then(m => m.videosRoutes) 
  },
  { 
    path: 'podcasts', 
    loadChildren: () => import('./podcasts/podcasts.routes').then(m => m.podcastsRoutes) 
  }
];
