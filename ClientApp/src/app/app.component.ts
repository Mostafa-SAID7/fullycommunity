import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    main { padding: 2rem 0; }
  `]
})
export class AppComponent {}
