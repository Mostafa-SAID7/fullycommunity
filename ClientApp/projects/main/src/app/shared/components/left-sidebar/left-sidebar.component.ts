import { Component, inject, Input, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface SidebarMenuItem {
  icon: string;
  label: string;
  route: string;
  exact?: boolean;
  badge?: number;
}

export interface SidebarShortcut {
  id: string;
  name: string;
  image: string;
  type: string;
  route?: string;
}

export interface CatalogueItem {
  icon: string;
  label: string;
  route: string;
  color?: string;
}

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './left-sidebar.component.html'
})
export class LeftSidebarComponent {
  private authService = inject(AuthService);
  
  @Input() menuItems: SidebarMenuItem[] = [];
  @Input() shortcuts: SidebarShortcut[] = [];
  @Input() showUserProfile = true;
  @Input() showFooter = true;
  
  // Sidebar state
  isExpanded = signal(true);
  isMobileOpen = signal(false);
  hoveredItem = signal<string | null>(null);
  
  user = this.authService.currentUser;

  // Catalogue items with icons
  catalogueItems: CatalogueItem[] = [
    { icon: 'home', label: 'Home', route: '/', color: 'text-blue-500' },
    { icon: 'community', label: 'Community', route: '/community', color: 'text-green-500' },
    { icon: 'videos', label: 'Videos', route: '/videos', color: 'text-red-500' },
    { icon: 'marketplace', label: 'Marketplace', route: '/marketplace', color: 'text-purple-500' },
    { icon: 'podcasts', label: 'Podcasts', route: '/podcasts', color: 'text-orange-500' },
    { icon: 'services', label: 'Services', route: '/services', color: 'text-cyan-500' },
  ];

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth < 1024) {
      this.isExpanded.set(false);
    }
  }

  constructor() {
    // Check initial screen size
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.isExpanded.set(false);
    }
  }

  toggleSidebar() {
    this.isExpanded.update(v => !v);
  }

  toggleMobileSidebar() {
    this.isMobileOpen.update(v => !v);
  }

  closeMobileSidebar() {
    this.isMobileOpen.set(false);
  }

  setHoveredItem(item: string | null) {
    this.hoveredItem.set(item);
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getIcon(name: string): string {
    const icons: Record<string, string> = {
      home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
      community: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      videos: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
      marketplace: 'M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
      podcasts: 'M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z',
      services: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
      feed: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
      friends: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      groups: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
      events: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
      saved: 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z',
      menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
      close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      chevronLeft: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
      chevronRight: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    };
    return icons[name] || icons['feed'];
  }
}
