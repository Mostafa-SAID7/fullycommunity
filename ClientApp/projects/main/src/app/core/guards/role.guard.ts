import { inject } from '@angular/core';
import { Router, type CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Role guard - checks if user has required role(s)
 * Usage in routes: canActivate: [roleGuard], data: { roles: ['Admin', 'Moderator'] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const user = authService.currentUser();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const hasRole = requiredRoles.some(role => user.roles.includes(role));
  
  if (hasRole) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
