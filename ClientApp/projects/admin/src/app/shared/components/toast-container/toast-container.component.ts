import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <!-- Toast notifications will be added here when toast service is implemented -->
    </div>
  `,
  styles: [`
    :host {
      pointer-events: none;
    }
    
    .fixed > * {
      pointer-events: auto;
    }
  `]
})
export class ToastContainerComponent {
}
