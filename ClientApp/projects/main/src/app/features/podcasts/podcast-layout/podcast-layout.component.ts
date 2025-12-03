import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionLayoutComponent, MenuItem, SidebarShortcut } from '../../../shared/components/section-layout/section-layout.component';

@Component({
  selector: 'app-podcast-layout',
  standalone: true,
  imports: [CommonModule, SectionLayoutComponent],
  template: `
    <app-section-layout
      sectionTitle="Podcasts"
      sectionIcon="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"
      [menuItems]="menuItems"
      [shortcuts]="shortcuts"
      [showRightSidebar]="true"
      rightSidebarContent="podcasts"
    />
  `
})
export class PodcastLayoutComponent {
  menuItems: MenuItem[] = [
    { icon: 'home', label: 'Discover', route: '/podcasts', exact: true },
    { icon: 'episodes', label: 'Episodes', route: '/podcasts/episodes' },
    { icon: 'shows', label: 'Shows', route: '/podcasts/shows' },
    { icon: 'subscriptions', label: 'Subscriptions', route: '/podcasts/subscriptions' },
    { icon: 'library', label: 'Your Library', route: '/podcasts/library' },
    { icon: 'history', label: 'History', route: '/podcasts/history' },
    { icon: 'saved', label: 'Saved Episodes', route: '/podcasts/saved' }
  ];

  shortcuts: SidebarShortcut[] = [
    { id: 'car-talk', name: 'Car Talk Weekly', image: '/assets/podcasts/car-talk.jpg', type: 'podcasts/show' },
    { id: 'garage-stories', name: 'Garage Stories', image: '/assets/podcasts/garage.jpg', type: 'podcasts/show' },
    { id: 'ev-future', name: 'EV Future', image: '/assets/podcasts/ev.jpg', type: 'podcasts/show' }
  ];
}
