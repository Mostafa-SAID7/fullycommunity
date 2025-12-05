import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from '../../../shared/components/sidebar-layout/sidebar-layout.component';
import { SidebarMenuItem, SidebarShortcut } from '../../../shared/components/left-sidebar/left-sidebar.component';
import { SponsoredItem, EventReminder, Contact } from '../../../shared/components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-video-layout',
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
      contentWidth="wide"
    >
      <router-outlet></router-outlet>
    </app-sidebar-layout>
  `
})
export class VideoLayoutComponent {
  leftMenuItems: SidebarMenuItem[] = [
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

  sponsoredItems: SponsoredItem[] = [
    { id: '1', title: 'Premium Video Equipment', url: 'videoequipment.com', image: '/assets/ads/video-equipment.jpg' },
    { id: '2', title: 'Car Camera Systems', url: 'carcameras.com', image: '/assets/ads/car-cameras.jpg' }
  ];

  events: EventReminder[] = [
    { id: '1', title: 'Live Car Review Stream', time: 'Today at 8:00 PM' },
    { id: '2', title: 'Weekly Car Show', time: 'Friday at 7:00 PM' }
  ];

  contacts: Contact[] = [
    { id: '1', name: 'CarReviewer Pro', initials: 'CR', online: true },
    { id: '2', name: 'AutoVlogger', initials: 'AV', online: true },
    { id: '3', name: 'GearheadTV', initials: 'GT', online: false },
    { id: '4', name: 'SpeedChannel', initials: 'SC', online: true }
  ];
}
