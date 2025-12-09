import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Guest guard - prevents authenticated users from accessing guest-only pages
 * Usage: canActivate: [guestGuard] on login/register routes
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // User is authenticated, redirect to home
  return router.createUrlTree(['/']);
};
