import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from '../../../shared/components/sidebar-layout/sidebar-layout.component';
import { SidebarMenuItem, SidebarShortcut } from '../../../shared/components/left-sidebar/left-sidebar.component';
import { SponsoredItem, EventReminder, Contact } from '../../../shared/components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-marketplace-layout',
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
export class MarketplaceLayoutComponent {
  leftMenuItems: SidebarMenuItem[] = [
    { icon: 'home', label: 'Browse All', route: '/marketplace', exact: true },
    { icon: 'sell', label: 'Sell', route: '/marketplace/sell' },
    { icon: 'auctions', label: 'Auctions', route: '/marketplace/auctions' },
    { icon: 'orders', label: 'Your Orders', route: '/marketplace/orders' },
    { icon: 'wishlist', label: 'Wishlist', route: '/marketplace/wishlist' },
    { icon: 'shop', label: 'Your Listings', route: '/marketplace/my-listings' },
    { icon: 'saved', label: 'Saved Searches', route: '/marketplace/saved-searches' }
  ];

  shortcuts: SidebarShortcut[] = [
    { id: 'parts', name: 'Car Parts', image: '/assets/marketplace/parts.jpg', type: 'marketplace/category' },
    { id: 'accessories', name: 'Accessories', image: '/assets/marketplace/accessories.jpg', type: 'marketplace/category' },
    { id: 'tools', name: 'Tools & Equipment', image: '/assets/marketplace/tools.jpg', type: 'marketplace/category' }
  ];

  sponsoredItems: SponsoredItem[] = [
    { id: '1', title: 'Premium Auto Parts Store', url: 'autoparts.com', image: '/assets/ads/auto-parts.jpg' },
    { id: '2', title: 'Car Accessories Hub', url: 'caraccessories.com', image: '/assets/ads/car-accessories.jpg' }
  ];

  events: EventReminder[] = [
    { id: '1', title: 'Car Parts Sale - 50% Off', time: 'Ends Tomorrow' },
    { id: '2', title: 'Classic Car Auction', time: 'Saturday at 2:00 PM' }
  ];

  contacts: Contact[] = [
    { id: '1', name: 'Parts Dealer Pro', initials: 'PD', online: true },
    { id: '2', name: 'Auto Seller', initials: 'AS', online: true },
    { id: '3', name: 'Classic Cars Inc', initials: 'CC', online: false },
    { id: '4', name: 'Speed Shop', initials: 'SS', online: true }
  ];
}
