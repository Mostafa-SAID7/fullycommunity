import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a routerLink="/admin/dashboard" class="flex items-center gap-3 hover:scale-105 transition-transform duration-200">
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
              🚗
            </div>
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
