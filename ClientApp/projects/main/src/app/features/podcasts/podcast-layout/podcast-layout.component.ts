import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from '../../../shared/components/sidebar-layout/sidebar-layout.component';
import { SidebarMenuItem, SidebarShortcut } from '../../../shared/components/left-sidebar/left-sidebar.component';
import { SponsoredItem, EventReminder, Contact } from '../../../shared/components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-podcast-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout
      [leftMenuItems]="leftMenuItems"
      [shortcuts]="shortcuts"
      [showUserProfile]="true"
      [showFooter]="true"
      [sponsoredItems]="sponsoredItems"
      [events]="events"
      [contacts]="contacts"
      [showSponsored]="true"
      [showEvents]="true"
      [showContacts]="true"
      [showRightSidebar]="true"
    >
      <router-outlet></router-outlet>
    </app-sidebar-layout>
  `
})
export class PodcastLayoutComponent {
  leftMenuItems: SidebarMenuItem[] = [
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

  sponsoredItems: SponsoredItem[] = [
    { id: '1', title: 'Premium Podcast Equipment', url: 'podcastgear.com', image: '/assets/ads/podcast-equipment.jpg' },
    { id: '2', title: 'Audio Recording Studio', url: 'audiostudio.com', image: '/assets/ads/audio-studio.jpg' }
  ];

  events: EventReminder[] = [
    { id: '1', title: 'Live Podcast Recording', time: 'Tonight at 9:00 PM' },
    { id: '2', title: 'Car Talk Live Show', time: 'Sunday at 3:00 PM' }
  ];

  contacts: Contact[] = [
    { id: '1', name: 'Car Talk Host', initials: 'CT', online: true },
    { id: '2', name: 'Garage Guru', initials: 'GG', online: true },
    { id: '3', name: 'EV Expert', initials: 'EE', online: false },
    { id: '4', name: 'Wrench Master', initials: 'WM', online: true }
  ];
}
