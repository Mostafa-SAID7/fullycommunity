import { Routes } from '@angular/router';
import { ServicesLayoutComponent } from './services-layout/services-layout.component';

export const servicesRoutes: Routes = [
  {
    path: '',
    component: ServicesLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./services-home/services-home.component').then(m => m.ServicesHomeComponent) },
      { path: 'garages', loadComponent: () => import('./garages/garages.component').then(m => m.GaragesComponent) },
      { path: 'fuel', loadComponent: () => import('./fuel/fuel.component').then(m => m.FuelComponent) },
      { path: 'experts', loadComponent: () => import('./experts/experts.component').then(m => m.ExpertsComponent) },
      { path: 'maintenance', loadComponent: () => import('./maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
      { path: 'saved', loadComponent: () => import('./saved/saved.component').then(m => m.SavedComponent) }
    ]
  }
];
