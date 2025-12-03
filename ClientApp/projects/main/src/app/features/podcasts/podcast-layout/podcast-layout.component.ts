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
    >
      <ng-content></ng-content>
    </app-section-layout>
  `
})
export class PodcastLayoutComponent {
  menuItems: MenuItem[] = [
    { icon: 'home', label: 'Home', route: '/podcasts', exact: true },
    { icon: 'browse', label: 'Browse', route: '/podcasts/browse' },
    { icon: 'library', label: 'Library', route: '/podcasts/library' },
    { icon: 'subscriptions', label: 'Subscriptions', route: '/podcasts/library' },
    { icon: 'history', label: 'History', route: '/podcasts/library' },
    { icon: 'create', label: 'Create Show', route: '/podcasts/create' }
  ];

  shortcuts: SidebarShortcut[] = [
    { id: 'car-talk', name: 'The Car Talk Show', image: 'https://picsum.photos/seed/cartalk/400/400', type: 'podcasts/show' },
    { id: 'garage-sessions', name: 'Garage Sessions', image: 'https://picsum.photos/seed/garage/400/400', type: 'podcasts/show' },
    { id: 'ev-revolution', name: 'EV Revolution', image: 'https://picsum.photos/seed/evrev/400/400', type: 'podcasts/show' },
    { id: 'wrench-talk', name: 'Wrench Talk', image: 'https://picsum.photos/seed/wrench/400/400', type: 'podcasts/show' }
  ];
}
