/**
 * Admin Role Guard
 * Protects routes based on admin roles
 */

import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AdminRBACService } from '../services/rbac/admin-rbac.service';
import { AdminRole } from '../interfaces/rbac';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate, CanActivateChild {

  constructor(
    private rbacService: AdminRBACService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAccess(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAccess(childRoute);
  }

  private checkAccess(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as AdminRole[];
    const requiredPermissions = route.data['permissions'] as string[];

    if (!requiredRoles && !requiredPermissions) {
      return of(true); // No restrictions
    }

    return this.rbacService.getCurrentAdmin().pipe(
      switchMap(admin => {
        if (!admin) {
          this.router.navigate(['/auth/login']);
          return of(false);
        }

        // Check roles
        if (requiredRoles && requiredRoles.length > 0) {
          const hasRole = requiredRoles.includes(admin.role);
          if (!hasRole) {
            this.router.navigate(['/unauthorized']);
            return of(false);
          }
        }

        // Check permissions
        if (requiredPermissions && requiredPermissions.length > 0) {
          const permissionChecks = requiredPermissions.map(permission =>
            this.rbacService.hasPermission(permission as any)
          );

          return new Observable<boolean>(observer => {
            Promise.all(permissionChecks.map(check => check.toPromise()))
              .then(results => {
                const hasAllPermissions = results.every(result => result);
                if (!hasAllPermissions) {
                  this.router.navigate(['/unauthorized']);
                }
                observer.next(hasAllPermissions);
                observer.complete();
              })
              .catch(() => {
                this.router.navigate(['/unauthorized']);
                observer.next(false);
                observer.complete();
              });
          });
        }

        return of(true);
      }),
      catchError(() => {
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }
}