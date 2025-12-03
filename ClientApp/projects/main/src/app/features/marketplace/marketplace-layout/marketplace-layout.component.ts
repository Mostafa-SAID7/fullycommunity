import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionLayoutComponent, MenuItem, SidebarShortcut } from '../../../shared/components/section-layout/section-layout.component';

@Component({
  selector: 'app-marketplace-layout',
  standalone: true,
  imports: [CommonModule, SectionLayoutComponent],
  template: `
    <app-section-layout
      sectionTitle="Marketplace"
      sectionIcon="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      [menuItems]="menuItems"
      [shortcuts]="shortcuts"
      [showRightSidebar]="true"
      rightSidebarContent="marketplace"
    />
  `
})
export class MarketplaceLayoutComponent {
  menuItems: MenuItem[] = [
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
}
