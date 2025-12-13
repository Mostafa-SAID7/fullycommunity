import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'admin-theme';
  private platformId = inject(PLATFORM_ID);

  // Signals for reactive theme management
  theme = signal<Theme>('light');
  isDark = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load saved theme or default to light
      const savedTheme = (localStorage.getItem(this.THEME_KEY) as Theme) || 'light';
      // Validate saved theme
      const validTheme = ['light', 'dark'].includes(savedTheme) ? savedTheme : 'light';
      this.theme.set(validTheme);

      // Set up effect to update DOM when theme changes
      effect(() => {
        this.updateTheme();
      });

      // Initialize theme
      this.updateTheme();
    }
  }

  setTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      this.theme.set(theme);
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  toggleTheme(): void {
    const currentTheme = this.theme();
    this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }

  private updateTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const theme = this.theme();
    const isDark = theme === 'dark';

    this.isDark.set(isDark);

    // Always remove dark class first, then add if needed
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('dark');

    // Update document class and attribute
    if (isDark) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.setAttribute('data-theme', 'light');
    }

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(isDark);
  }

  private updateMetaThemeColor(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', isDark ? '#1e293b' : '#ffffff');
  }

  getThemeIcon(): string {
    const theme = this.theme();
    return theme === 'light' ? 'fa-sun' : 'fa-moon';
  }

  getThemeLabel(): string {
    const theme = this.theme();
    return theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  }
}