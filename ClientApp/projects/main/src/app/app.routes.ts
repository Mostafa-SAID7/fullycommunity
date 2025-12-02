import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'profile/:id', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { 
    path: 'community',
    loadChildren: () => import('./features/community/community.routes').then(m => m.communityRoutes)
  },
  { 
    path: 'videos',
    loadChildren: () => import('./features/videos/videos.routes').then(m => m.videoRoutes)
  },
  { 
    path: 'marketplace',
    loadChildren: () => import('./features/marketplace/marketplace.routes').then(m => m.marketplaceRoutes)
  },
  { 
    path: 'podcasts', 
    loadChildren: () => import('./features/podcasts/podcasts.routes').then(m => m.podcastRoutes) 
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
