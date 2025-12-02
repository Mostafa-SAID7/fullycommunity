import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;
  showUserMenu = signal(false);
  showNotifications = signal(false);
  notifications = signal([
    { id: 1, title: 'New comment on your post', time: '2 min ago', read: false, icon: 'comment' },
    { id: 2, title: 'Someone liked your review', time: '1 hour ago', read: false, icon: 'like' },
    { id: 3, title: 'New follower', time: '3 hours ago', read: true, icon: 'user' }
  ]);

  get unreadCount() {
    return this.notifications().filter(n => !n.read).length;
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
    this.showNotifications.set(false);
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    this.showUserMenu.set(false);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.showUserMenu.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }
}
