import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '../../../core/services/localization.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1">
      <!-- Language Buttons -->
      <div class="flex items-center gap-0.5 bg-gray-100/50 dark:bg-gray-800/50 rounded-md p-0.5">
        <button
          (click)="setLanguage('en')"
          [class.bg-white]="localization.currentLang() === 'en'"
          [class.dark:bg-gray-700]="localization.currentLang() === 'en'"
          [class.shadow-sm]="localization.currentLang() === 'en'"
          [class.text-primary]="localization.currentLang() === 'en'"
          class="px-2.5 py-1 rounded text-xs font-medium transition-all hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
          En
        </button>
        <button
          (click)="setLanguage('ar')"
          [class.bg-white]="localization.currentLang() === 'ar'"
          [class.dark:bg-gray-700]="localization.currentLang() === 'ar'"
          [class.shadow-sm]="localization.currentLang() === 'ar'"
          [class.text-primary]="localization.currentLang() === 'ar'"
          class="px-2.5 py-1 rounded text-xs font-medium transition-all hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
          Ar
        </button>
      </div>

      <!-- Theme Switcher -->
      <button
        (click)="toggleTheme()"
        class="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all"
        [attr.aria-label]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'">
        <!-- Sun Icon (Light Mode) -->
        <svg *ngIf="!isDarkMode()" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <!-- Moon Icon (Dark Mode) -->
        <svg *ngIf="isDarkMode()" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LanguageSwitcherComponent {
  localization = inject(LocalizationService);
  isDarkMode = signal(false);

  constructor() {
    // Initialize theme from localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));
      this.applyTheme();
    }
  }

  setLanguage(langCode: string): void {
    if (langCode !== this.localization.currentLang()) {
      this.localization.setLanguage(langCode);
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(v => !v);
    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (this.isDarkMode()) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }
}