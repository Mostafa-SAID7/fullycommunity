import { Component, Input, ViewChild, signal } from '@angular/core';
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
  @ViewChild(LeftSidebarComponent) leftSidebar?: LeftSidebarComponent;
  
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

  // Track sidebar expanded state for margin calculation
  isSidebarExpanded = signal(true);

  onSidebarToggle(expanded: boolean) {
    this.isSidebarExpanded.set(expanded);
  }
}
