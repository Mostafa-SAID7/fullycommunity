import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
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