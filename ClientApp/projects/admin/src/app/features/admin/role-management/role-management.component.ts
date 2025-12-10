/**
 * Role Management Component
 * SuperAdmin interface for managing admin roles and permissions
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AdminRBACService } from '../../../core/services/rbac/admin-rbac.service';
import {
  AdminRole,
  AdminPermission,
  AdminUser,
  AdminRoleDefinition,
  RoleAssignmentRequest
} from '../../../core/interfaces/rbac';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  adminUsers: AdminUser[] = [];
  roleDefinitions: AdminRoleDefinition[] = [];
  manageableRoles: AdminRoleDefinition[] = [];
  selectedUser: AdminUser | null = null;
  
  // UI State
  loading = false;
  showAssignRoleModal = false;
  showUserDetailsModal = false;
  
  // Forms
  assignRoleForm: FormGroup;
  filterForm: FormGroup;
  
  // Enums for template
  AdminRole = AdminRole;
  AdminPermission = AdminPermission;
  
  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;

  constructor(
    private rbacService: AdminRBACService,
    private fb: FormBuilder
  ) {
    this.assignRoleForm = this.fb.group({
      userId: ['', Validators.required],
      role: ['', Validators.required],
      reason: ['']
    });

    this.filterForm = this.fb.group({
      role: [''],
      search: [''],
      isActive: ['']
    });
  }

  ngOnInit() {
    this.loadRoleDefinitions();
    this.loadAdminUsers();
    this.setupFormSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRoleDefinitions() {
    this.roleDefinitions = this.rbacService.getRoleDefinitions();
    this.manageableRoles = this.rbacService.getManageableRoles();
  }

  private loadAdminUsers() {
    this.loading = true;
    const filters = this.filterForm.value;
    
    this.rbacService.getAdminUsers(this.currentPage, this.pageSize, filters.role)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          this.adminUsers = response.data;
          this.totalItems = response.total;
        },
        error: (error) => {
          console.error('Failed to load admin users:', error);
        }
      });
  }

  private setupFormSubscriptions() {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadAdminUsers();
      });
  }

  onAssignRole() {
    if (this.assignRoleForm.invalid) return;

    const request: RoleAssignmentRequest = this.assignRoleForm.value;
    this.loading = true;

    this.rbacService.assignRole(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          console.log('Role assigned successfully:', response);
          this.showAssignRoleModal = false;
          this.assignRoleForm.reset();
          this.loadAdminUsers();
        },
        error: (error) => {
          console.error('Failed to assign role:', error);
        }
      });
  }

  onRemoveRole(user: AdminUser) {
    if (!confirm(`Are you sure you want to remove the role from ${user.username}?`)) {
      return;
    }

    this.loading = true;
    this.rbacService.removeRole(user.id, 'Role removed by SuperAdmin')
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          console.log('Role removed successfully:', response);
          this.loadAdminUsers();
        },
        error: (error) => {
          console.error('Failed to remove role:', error);
        }
      });
  }

  onViewUserDetails(user: AdminUser) {
    this.selectedUser = user;
    this.showUserDetailsModal = true;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadAdminUsers();
  }

  canManageUser(user: AdminUser): boolean {
    return this.rbacService.canManageRole(user.role);
  }

  getRoleDisplayName(role: AdminRole): string {
    return this.rbacService.getRoleDisplayName(role);
  }

  getPermissionDisplayName(permission: AdminPermission): string {
    return this.rbacService.getPermissionDisplayName(permission);
  }

  getRoleDefinition(role: AdminRole): AdminRoleDefinition | undefined {
    return this.rbacService.getRoleDefinition(role);
  }

  openAssignRoleModal(user?: AdminUser) {
    if (user) {
      this.assignRoleForm.patchValue({
        userId: user.id,
        role: user.role
      });
    }
    this.showAssignRoleModal = true;
  }

  closeAssignRoleModal() {
    this.showAssignRoleModal = false;
    this.assignRoleForm.reset();
  }

  closeUserDetailsModal() {
    this.showUserDetailsModal = false;
    this.selectedUser = null;
  }

  exportUsers() {
    this.rbacService.exportAdminUsers('excel')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `admin-users-${new Date().toISOString().split('T')[0]}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Failed to export users:', error);
        }
      });
  }

  get isSuperAdmin(): boolean {
    return this.rbacService.isSuperAdmin;
  }
}