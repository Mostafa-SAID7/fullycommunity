import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface MockNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  actionText?: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  isOpen = false;
  notifications = signal<MockNotification[]>([]);
  unreadCount = signal<number>(0);

  ngOnInit() {
    // Mock notifications for demo
    const mockNotifications: MockNotification[] = [
      {
        id: '1',
        title: 'New User Registration',
        message: 'A new user has registered and needs approval',
        category: 'user',
        priority: 'medium',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        actionUrl: '/admin/users',
        actionText: 'Review'
      },
      {
        id: '2',
        title: 'System Update Available',
        message: 'A new system update is available for installation',
        category: 'system',
        priority: 'low',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        actionUrl: '/admin/system',
        actionText: 'Update'
      }
    ];
    
    this.notifications.set(mockNotifications);
    this.unreadCount.set(mockNotifications.filter(n => !n.read).length);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  markAllAsRead() {
    const updated = this.notifications().map(n => ({ ...n, read: true }));
    this.notifications.set(updated);
    this.unreadCount.set(0);
  }

  clearAll() {
    this.notifications.set([]);
    this.unreadCount.set(0);
    this.closeDropdown();
  }

  handleNotificationClick(notification: MockNotification) {
    if (!notification.read) {
      const updated = this.notifications().map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      );
      this.notifications.set(updated);
      this.unreadCount.set(updated.filter(n => !n.read).length);
    }
    
    if (notification.actionUrl) {
      this.closeDropdown();
    }
  }

  removeNotification(notificationId: string) {
    const updated = this.notifications().filter(n => n.id !== notificationId);
    this.notifications.set(updated);
    this.unreadCount.set(updated.filter(n => !n.read).length);
  }

  trackByNotificationId(_: number, notification: MockNotification): string {
    return notification.id;
  }

  getNotificationDotClass(notification: any): string {
    if (notification.priority === 'critical') return 'critical';
    if (notification.priority === 'high') return 'high';
    if (notification.priority === 'medium') return 'medium';
    return 'low';
  }

  getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'system': return 'system';
      case 'user': return 'user';
      case 'content': return 'content';
      case 'security': return 'security';
      case 'performance': return 'performance';
      default: return 'system';
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