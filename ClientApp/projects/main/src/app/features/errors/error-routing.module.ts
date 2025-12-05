import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '400',
    loadComponent: () => import('./bad-request/bad-request.component').then(m => m.BadRequestComponent),
    title: '400 - Bad Request'
  },
  {
    path: '401',
    loadComponent: () => import('./unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    title: '401 - Unauthorized'
  },
  {
    path: '403',
    loadComponent: () => import('./forbidden/forbidden.component').then(m => m.ForbiddenComponent),
    title: '403 - Forbidden'
  },
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Page Not Found'
  },
  {
    path: '500',
    loadComponent: () => import('./server-error/server-error.component').then(m => m.ServerErrorComponent),
    title: '500 - Server Error'
  },
  {
    path: 'maintenance',
    loadComponent: () => import('./maintenance/maintenance.component').then(m => m.MaintenanceComponent),
    title: 'Under Maintenance'
  },
  {
    path: 'network-error',
    loadComponent: () => import('./network-error/network-error.component').then(m => m.NetworkErrorComponent),
    title: 'Network Error'
  },
  // Redirect common error paths
  {
    path: 'not-found',
    redirectTo: '404'
  },
  {
    path: 'server-error',
    redirectTo: '500'
  },
  {
    path: 'unauthorized',
    redirectTo: '401'
  },
  {
    path: 'forbidden',
    redirectTo: '403'
  },
  {
    path: 'bad-request',
    redirectTo: '400'
  },
  // Default redirect to 404
  {
    path: '',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }