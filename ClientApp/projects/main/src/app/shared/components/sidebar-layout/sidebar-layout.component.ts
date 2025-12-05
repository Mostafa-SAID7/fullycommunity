import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeftSidebarComponent, type SidebarMenuItem, type SidebarShortcut } from '../left-sidebar/left-sidebar.component';
import { RightSidebarComponent, type SponsoredItem, type EventReminder, type Contact } from '../right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LeftSidebarComponent, RightSidebarComponent],
  templateUrl: './sidebar-layout.component.html'
})
export class SidebarLayoutComponent {
  // Left sidebar props
  @Input() leftMenuItems: SidebarMenuItem[] = [];
  @Input() shortcuts: SidebarShortcut[] = [];
  @Input() showUserProfile = true;
  @Input() showFooter = true;
  @Input() showLeftSidebar = true;

  // Right sidebar props
  @Input() sponsoredItems: SponsoredItem[] = [];
  @Input() events: EventReminder[] = [];
  @Input() contacts: Contact[] = [];
  @Input() showSponsored = true;
  @Input() showEvents = true;
  @Input() showContacts = true;
  @Input() showRightSidebar = true;

  // Layout props
  @Input() contentWidth: 'narrow' | 'medium' | 'wide' | 'full' = 'medium';
  @Input() centerContent = true;

  // Track sidebar expanded state for margin calculation
  // Default to collapsed on small screens, expanded on large screens
  sidebarExpanded = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  getContentMaxWidth(): string {
    switch (this.contentWidth) {
      case 'narrow': return '680px';  // Facebook feed style
      case 'medium': return '900px';  // Default
      case 'wide': return '1200px';   // Videos/grid style
      case 'full': return '100%';     // Full width
      default: return '900px';
    }
  }

  onSidebarToggle(expanded: boolean) {
    this.sidebarExpanded = expanded;
  }
}
