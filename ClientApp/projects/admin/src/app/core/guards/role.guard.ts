import { inject } from '@angular/core';
import { Router, type CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AdminRoleService } from '../services/admin/role.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const roleService = inject(AdminRoleService);
  const router = inject(Router);

  const requiredPermission = route.data['permission'] as string;

  if (!requiredPermission) {
    return true;
  }

  const permissions = roleService.getPermissions();
  const hasPermission = permissions[requiredPermission as keyof typeof permissions];

  if (hasPermission) {
    return true;
  }

  return router.createUrlTree(['/admin/dashboard']);
};
