import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export const USER_ROLES = {
  EXPERT: 'expert',
  REVIEWER: 'reviewer',
  CONTENT_CREATOR: 'content_creator',
  USER: 'user'
} as const;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private currentRoleSubject = new BehaviorSubject<string | null>(null);
  public currentRole$ = this.currentRoleSubject.asObservable();

  constructor() {
    // Initialize with stored role or default
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.currentRoleSubject.next(storedRole);
    }
  }

  setUserRole(role: string): void {
    this.currentRoleSubject.next(role);
    localStorage.setItem('userRole', role);
  }

  getCurrentRole(): string | null {
    return this.currentRoleSubject.value;
  }

  hasRole(role: string): boolean {
    return this.getCurrentRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const currentRole = this.getCurrentRole();
    return currentRole ? roles.includes(currentRole) : false;
  }

  canAccessDashboard(dashboardType: string): boolean {
    const currentRole = this.getCurrentRole();
    if (!currentRole) return false;

    switch (dashboardType) {
      case 'expert':
        return this.hasRole(USER_ROLES.EXPERT);
      case 'reviewer':
        return this.hasRole(USER_ROLES.REVIEWER);
      case 'content-creator':
        return this.hasRole(USER_ROLES.CONTENT_CREATOR);
      default:
        return true; // Overview accessible to all authenticated users
    }
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case USER_ROLES.EXPERT:
        return 'Expert';
      case USER_ROLES.REVIEWER:
        return 'Reviewer';
      case USER_ROLES.CONTENT_CREATOR:
        return 'Content Creator';
      case USER_ROLES.USER:
        return 'User';
      default:
        return 'Unknown';
    }
  }

  clearRole(): void {
    this.currentRoleSubject.next(null);
    localStorage.removeItem('userRole');
  }
}