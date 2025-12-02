import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  showNotifications = signal(false);
  showUserMenu = signal(false);
  notifications = signal([
    { id: 1, title: 'New comment on your post', time: '2 min ago', read: false },
    { id: 2, title: 'Someone liked your review', time: '1 hour ago', read: false },
    { id: 3, title: 'New follower', time: '3 hours ago', read: true }
  ]);

  get unreadCount() {
    return this.notifications().filter(n => !n.read).length;
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    this.showUserMenu.set(false);
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
    this.showNotifications.set(false);
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
    const u = this.authService.currentUser();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }
}
