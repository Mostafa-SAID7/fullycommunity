import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'comment' | 'like' | 'follow' | 'message' | 'event' | 'system';
  icon?: string;
  link?: string;
  avatar?: string;
}

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications-panel.component.html',
  styleUrl: './notifications-panel.component.scss'
})
export class NotificationsPanelComponent {
  @Input() notifications: Notification[] = [];
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() markAsRead = new EventEmitter<string>();
  @Output() markAllAsRead = new EventEmitter<void>();
  @Output() clearAll = new EventEmitter<void>();

  activeTab = signal<'all' | 'unread'>('all');

  get filteredNotifications() {
    if (this.activeTab() === 'unread') {
      return this.notifications.filter(n => !n.read);
    }
    return this.notifications;
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      this.markAsRead.emit(notification.id);
    }
    if (notification.link) {
      this.close.emit();
    }
  }

  handleMarkAllAsRead() {
    this.markAllAsRead.emit();
  }

  handleClearAll() {
    this.clearAll.emit();
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      comment: 'M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z',
      like: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      follow: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      message: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z',
      event: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
      system: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    };
    return icons[type] || icons['system'];
  }

  getNotificationColor(type: string): string {
    const colors: Record<string, string> = {
      comment: '#1E88E5',
      like: '#E53935',
      follow: '#00C853',
      message: '#FF6900',
      event: '#FFC107',
      system: '#65676b'
    };
    return colors[type] || colors['system'];
  }
}
