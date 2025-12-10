import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminNotificationsService, AdminNotification } from '../../../core/services/notifications/admin-notifications.service';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative">
      <!-- Notification Bell Button -->
      <button (click)="toggleDropdown()" 
              class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        
        <!-- Notification Badge -->
        <span *ngIf="unreadCount() > 0" 
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {{ unreadCount() > 99 ? '99+' : unreadCount() }}
        </span>
      </button>

      <!-- Dropdown Panel -->
      <div *ngIf="isOpen" 
           class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
        
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
            <div class="flex items-center gap-2">
              <button *ngIf="unreadCount() > 0" 
                      (click)="markAllAsRead()"
                      class="text-xs text-primary hover:text-primary-hover font-medium">
                Mark all read
              </button>
              <button (click)="clearAll()"
                      class="text-xs text-gray-500 hover:text-gray-700">
                Clear all
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="max-h-80 overflow-y-auto">
          <div *ngIf="notifications().length === 0" 
               class="px-4 py-8 text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <p class="text-sm">No notifications</p>
          </div>

          <div *ngFor="let notification of notifications(); trackBy: trackByNotificationId" 
               class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
               [class.bg-blue-50]="!notification.read"
               (click)="handleNotificationClick(notification)">
            
            <div class="flex items-start gap-3">
              <!-- Priority/Type Indicator -->
              <div class="flex-shrink-0 mt-1">
                <div class="w-2 h-2 rounded-full" [class]="getNotificationDotClass(notification)"></div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ notification.title }}
                    </p>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                      {{ notification.message }}
                    </p>
                  </div>
                  
                  <!-- Category Badge -->
                  <span class="flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full" 
                        [class]="getCategoryBadgeClass(notification.category)">
                    {{ notification.category | titlecase }}
                  </span>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-gray-500">
                    {{ getRelativeTime(notification.timestamp) }}
                  </span>
                  
                  <div class="flex items-center gap-2">
                    <!-- Action Button -->
                    <button *ngIf="notification.actionUrl && notification.actionText" 
                            [routerLink]="notification.actionUrl"
                            (click)="closeDropdown(); $event.stopPropagation()"
                            class="text-xs text-primary hover:text-primary-hover font-medium">
                      {{ notification.actionText }}
                    </button>
                    
                    <!-- Remove Button -->
                    <button (click)="removeNotification(notification.id); $event.stopPropagation()"
                            class="text-xs text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button routerLink="/admin/notifications" 
                  (click)="closeDropdown()"
                  class="w-full text-sm text-primary hover:text-primary-hover font-medium text-center">
            View all notifications
          </button>
        </div>
      </div>

      <!-- Backdrop -->
      <div *ngIf="isOpen" 
           (click)="closeDropdown()"
           class="fixed inset-0 z-40"></div>
    </div>
  `
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private notificationsService = inject(AdminNotificationsService);

  isOpen = false;
  notifications = signal<AdminNotification[]>([]);
  unreadCount = signal<number>(0);

  ngOnInit() {
    // Load initial notifications
    this.notifications.set(this.notificationsService.getNotifications());
    this.unreadCount.set(this.notificationsService.getUnreadCount());

    // Subscribe to real-time updates
    this.notificationsService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications.set(notifications);
        this.unreadCount.set(notifications.filter(n => !n.read).length);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead();
  }

  clearAll() {
    this.notificationsService.clearAll();
    this.closeDropdown();
  }

  handleNotificationClick(notification: AdminNotification) {
    if (!notification.read) {
      this.notificationsService.markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      this.closeDropdown();
    }
  }

  removeNotification(notificationId: string) {
    this.notificationsService.removeNotification(notificationId);
  }

  trackByNotificationId(index: number, notification: AdminNotification): string {
    return notification.id;
  }

  getNotificationDotClass(notification: AdminNotification): string {
    if (notification.priority === 'critical') return 'bg-red-500';
    if (notification.priority === 'high') return 'bg-orange-500';
    if (notification.priority === 'medium') return 'bg-yellow-500';
    return 'bg-blue-500';
  }

  getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'system': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'content': return 'bg-purple-100 text-purple-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'performance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  }
}