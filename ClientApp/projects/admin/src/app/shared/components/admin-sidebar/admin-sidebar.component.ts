import { Component, input, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="relative h-full">
      <nav [class.w-64]="isOpen()" 
           [class.w-16]="!isOpen()"
           class="transition-all duration-300 fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 overflow-hidden flex flex-col z-40 shadow-lg rounded-tr-xl"
           aria-label="Main navigation">
        
        <!-- Toggle Button - Fixed position between Dashboard and first icon -->
        <button (click)="toggleSidebar()" 
                [class.left-60]="isOpen()"
                [class.left-12]="!isOpen()"
                class="fixed z-[9999] bg-gradient-to-r from-primary to-primary-hover text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                style="top: calc(5rem + 7rem);">
          <svg class="w-4 h-4 transition-transform" [class.rotate-180]="!isOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <!-- Dashboard at top - Fixed -->
        <div class="flex-shrink-0 p-6 pb-4 bg-white border-b border-gray-100">
          <a routerLink="dashboard" routerLinkActive="active"
             [title]="!isOpen() ? 'Dashboard' : ''"
             class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150"
             [class.justify-center]="!isOpen()"
             [class.bg-gradient-to-r]="isLinkActive('dashboard')"
             [class.from-primary]="isLinkActive('dashboard')"
             [class.to-primary-hover]="isLinkActive('dashboard')"
             [class.text-white]="isLinkActive('dashboard')"
             [class.shadow-md]="isLinkActive('dashboard')"
             [class.text-gray-700]="!isLinkActive('dashboard')"
             [class.hover:bg-gray-50]="!isLinkActive('dashboard')">
            <svg class="w-5 h-5 flex-shrink-0" [class.text-white]="isLinkActive('dashboard')" [class.text-gray-500]="!isLinkActive('dashboard')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span *ngIf="isOpen()" class="font-medium whitespace-nowrap">Dashboard</span>
          </a>
        </div>

        <!-- Scrollable middle content -->
        <div class="flex-1 overflow-y-auto p-4 space-y-2" style="scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;">
        <!-- Management Section -->
        <div *ngIf="isOpen()">
          <button (click)="toggleSection('management')" 
                  class="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3 hover:text-gray-600 transition-colors">
            <span>Management</span>
            <svg class="w-4 h-4 transition-transform" [class.rotate-180]="!sections.management()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <ul class="space-y-1" [class.hidden]="!sections.management()">
            <li>
              <a routerLink="users" routerLinkActive="active"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                 [class.bg-gradient-to-r]="isLinkActive('users')"
                 [class.from-primary]="isLinkActive('users')"
                 [class.to-primary-hover]="isLinkActive('users')"
                 [class.text-white]="isLinkActive('users')"
                 [class.shadow-md]="isLinkActive('users')">
                <svg class="w-5 h-5 flex-shrink-0" [class.text-white]="isLinkActive('users')" [class.text-gray-500]="!isLinkActive('users')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <span class="font-medium whitespace-nowrap">User Management</span>
              </a>
            </li>
            <li>
              <a routerLink="content" routerLinkActive="active"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                 [class.bg-gradient-to-r]="isLinkActive('content')"
                 [class.from-primary]="isLinkActive('content')"
                 [class.to-primary-hover]="isLinkActive('content')"
                 [class.text-white]="isLinkActive('content')"
                 [class.shadow-md]="isLinkActive('content')">
                <svg class="w-5 h-5 flex-shrink-0" [class.text-white]="isLinkActive('content')" [class.text-gray-500]="!isLinkActive('content')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="font-medium whitespace-nowrap">Content Management</span>
              </a>
            </li>
            <li>
              <a routerLink="moderation" routerLinkActive="active"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                 [class.bg-gradient-to-r]="isLinkActive('moderation')"
                 [class.from-primary]="isLinkActive('moderation')"
                 [class.to-primary-hover]="isLinkActive('moderation')"
                 [class.text-white]="isLinkActive('moderation')"
                 [class.shadow-md]="isLinkActive('moderation')">
                <svg class="w-5 h-5 flex-shrink-0" [class.text-white]="isLinkActive('moderation')" [class.text-gray-500]="!isLinkActive('moderation')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span class="font-medium whitespace-nowrap">Moderation</span>
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Icon-only links when closed -->
        <div *ngIf="!isOpen()" class="space-y-3">
          <a routerLink="users" routerLinkActive="active" title="User Management"
             class="flex items-center justify-center px-2 py-3 rounded-lg transition-colors duration-150"
             [class.bg-gradient-to-r]="isLinkActive('users')"
             [class.from-primary]="isLinkActive('users')"
             [class.to-primary-hover]="isLinkActive('users')"
             [class.text-white]="isLinkActive('users')"
             [class.shadow-md]="isLinkActive('users')"
             [class.text-gray-700]="!isLinkActive('users')"
             [class.hover:bg-gray-50]="!isLinkActive('users')">
            <svg class="w-8 h-8" [class.text-white]="isLinkActive('users')" [class.text-gray-500]="!isLinkActive('users')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </a>
          <a routerLink="content" routerLinkActive="active" title="Content Management"
             class="flex items-center justify-center px-2 py-3 rounded-lg transition-colors duration-150"
             [class.bg-gradient-to-r]="isLinkActive('content')"
             [class.from-primary]="isLinkActive('content')"
             [class.to-primary-hover]="isLinkActive('content')"
             [class.text-white]="isLinkActive('content')"
             [class.shadow-md]="isLinkActive('content')"
             [class.text-gray-700]="!isLinkActive('content')"
             [class.hover:bg-gray-50]="!isLinkActive('content')">
            <svg class="w-8 h-8" [class.text-white]="isLinkActive('content')" [class.text-gray-500]="!isLinkActive('content')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </a>
          <a routerLink="moderation" routerLinkActive="active" title="Moderation"
             class="flex items-center justify-center px-2 py-3 rounded-lg transition-colors duration-150"
             [class.bg-gradient-to-r]="isLinkActive('moderation')"
             [class.from-primary]="isLinkActive('moderation')"
             [class.to-primary-hover]="isLinkActive('moderation')"
             [class.text-white]="isLinkActive('moderation')"
             [class.shadow-md]="isLinkActive('moderation')"
             [class.text-gray-700]="!isLinkActive('moderation')"
             [class.hover:bg-gray-50]="!isLinkActive('moderation')">
            <svg class="w-8 h-8" [class.text-white]="isLinkActive('moderation')" [class.text-gray-500]="!isLinkActive('moderation')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </a>
        </div>

        <!-- Analytics Section -->
        <div *ngIf="isOpen()">
          <button (click)="toggleSection('analytics')" 
                  class="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3 hover:text-gray-600 transition-colors">
            <span>Analytics</span>
            <svg class="w-4 h-4 transition-transform" [class.rotate-180]="!sections.analytics()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <ul class="space-y-1" [class.hidden]="!sections.analytics()">
            <li>
              <a routerLink="reports" routerLinkActive="active"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                 [class.bg-gradient-to-r]="isLinkActive('reports')"
                 [class.from-primary]="isLinkActive('reports')"
                 [class.to-primary-hover]="isLinkActive('reports')"
                 [class.text-white]="isLinkActive('reports')"
                 [class.shadow-md]="isLinkActive('reports')">
                <svg class="w-5 h-5 flex-shrink-0" [class.text-white]="isLinkActive('reports')" [class.text-gray-500]="!isLinkActive('reports')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span class="font-medium whitespace-nowrap">Reports & Analytics</span>
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Icon-only Reports when closed -->
        <div *ngIf="!isOpen()">
          <a routerLink="reports" routerLinkActive="active" title="Reports & Analytics"
             class="flex items-center justify-center px-2 py-3 rounded-lg transition-colors duration-150"
             [class.bg-gradient-to-r]="isLinkActive('reports')"
             [class.from-primary]="isLinkActive('reports')"
             [class.to-primary-hover]="isLinkActive('reports')"
             [class.text-white]="isLinkActive('reports')"
             [class.shadow-md]="isLinkActive('reports')"
             [class.text-gray-700]="!isLinkActive('reports')"
             [class.hover:bg-gray-50]="!isLinkActive('reports')">
            <svg class="w-8 h-8" [class.text-white]="isLinkActive('reports')" [class.text-gray-500]="!isLinkActive('reports')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </a>
        </div>

        <!-- Configuration Section -->
        <div *ngIf="isOpen()">
          <button (click)="toggleSection('configuration')" 
                  class="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3 hover:text-gray-600 transition-colors">
            <span>Configuration</span>
            <svg class="w-4 h-4 transition-transform" [class.rotate-180]="!sections.configuration()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <ul class="space-y-1" [class.hidden]="!sections.configuration()">
            <li>
              <a routerLink="settings" routerLinkActive="active"
                 class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150"
                 [class.bg-gradient-to-r]="isLinkActive('settings')"
                 [class.from-primary]="isLinkActive('settings')"
                 [class.to-primary-hover]="isLinkActive('settings')"
                 [class.text-white]="isLinkActive('settings')"
                 [class.shadow-md]="isLinkActive('settings')"
                 [class.text-gray-700]="!isLinkActive('settings')"
                 [class.hover:bg-gray-50]="!isLinkActive('settings')">
                <svg class="w-5 h-5 flex-shrink-0" [class.text-white]="isLinkActive('settings')" [class.text-gray-500]="!isLinkActive('settings')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="font-medium whitespace-nowrap">System Settings</span>
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Icon-only Settings when closed -->
        <div *ngIf="!isOpen()">
          <a routerLink="settings" routerLinkActive="active" title="System Settings"
             class="flex items-center justify-center px-2 py-3 rounded-lg transition-colors duration-150"
             [class.bg-gradient-to-r]="isLinkActive('settings')"
             [class.from-primary]="isLinkActive('settings')"
             [class.to-primary-hover]="isLinkActive('settings')"
             [class.text-white]="isLinkActive('settings')"
             [class.shadow-md]="isLinkActive('settings')"
             [class.text-gray-700]="!isLinkActive('settings')"
             [class.hover:bg-gray-50]="!isLinkActive('settings')">
            <svg class="w-8 h-8" [class.text-white]="isLinkActive('settings')" [class.text-gray-500]="!isLinkActive('settings')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </a>
        </div>

        </div>

        <!-- My Profile at bottom - Fixed -->
        <div class="flex-shrink-0 p-4 pt-2 bg-white border-t border-gray-100">
          <a routerLink="profile" routerLinkActive="active"
             [title]="!isOpen() ? 'My Profile' : ''"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150"
             [class.justify-center]="!isOpen()"
             [class.bg-gradient-to-r]="isLinkActive('profile')"
             [class.from-primary]="isLinkActive('profile')"
             [class.to-primary-hover]="isLinkActive('profile')"
             [class.text-white]="isLinkActive('profile')"
             [class.shadow-md]="isLinkActive('profile')"
             [class.text-gray-700]="!isLinkActive('profile')"
             [class.hover:bg-gray-50]="!isLinkActive('profile')">
            <svg class="w-5 h-5 flex-shrink-0" [class.text-white]="isLinkActive('profile')" [class.text-gray-500]="!isLinkActive('profile')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span *ngIf="isOpen()" class="font-medium whitespace-nowrap">My Profile</span>
          </a>
        </div>
      </nav>
    </div>
  `
})
export class AdminSidebarComponent {
  sidebarClasses = input.required<string>();
  sidebarToggled = output<boolean>();
  private router: Router;

  // Sidebar open state
  isOpen = signal(true);

  // All sections open by default
  sections = {
    management: signal(true),
    analytics: signal(true),
    configuration: signal(true)
  };

  constructor(router: Router) {
    this.router = router;
  }

  toggleSidebar(): void {
    this.isOpen.update(value => !value);
    this.sidebarToggled.emit(this.isOpen());
  }

  toggleSection(section: keyof typeof this.sections): void {
    this.sections[section].update(value => !value);
  }

  isLinkActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
