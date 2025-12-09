import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { Notification } from '../../../core/interfaces/notifications/notification.interface';
import { AdminHeaderComponent } from '../../../shared/components/admin-header/admin-header.component';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';

interface AdminRole {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AdminHeaderComponent, AdminSidebarComponent, ToastContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  notificationService = inject(NotificationService);

  currentUser = this.authService.currentUser;
  showRoleSwitcher = signal(false);
  showNotifications = signal(false);
  sidebarOpen = signal(false);
  showUserMenu = signal(false);
  currentViewRole = signal<string>('SuperAdmin');

  adminRoles: AdminRole[] = [
    { id: 'SuperAdmin', name: 'SuperAdmin', displayName: 'Super Admin', icon: '👑', description: 'Full system access' },
    { id: 'Admin', name: 'Admin', displayName: 'Admin', icon: '🔧', description: 'General administration' },
    { id: 'Moderator', name: 'Moderator', displayName: 'Moderator', icon: '🛡️', description: 'Content moderation' },
    { id: 'UserAdmin', name: 'UserAdmin', displayName: 'User Admin', icon: '👥', description: 'User management' },
    { id: 'ContentAdmin', name: 'ContentAdmin', displayName: 'Content Admin', icon: '📝', description: 'Content management' },
  ];

  isSuperAdmin(): boolean {
    return this.currentUser()?.roles?.includes('SuperAdmin') ?? false;
  }

  getCurrentRoleDisplay(): AdminRole {
    return this.adminRoles.find(r => r.id === this.currentViewRole()) || this.adminRoles[0];
  }

  toggleRoleSwitcher() {
    this.showRoleSwitcher.update(v => !v);
  }

  switchRole(role: AdminRole) {
    this.currentViewRole.set(role.id);
    this.showRoleSwitcher.set(false);
    // Navigate to dashboard to refresh view based on new role
    this.router.navigate(['/admin/dashboard']);
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'A';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'A';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.loadNotifications().subscribe();
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    if (this.showNotifications()) {
      this.showRoleSwitcher.set(false);
    }
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  deleteNotification(event: Event, id: string) {
    event.stopPropagation();
    this.notificationService.deleteNotification(id).subscribe();
  }

  clearAllNotifications() {
    this.notificationService.clearAll().subscribe();
  }

  createTestNotification() {
    this.notificationService.createTestNotification().subscribe(() => {
      this.loadNotifications();
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  getSidebarClasses(): string {
    const isOpen = this.sidebarOpen();
    const baseClasses = 'bg-white border-r border-gray-200 overflow-y-auto shadow-sm transition-all duration-300 ease-in-out';
    
    if (isOpen) {
      return `${baseClasses} fixed inset-y-0 left-0 w-64 z-50 lg:static lg:w-64`;
    }
    
    return `${baseClasses} fixed inset-y-0 left-0 w-0 lg:w-64 lg:static -ml-64 lg:ml-0`;
  }

  isLinkActive(route: string): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes(route);
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }

  trackByRoleId(index: number, role: AdminRole): string {
    return role.id;
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}
