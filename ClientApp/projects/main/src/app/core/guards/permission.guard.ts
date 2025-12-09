import { inject } from '@angular/core';
import { Router, type CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Permission guard - checks if user has specific permissions
 * Usage in routes: canActivate: [permissionGuard], data: { permissions: ['posts.create', 'posts.edit'] }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const requiredPermissions = route.data['permissions'] as string[];
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  const user = authService.currentUser();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  // Check if user has admin role (admins have all permissions)
  if (user.roles.includes('Admin') || user.roles.includes('SuperAdmin')) {
    return true;
  }

  // TODO: Implement permission checking logic
  // This would require fetching user permissions from backend
  // For now, we'll just check roles
  const hasPermission = requiredPermissions.some(permission => {
    // Simple permission check based on roles
    if (permission.startsWith('admin.') && user.roles.includes('Admin')) return true;
    if (permission.startsWith('moderate.') && user.roles.includes('Moderator')) return true;
    return false;
  });

  if (hasPermission) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
