import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { RefreshButtonComponent } from '../refresh-button/refresh-button.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ThemeSwitcherComponent, RefreshButtonComponent],
  template: `
    <header class="admin-header">
      <!-- Left Section -->
      <div class="header-left">
        <!-- Mobile Menu Toggle -->
        <button 
          (click)="toggleSidebar.emit()"
          class="mobile-menu-toggle lg:hidden"
          type="button"
          aria-label="Toggle sidebar">
          <svg class="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        
        <!-- Logo and Brand -->
        <div class="header-brand">
          <a routerLink="/admin" class="brand-link">
            <div class="brand-logo">
              <svg class="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <span class="brand-text">Admin Panel</span>
          </a>
        </div>
      </div>
      
      <!-- Center Section -->
      <div class="header-center">
        <!-- Search Bar -->
        <div class="header-search">
          <div class="search-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              class="search-input"
              [(ngModel)]="searchQuery"
              (keyup.enter)="performSearch()">
            <button 
              *ngIf="searchQuery"
              (click)="clearSearch()"
              class="search-clear"
              type="button">
              <svg class="clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right Section -->
      <div class="header-right">
        <!-- Quick Actions -->
        <div class="header-actions">
          <!-- Refresh Button -->
          <app-refresh-button
            (refresh)="refreshData()"
            [loading]="isRefreshing"
            [variant]="'ghost'"
            [size]="'md'"
            [showText]="false"
            [title]="'Refresh Dashboard Data'">
          </app-refresh-button>
          
          <!-- Notifications -->
          <button 
            class="action-btn notification-btn"
            [class.has-notifications]="notificationCount > 0"
            (click)="toggleNotifications()"
            type="button"
            [title]="'Notifications (' + notificationCount + ')'">
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span *ngIf="notificationCount > 0" class="notification-badge">
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </span>
          </button>
          
          <!-- Theme Switcher -->
          <app-theme-switcher></app-theme-switcher>
          
          <!-- Settings -->
          <button 
            class="action-btn"
            routerLink="/admin/settings"
            type="button"
            title="Settings">
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>
        
        <!-- User Profile -->
        <div class="header-profile">
          <button 
            (click)="toggleProfileMenu()"
            class="profile-btn"
            type="button">
            <img 
              [src]="userAvatar" 
              [alt]="userName"
              class="profile-avatar"
              onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOTQ5NEM0Ii8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDIwIDQgMTYuNjcgNCAxNEM0IDEzLjQ1IDQuNDUgMTMgNSAxM0gxOUMxOS41NSAxMyAyMCAxMy40NSAyMCAxNEMyMCAxNi42NyAxNi42NyAyMCAxMiAyMFoiIGZpbGw9IiM5NDk0QzQiLz4KPC9zdmc+'">
            <div class="profile-info">
              <span class="profile-name">{{ userName }}</span>
              <span class="profile-role">{{ userRole }}</span>
            </div>
            <svg class="profile-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
        
        <!-- Content Projection for Additional Actions -->
        <ng-content></ng-content>
      </div>
    </header>
  `,
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {
  // Outputs
  toggleSidebar = output<void>();
  
  // Component state
  searchQuery = '';
  isRefreshing = false;
  notificationCount = 3;
  
  // User info (would come from auth service in real app)
  userName = 'Admin User';
  userRole = 'Super Admin';
  userAvatar = '';
  
  performSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search logic
    }
  }
  
  clearSearch(): void {
    this.searchQuery = '';
  }
  
  refreshData(): void {
    this.isRefreshing = true;
    // Simulate refresh
    setTimeout(() => {
      this.isRefreshing = false;
    }, 2000);
  }
  
  toggleNotifications(): void {
    console.log('Toggle notifications');
    // Implement notifications logic
  }
  
  toggleProfileMenu(): void {
    console.log('Toggle profile menu');
    // Implement profile menu logic
  }
}