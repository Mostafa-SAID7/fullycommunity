import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionLayoutComponent, MenuItem, SidebarShortcut } from '../../../shared/components/section-layout/section-layout.component';

@Component({
  selector: 'app-video-layout',
  standalone: true,
  imports: [CommonModule, SectionLayoutComponent],
  template: `
    <app-section-layout
      sectionTitle="Videos"
      sectionIcon="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
      [menuItems]="menuItems"
      [shortcuts]="shortcuts"
      [showRightSidebar]="true"
      rightSidebarContent="videos"
    />
  `
})
export class VideoLayoutComponent {
  menuItems: MenuItem[] = [
    { icon: 'home', label: 'Home', route: '/videos', exact: true },
    { icon: 'shorts', label: 'Shorts', route: '/videos/shorts' },
    { icon: 'live', label: 'Live', route: '/videos/live' },
    { icon: 'trending', label: 'Trending', route: '/videos/trending' },
    { icon: 'subscriptions', label: 'Subscriptions', route: '/videos/subscriptions' },
    { icon: 'library', label: 'Library', route: '/videos/library' },
    { icon: 'history', label: 'History', route: '/videos/history' },
    { icon: 'channel', label: 'Your Channel', route: '/videos/channel/me' },
    { icon: 'saved', label: 'Saved Videos', route: '/videos/saved' }
  ];

  shortcuts: SidebarShortcut[] = [
    { id: 'classic-cars', name: 'Classic Cars Channel', image: '/assets/channels/classic.jpg', type: 'videos/channel' },
    { id: 'diy-garage', name: 'DIY Garage', image: '/assets/channels/diy.jpg', type: 'videos/channel' },
    { id: 'ev-world', name: 'EV World', image: '/assets/channels/ev.jpg', type: 'videos/channel' }
  ];
}
