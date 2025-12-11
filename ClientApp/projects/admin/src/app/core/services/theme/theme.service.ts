import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'admin-theme';
  private platformId = inject(PLATFORM_ID);
  private mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;
  
  // Signals for reactive theme management
  theme = signal<Theme>('auto');
  isDark = signal<boolean>(false);
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load saved theme or default to auto
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme || 'auto';
      this.theme.set(savedTheme);
      
      // Set up effect to update DOM when theme changes
      effect(() => {
        this.updateTheme();
      });
      
      // Listen for system theme changes
      this.setupSystemThemeListener();
      
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
    if (currentTheme === 'light') {
      this.setTheme('dark');
    } else if (currentTheme === 'dark') {
      this.setTheme('auto');
    } else {
      this.setTheme('light');
    }
  }
  
  private updateTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const theme = this.theme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let shouldBeDark = false;
    
    if (theme === 'dark') {
      shouldBeDark = true;
    } else if (theme === 'auto') {
      shouldBeDark = prefersDark;
    } else if (theme === 'light') {
      shouldBeDark = false;
    }
    
    this.isDark.set(shouldBeDark);
    
    // Always remove dark class first, then add if needed
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('dark');
    
    // Update document class and attribute
    if (shouldBeDark) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.setAttribute('data-theme', 'light');
    }
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(shouldBeDark);
  }
  
  private setupSystemThemeListener(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Remove existing listener if any
    if (this.mediaQueryListener) {
      mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
    
    // Create new listener
    this.mediaQueryListener = () => {
      if (this.theme() === 'auto') {
        this.updateTheme();
      }
    };
    
    mediaQuery.addEventListener('change', this.mediaQueryListener);
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
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '🔄';
    }
  }
  
  getThemeLabel(): string {
    const theme = this.theme();
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'auto':
        return 'Auto Mode';
      default:
        return 'Auto Mode';
    }
  }
}