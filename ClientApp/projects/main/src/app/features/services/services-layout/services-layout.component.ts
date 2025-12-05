import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarLayoutComponent } from '../../../shared/components/sidebar-layout/sidebar-layout.component';
import { SidebarMenuItem, SidebarShortcut } from '../../../shared/components/left-sidebar/left-sidebar.component';

@Component({
  selector: 'app-services-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarLayoutComponent],
  template: `
    <app-sidebar-layout
      [leftMenuItems]="menuItems"
      [shortcuts]="shortcuts"
      [showRightSidebar]="true"
      contentWidth="wide"
    >
      <router-outlet></router-outlet>
    </app-sidebar-layout>
  `
})
export class ServicesLayoutComponent {
  menuItems: SidebarMenuItem[] = [
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
