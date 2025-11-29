import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'cars', loadComponent: () => import('./features/cars/car-list/car-list.component').then(m => m.CarListComponent) },
  { path: 'cars/:id', loadComponent: () => import('./features/cars/car-detail/car-detail.component').then(m => m.CarDetailComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'bookings', loadComponent: () => import('./features/bookings/booking-list/booking-list.component').then(m => m.BookingListComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
