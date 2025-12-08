import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ADMIN_ROLES, AdminPermissions, AdminRoleType } from '../../interfaces/admin/role.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleService {
  private currentAdminRoleSubject = new BehaviorSubject<string | null>(null);
  public currentAdminRole$ = this.currentAdminRoleSubject.asObservable();

  constructor() {
    const storedRole = localStorage.getItem('adminRole');
    if (storedRole) {
      this.currentAdminRoleSubject.next(storedRole);
    }
  }

  setAdminRole(role: string): void {
    this.currentAdminRoleSubject.next(role);
    localStorage.setItem('adminRole', role);
  }

  getCurrentAdminRole(): string | null {
    return this.currentAdminRoleSubject.value;
  }

  hasAdminRole(role: string): boolean {
    return this.getCurrentAdminRole() === role;
  }

  getPermissions(): AdminPermissions {
    const role = this.getCurrentAdminRole();
    
    switch (role) {
      case ADMIN_ROLES.SUPER_ADMIN:
        return {
          canManageUsers: true,
          canModerateContent: true,
          canViewReports: true,
          canManageSettings: true,
          canAccessAllFeatures: true
        };
      
      case ADMIN_ROLES.CONTENT_MODERATOR:
        return {
          canManageUsers: false,
          canModerateContent: true,
          canViewReports: true,
          canManageSettings: false,
          canAccessAllFeatures: false
        };
      
      case ADMIN_ROLES.USER_MANAGER:
        return {
          canManageUsers: true,
          canModerateContent: false,
          canViewReports: true,
          canManageSettings: false,
          canAccessAllFeatures: false
        };
      
      default:
        return {
          canManageUsers: false,
          canModerateContent: false,
          canViewReports: false,
          canManageSettings: false,
          canAccessAllFeatures: false
        };
    }
  }

  canAccess(feature: keyof AdminPermissions): boolean {
    const permissions = this.getPermissions();
    return permissions[feature];
  }

  getAdminRoleDisplayName(role: string): string {
    switch (role) {
      case ADMIN_ROLES.SUPER_ADMIN:
        return 'Super Administrator';
      case ADMIN_ROLES.CONTENT_MODERATOR:
        return 'Content Moderator';
      case ADMIN_ROLES.USER_MANAGER:
        return 'User Manager';
      default:
        return 'Unknown Admin';
    }
  }

  clearAdminRole(): void {
    this.currentAdminRoleSubject.next(null);
    localStorage.removeItem('adminRole');
  }
}