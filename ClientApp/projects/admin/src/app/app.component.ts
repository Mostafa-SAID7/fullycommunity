import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  host: {
    class: 'block min-h-screen bg-background'
  }
})
export class AppComponent {
}
