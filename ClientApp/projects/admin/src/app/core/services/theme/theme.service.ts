import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';
export type ColorScheme = 'light' | 'dark';

export interface ThemeConfig {
  theme: Theme;
  colorScheme: ColorScheme;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signals for reactive theme management
  private themeSignal = signal<Theme>('light');
  private colorSchemeSignal = signal<ColorScheme>('light');
  private accentColorSignal = signal<string>('#0066FF');
  private fontSizeSignal = signal<'small' | 'medium' | 'large'>('medium');
  private reducedMotionSignal = signal<boolean>(false);
  private highContrastSignal = signal<boolean>(false);

  // Observables for compatibility
  private themeSubject = new BehaviorSubject<Theme>('light');
  private colorSchemeSubject = new BehaviorSubject<ColorScheme>('light');

  // Public readonly signals
  public readonly theme = this.themeSignal.asReadonly();
  public readonly colorScheme = this.colorSchemeSignal.asReadonly();
  public readonly accentColor = this.accentColorSignal.asReadonly();
  public readonly fontSize = this.fontSizeSignal.asReadonly();
  public readonly reducedMotion = this.reducedMotionSignal.asReadonly();
  public readonly highContrast = this.highContrastSignal.asReadonly();

  // Public observables
  public readonly theme$ = this.themeSubject.asObservable();
  public readonly colorScheme$ = this.colorSchemeSubject.asObservable();

  private readonly STORAGE_KEY = 'cc-theme-config';
  private mediaQuery?: MediaQueryList;

  constructor() {
    if (this.isBrowser) {
      this.initializeTheme();
      this.setupMediaQueryListener();
      this.setupEffects();
    }
  }

  private initializeTheme(): void {
    // Load saved theme configuration
    const savedConfig = this.loadThemeConfig();

    if (savedConfig) {
      // Validate theme - if stored value is 'auto' or invalid, default to 'light'
      const validTheme = (savedConfig.theme === 'dark') ? 'dark' : 'light';
      this.themeSignal.set(validTheme);
      
      this.accentColorSignal.set(savedConfig.accentColor);
      this.fontSizeSignal.set(savedConfig.fontSize);
      this.reducedMotionSignal.set(savedConfig.reducedMotion);
      this.highContrastSignal.set(savedConfig.highContrast);
    }

    // Detect system preferences
    this.detectSystemPreferences();

    // Apply initial theme
    this.updateColorScheme();
    this.applyTheme();
  }

  private setupMediaQueryListener(): void {
    if (!this.isBrowser) return;
    // Auto-theme listener removed
  }

  private setupEffects(): void {
    // Effect to update color scheme when theme changes
    effect(() => {
      this.updateColorScheme();
      this.applyTheme();
      this.saveThemeConfig();
    });

    // Effect to sync observables with signals
    effect(() => {
      this.themeSubject.next(this.themeSignal());
      this.colorSchemeSubject.next(this.colorSchemeSignal());
    });
  }

  private detectSystemPreferences(): void {
    if (!this.isBrowser) return;

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.reducedMotionSignal.set(prefersReducedMotion);

    // Detect high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    this.highContrastSignal.set(prefersHighContrast);
  }

  private updateColorScheme(): void {
    const theme = this.themeSignal();
    let colorScheme: ColorScheme;

    colorScheme = theme as ColorScheme;

    this.colorSchemeSignal.set(colorScheme);
  }

  private getSystemColorScheme(): ColorScheme {
    if (!this.isBrowser) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(): void {
    if (!this.isBrowser) return;

    const colorScheme = this.colorSchemeSignal();
    const accentColor = this.accentColorSignal();
    const fontSize = this.fontSizeSignal();
    const reducedMotion = this.reducedMotionSignal();
    const highContrast = this.highContrastSignal();

    const html = document.documentElement;
    const body = document.body;

    // Apply color scheme
    html.classList.toggle('dark', colorScheme === 'dark');
    html.setAttribute('data-theme', colorScheme);

    // Apply accent color as CSS custom property
    html.style.setProperty('--color-primary', accentColor);

    // Apply font size
    html.setAttribute('data-font-size', fontSize);
    body.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (fontSize) {
      case 'small':
        body.classList.add('text-sm');
        break;
      case 'medium':
        body.classList.add('text-base');
        break;
      case 'large':
        body.classList.add('text-lg');
        break;
    }

    // Apply accessibility preferences
    html.classList.toggle('reduce-motion', reducedMotion);
    html.classList.toggle('high-contrast', highContrast);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(colorScheme);
  }

  private updateMetaThemeColor(colorScheme: ColorScheme): void {
    if (!this.isBrowser) return;

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = colorScheme === 'dark' ? '#0F0F0F' : '#FFFFFF';

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }

  private loadThemeConfig(): ThemeConfig | null {
    if (!this.isBrowser) return null;

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  private saveThemeConfig(): void {
    if (!this.isBrowser) return;

    const config: ThemeConfig = {
      theme: this.themeSignal(),
      colorScheme: this.colorSchemeSignal(),
      accentColor: this.accentColorSignal(),
      fontSize: this.fontSizeSignal(),
      reducedMotion: this.reducedMotionSignal(),
      highContrast: this.highContrastSignal()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Handle storage errors silently
    }
  }

  // Public methods
  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  setAccentColor(color: string): void {
    this.accentColorSignal.set(color);
  }

  setFontSize(size: 'small' | 'medium' | 'large'): void {
    this.fontSizeSignal.set(size);
  }

  setReducedMotion(enabled: boolean): void {
    this.reducedMotionSignal.set(enabled);
  }

  setHighContrast(enabled: boolean): void {
    this.highContrastSignal.set(enabled);
  }

  toggleTheme(): void {
    const current = this.themeSignal();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  resetToDefaults(): void {
    this.themeSignal.set('light');
    this.accentColorSignal.set('#0066FF');
    this.fontSizeSignal.set('medium');
    this.reducedMotionSignal.set(false);
    this.highContrastSignal.set(false);
  }

  getThemeConfig(): ThemeConfig {
    return {
      theme: this.themeSignal(),
      colorScheme: this.colorSchemeSignal(),
      accentColor: this.accentColorSignal(),
      fontSize: this.fontSizeSignal(),
      reducedMotion: this.reducedMotionSignal(),
      highContrast: this.highContrastSignal()
    };
  }

  // Utility methods
  isDark(): boolean {
    return this.colorSchemeSignal() === 'dark';
  }

  isLight(): boolean {
    return this.colorSchemeSignal() === 'light';
  }

  // Auto check removed
}
