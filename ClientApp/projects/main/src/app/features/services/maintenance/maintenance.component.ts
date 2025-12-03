import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="maintenance-page">
      <h1>Maintenance</h1>
      <p>Schedule and track your vehicle maintenance</p>
      <div class="placeholder">Coming soon...</div>
    </div>
  `,
  styles: [`
    .maintenance-page { padding: 1.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; }
    p { color: #65676b; margin: 0 0 1.5rem; }
    .placeholder { padding: 3rem; text-align: center; background: #f0f2f5; border-radius: 12px; color: #65676b; }
  `]
})
export class MaintenanceComponent {}
