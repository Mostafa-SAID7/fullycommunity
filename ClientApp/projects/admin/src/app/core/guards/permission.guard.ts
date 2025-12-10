/**
 * Permission Guard
 * Protects routes and components based on specific permissions
 */

import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AdminRBACService } from '../services/rbac/admin-rbac.service';
import { AdminPermission } from '../interfaces/rbac';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate, CanActivateChild {

  constructor(
    private rbacService: AdminRBACService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkPermission(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkPermission(childRoute);
  }

  private checkPermission(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredPermission = route.data['permission'] as AdminPermission;
    const resource = route.data['resource'] as string;

    if (!requiredPermission) {
      return of(true); // No permission required
    }

    const currentAdmin = this.rbacService.currentAdminValue;
    if (!currentAdmin) {
      this.router.navigate(['/auth/login']);
      return of(false);
    }

    return this.rbacService.hasPermission(requiredPermission, resource).pipe(
      map(hasPermission => {
        if (!hasPermission) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/unauthorized']);
        return of(false);
      })
    );
  }
}