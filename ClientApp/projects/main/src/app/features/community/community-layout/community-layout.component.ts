import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from '../../../shared/components/sidebar-layout/sidebar-layout.component';
import { type SidebarMenuItem, type SidebarShortcut } from '../../../shared/components/left-sidebar/left-sidebar.component';
import { type SponsoredItem, type EventReminder, type Contact } from '../../../shared/components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-community-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayoutComponent],
  templateUrl: './community-layout.component.html',
})
export class CommunityLayoutComponent {
  leftMenuItems: SidebarMenuItem[] = [
    { icon: 'feed', label: 'News Feed', route: '/community', exact: true },
    { icon: 'friends', label: 'Friends', route: '/community/friends' },
    { icon: 'groups', label: 'Groups', route: '/community/groups' },
    { icon: 'events', label: 'Events', route: '/community/events' },
    { icon: 'qa', label: 'Q&A Forum', route: '/community/qa' },
    { icon: 'guides', label: 'Guides', route: '/community/guides' },
    { icon: 'reviews', label: 'Reviews', route: '/community/reviews' },
    { icon: 'news', label: 'News', route: '/community/news' },
    { icon: 'maps', label: 'Maps', route: '/community/maps' },
    { icon: 'saved', label: 'Saved', route: '/community/saved' },
    { icon: 'videos', label: 'Videos', route: '/videos' },
    { icon: 'marketplace', label: 'Marketplace', route: '/marketplace' }
  ];

  shortcuts: SidebarShortcut[] = [
    { id: '1', name: 'Car Enthusiasts', image: '/assets/groups/car-enthusiasts.jpg', type: 'group' },
    { id: '2', name: 'DIY Mechanics', image: '/assets/groups/diy-mechanics.jpg', type: 'group' },
    { id: '3', name: 'Electric Vehicles', image: '/assets/groups/ev-club.jpg', type: 'group' }
  ];

  sponsoredItems: SponsoredItem[] = [
    { id: '1', title: 'Premium Car Parts', url: 'autoparts.com', image: '/assets/ads/car-parts.jpg' }
  ];

  events: EventReminder[] = [
    { id: '1', title: 'Car Meet - Downtown', time: 'Tomorrow at 6:00 PM' }
  ];

  contacts: Contact[] = [
    { id: '1', name: 'John Doe', initials: 'JD', online: true },
    { id: '2', name: 'Alice Smith', initials: 'AS', online: true },
    { id: '3', name: 'Bob Johnson', initials: 'BJ', online: false },
    { id: '4', name: 'Mike Wilson', initials: 'MW', online: true }
  ];
}
