import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'admin-theme';
  
  // Signals for reactive theme management
  theme = signal<Theme>('auto');
  isDark = signal<boolean>(false);
  
  constructor() {
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
  
  setTheme(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
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
    const theme = this.theme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let shouldBeDark = false;
    
    if (theme === 'dark') {
      shouldBeDark = true;
    } else if (theme === 'auto') {
      shouldBeDark = prefersDark;
    }
    
    this.isDark.set(shouldBeDark);
    
    // Update document class
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(shouldBeDark);
  }
  
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.theme() === 'auto') {
        this.updateTheme();
      }
    });
  }
  
  private updateMetaThemeColor(isDark: boolean): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1e293b' : '#ffffff');
    }
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