import { Routes } from '@angular/router';

// Podcasts management routes
export const podcastsRoutes: Routes = [
  { path: '', redirectTo: 'shows', pathMatch: 'full' },
  { 
    path: 'shows', 
    loadComponent: () => import('./podcasts-shows/podcasts-shows.component').then(m => m.PodcastsShowsComponent) 
  },
  { 
    path: 'episodes', 
    loadComponent: () => import('./podcasts-episodes/podcasts-episodes.component').then(m => m.PodcastsEpisodesComponent) 
  },
  { 
    path: 'analytics', 
    loadComponent: () => import('./podcasts-analytics/podcasts-analytics.component').then(m => m.PodcastsAnalyticsComponent) 
  }
];
