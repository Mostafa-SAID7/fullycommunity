import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { ThemeService } from './core/services/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  host: {
    class: 'admin-app'
  }
})
export class AppComponent {
  private themeService = inject(ThemeService);
}
