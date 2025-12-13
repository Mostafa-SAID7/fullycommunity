import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);

  themeIcon = computed(() => {
    switch (this.themeService.theme()) {
      case 'light': return 'fa-sun';
      case 'dark': return 'fa-moon';
      default: return 'fa-sun';
    }
  });

  themeLabel = computed(() => {
    switch (this.themeService.theme()) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      default: return 'Light Mode';
    }
  });

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}