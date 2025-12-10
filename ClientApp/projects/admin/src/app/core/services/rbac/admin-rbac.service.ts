/**
 * Admin Role-Based Access Control Service
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BaseAdminService } from '../base/base-admin.service';

import {
  AdminRole,
  AdminPermission,
  AdminUser,
  AdminRoleDefinition,
  RoleAssignmentRequest,
  PermissionCheckRequest,
  PermissionCheckResponse,
  RoleManagementResponse,
  ADMIN_ROLE_DEFINITIONS
} from '../../interfaces/rbac';

@Injectable({
  providedIn: 'root'
})
export class AdminRBACService extends BaseAdminService {
  private readonly apiPath = '/rbac';
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get current admin user
   */
  getCurrentAdmin(): Observable<AdminUser> {
    return this.get<AdminUser>(`${this.apiPath}/current`).pipe(
      tap(admin => this.currentAdminSubject.next(admin))
    );
  }

  /**
   * Get all admin users
   */
  getAdminUsers(page: number = 1, pageSize: number = 20, role?: AdminRole): Observable<any> {
    const params = this.buildParams({ page, pageSize, role });
    return this.get(`${this.apiPath}/users`, params);
  }

  /**
   * Get admin user by ID
   */
  getAdminUser(userId: string): Observable<AdminUser> {
    return this.get<AdminUser>(`${this.apiPath}/users/${userId}`);
  }

  /**
   * Create admin user
   */
  createAdminUser(userData: Partial<AdminUser>): Observable<AdminUser> {
    return this.post<AdminUser>(`${this.apiPath}/users`, userData);
  }

  /**
   * Update admin user
   */
  updateAdminUser(userId: string, userData: Partial<AdminUser>): Observable<AdminUser> {
    return this.put<AdminUser>(`${this.apiPath}/users/${userId}`, userData);
  }

  /**
   * Delete admin user
   */
  deleteAdminUser(userId: string, reason?: string): Observable<void> {
    const params = reason ? this.buildParams({ reason }) : undefined;
    return this.delete<void>(`${this.apiPath}/users/${userId}`, params);
  }

  /**
   * Assign role to admin user
   */
  assignRole(request: RoleAssignmentRequest): Observable<RoleManagementResponse> {
    return this.post<RoleManagementResponse>(`${this.apiPath}/assign-role`, request);
  }

  /**
   * Remove role from admin user
   */
  removeRole(userId: string, reason?: string): Observable<RoleManagementResponse> {
    return this.post<RoleManagementResponse>(`${this.apiPath}/remove-role`, { userId, reason });
  }

  /**
   * Check if user has permission
   */
  checkPermission(request: PermissionCheckRequest): Observable<PermissionCheckResponse> {
    return this.post<PermissionCheckResponse>(`${this.apiPath}/check-permission`, request);
  }

  /**
   * Check if current user has permission
   */
  hasPermission(permission: AdminPermission, resource?: string): Observable<boolean> {
    const currentAdmin = this.currentAdminSubject.value;
    if (!currentAdmin) {
      return new Observable(observer => observer.next(false));
    }

    return this.checkPermission({
      userId: currentAdmin.id,
      permission,
      resource
    }).pipe(
      map(response => response.hasPermission)
    );
  }

  /**
   * Check if current user can manage role
   */
  canManageRole(targetRole: AdminRole): boolean {
    const currentAdmin = this.currentAdminSubject.value;
    if (!currentAdmin) return false;

    const roleDefinition = this.getRoleDefinition(currentAdmin.role);
    return roleDefinition?.canManageRoles.includes(targetRole) || false;
  }

  /**
   * Get role definition
   */
  getRoleDefinition(role: AdminRole): AdminRoleDefinition | undefined {
    return ADMIN_ROLE_DEFINITIONS.find(def => def.role === role);
  }

  /**
   * Get all role definitions
   */
  getRoleDefinitions(): AdminRoleDefinition[] {
    return ADMIN_ROLE_DEFINITIONS;
  }

  /**
   * Get manageable roles for current admin
   */
  getManageableRoles(): AdminRoleDefinition[] {
    const currentAdmin = this.currentAdminSubject.value;
    if (!currentAdmin) return [];

    const currentRoleDefinition = this.getRoleDefinition(currentAdmin.role);
    if (!currentRoleDefinition) return [];

    return ADMIN_ROLE_DEFINITIONS.filter(def => 
      currentRoleDefinition.canManageRoles.includes(def.role)
    );
  }

  /**
   * Get permissions for role
   */
  getPermissionsForRole(role: AdminRole): AdminPermission[] {
    const roleDefinition = this.getRoleDefinition(role);
    return roleDefinition?.permissions || [];
  }

  /**
   * Check if permission is allowed for role
   */
  isPermissionAllowedForRole(role: AdminRole, permission: AdminPermission): boolean {
    const permissions = this.getPermissionsForRole(role);
    return permissions.includes(permission);
  }

  /**
   * Get role hierarchy level (lower number = higher privilege)
   */
  getRoleLevel(role: AdminRole): number {
    switch (role) {
      case AdminRole.SuperAdmin: return 0;
      case AdminRole.Admin: return 1;
      case AdminRole.ContentAdmin: return 2;
      default: return 999;
    }
  }

  /**
   * Check if role A can manage role B
   */
  canRoleManageRole(managerRole: AdminRole, targetRole: AdminRole): boolean {
    const managerDefinition = this.getRoleDefinition(managerRole);
    return managerDefinition?.canManageRoles.includes(targetRole) || false;
  }

  /**
   * Get admin activity log
   */
  getAdminActivityLog(userId?: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const params = this.buildParams({ userId, page, pageSize });
    return this.get(`${this.apiPath}/activity-log`, params);
  }

  /**
   * Get role assignment history
   */
  getRoleAssignmentHistory(userId: string): Observable<any[]> {
    return this.get<any[]>(`${this.apiPath}/users/${userId}/role-history`);
  }

  /**
   * Bulk role assignment
   */
  bulkAssignRole(userIds: string[], role: AdminRole, reason?: string): Observable<any> {
    return this.bulkOperation(`${this.apiPath}/bulk-assign-role`, userIds, role.toString(), { reason });
  }

  /**
   * Get role statistics
   */
  getRoleStatistics(): Observable<any> {
    return this.getStatistics(`${this.apiPath}/statistics`);
  }

  /**
   * Validate role assignment
   */
  validateRoleAssignment(request: RoleAssignmentRequest): Observable<any> {
    return this.post(`${this.apiPath}/validate-assignment`, request);
  }

  /**
   * Get permission conflicts
   */
  getPermissionConflicts(userId: string, newRole: AdminRole): Observable<any> {
    return this.get(`${this.apiPath}/permission-conflicts`, this.buildParams({ userId, newRole }));
  }

  /**
   * Export admin users
   */
  exportAdminUsers(format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    return this.downloadFile(`${this.apiPath}/export`, this.buildParams({ format }));
  }

  /**
   * Get current admin value (synchronous)
   */
  get currentAdminValue(): AdminUser | null {
    return this.currentAdminSubject.value;
  }

  /**
   * Check if current user is SuperAdmin
   */
  get isSuperAdmin(): boolean {
    return this.currentAdminValue?.role === AdminRole.SuperAdmin;
  }

  /**
   * Check if current user is Admin
   */
  get isAdmin(): boolean {
    return this.currentAdminValue?.role === AdminRole.Admin;
  }

  /**
   * Check if current user is ContentAdmin
   */
  get isContentAdmin(): boolean {
    return this.currentAdminValue?.role === AdminRole.ContentAdmin;
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(role: AdminRole): string {
    const definition = this.getRoleDefinition(role);
    return definition?.name || 'Unknown Role';
  }

  /**
   * Get permission display name
   */
  getPermissionDisplayName(permission: AdminPermission): string {
    return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}