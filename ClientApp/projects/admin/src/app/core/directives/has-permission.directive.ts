/**
 * Has Permission Directive
 * Conditionally shows/hides elements based on user permissions
 */

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminRBACService } from '../services/rbac/admin-rbac.service';
import { AdminPermission } from '../interfaces/rbac';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private hasView = false;

  @Input() hasPermission!: AdminPermission;
  @Input() hasPermissionResource?: string;
  @Input() hasPermissionElse?: TemplateRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private rbacService: AdminRBACService
  ) {}

  ngOnInit() {
    this.checkPermission();
    
    // Re-check when current admin changes
    this.rbacService.currentAdmin$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.checkPermission();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkPermission() {
    this.rbacService.hasPermission(this.hasPermission, this.hasPermissionResource)
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasPermission => {
        this.updateView(hasPermission);
      });
  }

  private updateView(hasPermission: boolean) {
    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
      
      // Show else template if provided
      if (this.hasPermissionElse) {
        this.viewContainer.createEmbeddedView(this.hasPermissionElse);
      }
    }
  }
}