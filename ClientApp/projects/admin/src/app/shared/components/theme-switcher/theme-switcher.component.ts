import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button
        (click)="toggleDropdown()"
        class="theme-switcher-btn"
        [title]="themeService.getThemeLabel()"
        type="button">
        
        <!-- Theme Icon -->
        <span class="theme-icon">{{ themeService.getThemeIcon() }}</span>
        
        <!-- Dropdown Arrow -->
        <svg 
          class="dropdown-arrow"
          [class.rotate-180]="showDropdown"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      
      <!-- Dropdown Menu -->
      <div 
        *ngIf="showDropdown"
        class="theme-dropdown"
        (click)="$event.stopPropagation()">
        
        <div class="dropdown-header">
          <span class="dropdown-title">Theme</span>
        </div>
        
        <div class="dropdown-options">
          <button
            *ngFor="let option of themeOptions"
            (click)="selectTheme(option.value)"
            class="theme-option"
            [class.active]="themeService.theme() === option.value">
            
            <span class="option-icon">{{ option.icon }}</span>
            <span class="option-label">{{ option.label }}</span>
            
            <!-- Active Indicator -->
            <svg 
              *ngIf="themeService.theme() === option.value"
              class="active-indicator"
              fill="currentColor" 
              viewBox="0 0 20 20">
              <path 
                fill-rule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        
        <div class="dropdown-footer">
          <span class="footer-text">
            Current: {{ themeService.isDark() ? 'Dark' : 'Light' }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div 
      *ngIf="showDropdown"
      class="theme-backdrop"
      (click)="closeDropdown()">
    </div>
  `,
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
  
  showDropdown = false;
  
  themeOptions = [
    { value: 'light' as Theme, label: 'Light', icon: '☀️' },
    { value: 'dark' as Theme, label: 'Dark', icon: '🌙' },
    { value: 'auto' as Theme, label: 'Auto', icon: '🔄' }
  ];
  
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  
  closeDropdown(): void {
    this.showDropdown = false;
  }
  
  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.closeDropdown();
  }
}