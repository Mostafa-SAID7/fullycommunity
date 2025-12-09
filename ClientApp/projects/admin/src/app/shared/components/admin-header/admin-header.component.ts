import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoButtonComponent } from '../logo-button/logo-button.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoButtonComponent],
  template: `
    <header class="bg-white/80 backdrop-blur-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div class="px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a routerLink="/admin/dashboard" class="flex items-center gap-3 transition-transform duration-200">
            <app-logo-button 
              text="CC" 
              [size]="48" 
              [fontSize]="24"
            ></app-logo-button>
            <span class="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">CommunityCar Admin</span>
          </a>
        </div>
        <div class="flex items-center gap-4">
          <button (click)="onToggleSidebar()"
                  class="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  aria-label="Open menu">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <ng-content></ng-content>
        </div>
      </div>
    </header>
  `
})
export class AdminHeaderComponent {
  toggleSidebar = output<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
