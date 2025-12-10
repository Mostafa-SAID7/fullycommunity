/**
 * Has Role Directive
 * Conditionally shows/hides elements based on user roles
 */

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminRBACService } from '../services/rbac/admin-rbac.service';
import { AdminRole } from '../interfaces/rbac';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private hasView = false;

  @Input() hasRole!: AdminRole | AdminRole[];
  @Input() hasRoleElse?: TemplateRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private rbacService: AdminRBACService
  ) {}

  ngOnInit() {
    this.checkRole();
    
    // Re-check when current admin changes
    this.rbacService.currentAdmin$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.checkRole();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkRole() {
    const currentAdmin = this.rbacService.currentAdminValue;
    if (!currentAdmin) {
      this.updateView(false);
      return;
    }

    const requiredRoles = Array.isArray(this.hasRole) ? this.hasRole : [this.hasRole];
    const hasRole = requiredRoles.includes(currentAdmin.role);
    this.updateView(hasRole);
  }

  private updateView(hasRole: boolean) {
    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
      
      // Show else template if provided
      if (this.hasRoleElse) {
        this.viewContainer.createEmbeddedView(this.hasRoleElse);
      }
    }
  }
}