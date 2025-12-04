import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    data: { animation: 'HomePage' }
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    data: { animation: 'AuthPage' }
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    data: { animation: 'AuthPage' }
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent), 
    canActivate: [authGuard],
    data: { animation: 'ProfilePage' }
  },
  { 
    path: 'profile/:id', 
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    data: { animation: 'ProfilePage' }
  },
  { 
    path: 'community',
    loadChildren: () => import('./features/community/community.routes').then(m => m.communityRoutes),
    data: { animation: 'CommunityPage' }
  },
  { 
    path: 'videos',
    loadChildren: () => import('./features/videos/videos.routes').then(m => m.videoRoutes),
    data: { animation: 'VideosPage' }
  },
  { 
    path: 'marketplace',
    loadChildren: () => import('./features/marketplace/marketplace.routes').then(m => m.marketplaceRoutes),
    data: { animation: 'MarketplacePage' }
  },
  { 
    path: 'podcasts', 
    loadChildren: () => import('./features/podcasts/podcasts.routes').then(m => m.podcastRoutes),
    data: { animation: 'PodcastsPage' }
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services/services.routes').then(m => m.servicesRoutes),
    data: { animation: 'ServicesPage' }
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
    canActivate: [authGuard],
    data: { animation: 'DashboardPage' }
  },
  // Error pages
  { 
    path: 'error', 
    loadComponent: () => import('./features/errors/server-error/server-error.component').then(m => m.ServerErrorComponent),
    data: { animation: 'ErrorPage' }
  },
  { 
    path: 'forbidden', 
    loadComponent: () => import('./features/errors/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
    data: { animation: 'ErrorPage' }
  },
  { 
    path: 'unauthorized', 
    loadComponent: () => import('./features/errors/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    data: { animation: 'ErrorPage' }
  },
  { 
    path: 'not-found', 
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: { animation: 'ErrorPage' }
  },
  { 
    path: '**', 
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: { animation: 'ErrorPage' }
  }
];
