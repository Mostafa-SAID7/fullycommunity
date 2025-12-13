import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
  host: {
    '[class.sidebar-open]': 'isOpen()',
    '[class.sidebar-closed]': '!isOpen()'
  }
})
export class AdminSidebarComponent {
  sidebarClasses = input.required<string>();
  isOpen = input.required<boolean>(); // Receive sidebar state from parent
  private router: Router;

  // All sections open by default
  sections = {
    management: signal(true),
    analytics: signal(true),
    system: signal(true)
  };

  constructor(router: Router) {
    this.router = router;
  }

  toggleSection(section: keyof typeof this.sections): void {
    this.sections[section].update(value => !value);
  }

  isLinkActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}