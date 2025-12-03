import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionLayoutComponent, MenuItem, SidebarShortcut } from '../../../shared/components/section-layout/section-layout.component';

@Component({
  selector: 'app-services-layout',
  standalone: true,
  imports: [CommonModule, SectionLayoutComponent],
  template: `
    <app-section-layout
      sectionTitle="Services"
      sectionIcon="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"
      [menuItems]="menuItems"
      [shortcuts]="shortcuts"
      [showRightSidebar]="true"
      rightSidebarContent="services"
    />
  `
})
export class ServicesLayoutComponent {
  menuItems: MenuItem[] = [
    { icon: 'home', label: 'All Services', route: '/services', exact: true },
    { icon: 'garage', label: 'Find Garages', route: '/services/garages' },
    { icon: 'fuel', label: 'Fuel & Charging', route: '/services/fuel' },
    { icon: 'expert', label: 'Ask an Expert', route: '/services/experts' },
    { icon: 'services', label: 'Maintenance', route: '/services/maintenance' },
    { icon: 'saved', label: 'Saved Services', route: '/services/saved' }
  ];

  shortcuts: SidebarShortcut[] = [
    { id: 'nearby', name: 'Nearby Garages', image: '/assets/services/garage.jpg', type: 'services/garages' },
    { id: 'charging', name: 'EV Charging', image: '/assets/services/charging.jpg', type: 'services/fuel' },
    { id: 'experts', name: 'Top Experts', image: '/assets/services/expert.jpg', type: 'services/experts' }
  ];
}
