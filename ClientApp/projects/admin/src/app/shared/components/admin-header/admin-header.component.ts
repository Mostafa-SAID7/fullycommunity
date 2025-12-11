import { Component, output, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { RefreshButtonComponent } from '../refresh-button/refresh-button.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { Notification } from '../../../core/interfaces/notifications/notification.interface';

interface AdminRole {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ThemeSwitcherComponent, RefreshButtonComponent],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();
  private refreshTimeout: number | null = null;

  // Outputs
  toggleSidebar = output<void>();
  
  // Component state
  searchQuery = '';
  isRefreshing = false;
  showRoleSwitcher = signal(false);
  showNotifications = signal(false);
  showUserMenu = signal(false);
  currentViewRole = signal<string>('SuperAdmin');

  // User info from auth service
  currentUser = this.authService.currentUser;

  adminRoles: AdminRole[] = [
    { id: 'SuperAdmin', name: 'SuperAdmin', displayName: 'Super Admin', icon: '👑', description: 'Full system access' },
    { id: 'Admin', name: 'Admin', displayName: 'Admin', icon: '🔧', description: 'General administration' },
    { id: 'Moderator', name: 'Moderator', displayName: 'Moderator', icon: '🛡️', description: 'Content moderation' },
    { id: 'UserAdmin', name: 'UserAdmin', displayName: 'User Admin', icon: '👥', description: 'User management' },
    { id: 'ContentAdmin', name: 'ContentAdmin', displayName: 'Content Admin', icon: '📝', description: 'Content management' },
  ];

  get userName(): string {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'Admin User';
  }

  get userRole(): string {
    return this.getCurrentRoleDisplay().displayName;
  }

  get userAvatar(): string {
    return this.currentUser()?.avatarUrl || '';
  }

  get notificationCount(): number {
    return this.notificationService.unreadCount();
  }

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    // Clear refresh timeout
    if (this.refreshTimeout !== null) {
      clearTimeout(this.refreshTimeout);
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNotifications() {
    this.notificationService.loadNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  isSuperAdmin(): boolean {
    return this.currentUser()?.roles?.includes('SuperAdmin') ?? false;
  }

  getCurrentRoleDisplay(): AdminRole {
    return this.adminRoles.find(r => r.id === this.currentViewRole()) || this.adminRoles[0];
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'A';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'A';
  }

  toggleRoleSwitcher() {
    this.showRoleSwitcher.update(v => !v);
    this.showNotifications.set(false);
    this.showUserMenu.set(false);
  }

  switchRole(role: AdminRole) {
    this.currentViewRole.set(role.id);
    this.showRoleSwitcher.set(false);
    // Navigate to dashboard to refresh view based on new role
    this.router.navigate(['/admin/dashboard']);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search logic
    }
  }
  
  clearSearch(): void {
    this.searchQuery = '';
  }
  
  refreshData(): void {
    this.isRefreshing = true;
    // Clear existing timeout
    if (this.refreshTimeout !== null) {
      clearTimeout(this.refreshTimeout);
    }
    // Simulate refresh
    this.refreshTimeout = window.setTimeout(() => {
      this.isRefreshing = false;
      this.refreshTimeout = null;
    }, 2000);
  }
  
  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    this.showRoleSwitcher.set(false);
    this.showUserMenu.set(false);
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  deleteNotification(event: Event, id: string) {
    event.stopPropagation();
    this.notificationService.deleteNotification(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  clearAllNotifications() {
    this.notificationService.clearAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  createTestNotification() {
    this.notificationService.createTestNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadNotifications();
      });
  }
  
  toggleProfileMenu(): void {
    this.showUserMenu.update(v => !v);
    this.showRoleSwitcher.set(false);
    this.showNotifications.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  trackByRoleId(index: number, role: AdminRole): string {
    return role.id;
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}