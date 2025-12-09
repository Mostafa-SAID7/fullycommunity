import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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

export interface SubMenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

export interface CatalogueItem {
  icon: string;
  label: string;
  route: string;
  color?: string;
  subItems?: SubMenuItem[];
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
  
  @Output() expandedChange = new EventEmitter<boolean>();
  
  // Sidebar state - collapsed on small screens, expanded on large screens
  isExpanded = signal(this.getInitialExpandedState());
  hoveredItem = signal<string | null>(null);
  activeCatalogue = signal<string | null>(null);
  isMobileOpen = signal(false);

  private getInitialExpandedState(): boolean {
    // Check if we're in browser and screen is large (lg breakpoint = 1024px)
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true; // Default to expanded for SSR
  }

  // Community-specific catalogue items (shown when on community pages)
  communityCatalogueItems: CatalogueItem[] = [
    { icon: 'feed', label: 'Posts', route: '/community/posts', color: 'text-blue-500' },
    { icon: 'qa', label: 'Q&A', route: '/community/qa', color: 'text-indigo-500' },
    { icon: 'friends', label: 'Friends', route: '/community/friends', color: 'text-cyan-500' },
    { icon: 'groups', label: 'Groups', route: '/community/groups', color: 'text-purple-500' },
    { icon: 'events', label: 'Events', route: '/community/events', color: 'text-orange-500' },
    { icon: 'guides', label: 'Guides', route: '/community/guides', color: 'text-amber-500' },
    { icon: 'reviews', label: 'Reviews', route: '/community/reviews', color: 'text-yellow-500' },
    { icon: 'news', label: 'News', route: '/community/news', color: 'text-red-500' },
    { icon: 'maps', label: 'Maps', route: '/community/maps', color: 'text-teal-500' },
    { icon: 'saved', label: 'Saved', route: '/community/saved', color: 'text-pink-500' },
  ];

  // Catalogue items with sub-items for each section
  catalogueItems: CatalogueItem[] = [
    { 
      icon: 'home', 
      label: 'Home', 
      route: '/', 
      color: 'text-blue-500'
    },
    { 
      icon: 'community', 
      label: 'Community', 
      route: '/community', 
      color: 'text-green-500',
      subItems: [
        { icon: 'feed', label: 'Posts', route: '/community/posts' },
        { icon: 'friends', label: 'Friends', route: '/community/friends', badge: 5 },
        { icon: 'groups', label: 'Groups', route: '/community/groups' },
        { icon: 'events', label: 'Events', route: '/community/events' },
        { icon: 'qa', label: 'Q&A', route: '/community/qa', badge: 12 },
        { icon: 'saved', label: 'Saved', route: '/community/saved' },
      ]
    },
    { 
      icon: 'videos', 
      label: 'Videos', 
      route: '/videos', 
      color: 'text-red-500',
      subItems: [
        { icon: 'feed', label: 'Browse', route: '/videos' },
        { icon: 'videos', label: 'Live', route: '/videos/live' },
        { icon: 'saved', label: 'Watch Later', route: '/videos/watch-later' },
        { icon: 'history', label: 'History', route: '/videos/history' },
      ]
    },
    { 
      icon: 'marketplace', 
      label: 'Marketplace', 
      route: '/marketplace', 
      color: 'text-purple-500',
      subItems: [
        { icon: 'feed', label: 'Browse', route: '/marketplace' },
        { icon: 'cart', label: 'My Orders', route: '/marketplace/orders' },
        { icon: 'saved', label: 'Wishlist', route: '/marketplace/wishlist' },
        { icon: 'sell', label: 'Sell', route: '/marketplace/sell' },
      ]
    },
    { 
      icon: 'podcasts', 
      label: 'Podcasts', 
      route: '/podcasts', 
      color: 'text-orange-500',
      subItems: [
        { icon: 'feed', label: 'Discover', route: '/podcasts' },
        { icon: 'saved', label: 'Library', route: '/podcasts/library' },
        { icon: 'history', label: 'Recent', route: '/podcasts/recent' },
      ]
    },
    { 
      icon: 'services', 
      label: 'Services', 
      route: '/services', 
      color: 'text-cyan-500',
      subItems: [
        { icon: 'feed', label: 'Browse', route: '/services' },
        { icon: 'booking', label: 'Bookings', route: '/services/bookings' },
        { icon: 'reviews', label: 'Reviews', route: '/services/reviews' },
      ]
    },
  ];

  // Sidebar is always visible and expanded by default on all screens

  toggleSidebar() {
    this.isExpanded.update(v => !v);
    this.expandedChange.emit(this.isExpanded());
  }

  isMobileOverlayVisible(): boolean {
    // Show overlay on mobile when expanded panel is open
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  }

  closeMobilePanel() {
    // Close the expanded panel on mobile
    this.isExpanded.set(false);
    this.expandedChange.emit(false);
  }

  setHoveredItem(item: string | null) {
    this.hoveredItem.set(item);
  }

  setActiveCatalogue(label: string | null) {
    if (this.activeCatalogue() === label) {
      this.activeCatalogue.set(null);
    } else {
      this.activeCatalogue.set(label);
    }
  }

  selectCatalogueItem(item: CatalogueItem) {
    this.activeCatalogue.set(item.label);
    if (!this.isExpanded()) {
      this.isExpanded.set(true);
    }
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getDisplayCatalogueItems(): CatalogueItem[] {
    // Check if current route is a community page
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/community')) {
      return this.communityCatalogueItems;
    }
    return this.catalogueItems;
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
      qa: 'M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z',
      guides: 'M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z',
      reviews: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
      news: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
      maps: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z',
      saved: 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z',
      history: 'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
      cart: 'M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
      sell: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z',
      booking: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z',
      menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
      close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      chevronLeft: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
      chevronRight: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
      chevronDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
      chevronUp: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z',
    };
    return icons[name] || icons['feed'];
  }
}
