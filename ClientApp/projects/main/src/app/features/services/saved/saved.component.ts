import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="saved-page">
      <h1>Saved Services</h1>
      <p>Your saved garages, stations, and experts</p>
      <div class="placeholder">No saved services yet</div>
    </div>
  `,
  styles: [`
    .saved-page { padding: 1.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; }
    p { color: #65676b; margin: 0 0 1.5rem; }
    .placeholder { padding: 3rem; text-align: center; background: #f0f2f5; border-radius: 12px; color: #65676b; }
  `]
})
export class SavedComponent {}
