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
  @Input() maxWidth = '1400px';
  @Input() contentPadding = '1rem';
  @Input() gap = '1rem';
  @Input() leftSidebarWidth = '280px';
  @Input() rightSidebarWidth = '320px';

  getGridColumns(): string {
    const columns: string[] = [];
    
    if (this.showLeftSidebar) {
      columns.push(this.leftSidebarWidth);
    }
    
    columns.push('1fr');
    
    if (this.showRightSidebar) {
      columns.push(this.rightSidebarWidth);
    }
    
    return columns.join(' ');
  }
}
