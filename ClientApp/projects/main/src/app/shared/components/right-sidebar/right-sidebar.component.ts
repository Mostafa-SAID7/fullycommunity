import { Component, Input, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SponsoredItem {
  id: string;
  title: string;
  url: string;
  image: string;
}

export interface EventReminder {
  id: string;
  title: string;
  time: string;
  icon?: string;
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  online: boolean;
  avatar?: string;
}

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './right-sidebar.component.html'
})
export class RightSidebarComponent implements OnInit, OnDestroy {
  @Input() sponsoredItems: SponsoredItem[] = [];
  @Input() events: EventReminder[] = [];
  @Input() contacts: Contact[] = [];
  @Input() showSponsored = true;
  @Input() showEvents = true;
  @Input() showContacts = true;

  // Mobile sidebar state
  isMobileOpen = signal(false);
  isXlScreen = signal(false);
  isRtl = signal(false);

  // Computed transform style for sidebar
  sidebarTransform = computed(() => {
    if (this.isXlScreen() || this.isMobileOpen()) {
      return 'translateX(0)';
    }
    // Hide on mobile
    const isRtlDir = this.isRtl();
    return isRtlDir ? 'translateX(-100%)' : 'translateX(100%)';
  });

  // Check RTL direction
  private checkRtl() {
    if (typeof document !== 'undefined') {
      this.isRtl.set(document.documentElement.dir === 'rtl');
    }
  }

  private resizeListener?: () => void;

  constructor() {
    // Close mobile sidebar when screen becomes xl
    effect(() => {
      if (this.isXlScreen() && this.isMobileOpen()) {
        this.isMobileOpen.set(false);
      }
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.checkScreenSize();
      this.checkRtl();
      this.resizeListener = () => {
        this.checkScreenSize();
        this.checkRtl();
      };
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy() {
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      // xl breakpoint in Tailwind is 1280px
      this.isXlScreen.set(window.innerWidth >= 1280);
    }
  }

  toggleMobileSidebar() {
    this.isMobileOpen.update(v => !v);
  }

  closeMobileSidebar() {
    this.isMobileOpen.set(false);
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Icon paths
  getIcon(name: string): string {
    const icons: Record<string, string> = {
      contacts: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    };
    return icons[name] || icons['contacts'];
  }
}
