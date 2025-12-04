import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SponsoredItem {
  id: string;
  title: string;
  url: string;
  image: string;
}

export interface EventReminder {
  id: string;
  title: string;
  time: string;
  icon?: string;
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  online: boolean;
  avatar?: string;
}

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './right-sidebar.component.html'
})
export class RightSidebarComponent {
  @Input() sponsoredItems: SponsoredItem[] = [];
  @Input() events: EventReminder[] = [];
  @Input() contacts: Contact[] = [];
  @Input() showSponsored = true;
  @Input() showEvents = true;
  @Input() showContacts = true;
}
