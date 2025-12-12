import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Root redirect
  { 
    path: '', 
    redirectTo: '/admin/dashboard', 
    pathMatch: 'full' 
  },
  
  // Authentication routes
  {
    path: 'auth',
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./shared/ui/forms/login-form/login.component').then(m => m.LoginComponent),
        title: 'Admin Login - Community Car',
        data: { 
          hideNavigation: true,
          description: 'Admin login page for Community Car platform'
        }
      },

      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  
  // Legacy login route (redirect to new structure)
  { 
    path: 'login', 
    redirectTo: '/auth/login', 
    pathMatch: 'full' 
  },
  
  // Admin routes with authentication
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard],
    data: {
      requiresAuth: true,
      roles: ['admin', 'super-admin', 'content-admin', 'user-admin']
    }
  },
  

  
  // Wildcard route - must be last
  { 
    path: '**', 
    redirectTo: '/admin/dashboard' 
  }
];
