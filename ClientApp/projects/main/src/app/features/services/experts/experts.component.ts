import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="experts-page">
      <h1>Ask an Expert</h1>
      <p>Get professional advice from car experts</p>
      <div class="placeholder">Coming soon...</div>
    </div>
  `,
  styles: [`
    .experts-page { padding: 1.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; }
    p { color: #65676b; margin: 0 0 1.5rem; }
    .placeholder { padding: 3rem; text-align: center; background: #f0f2f5; border-radius: 12px; color: #65676b; }
  `]
})
export class ExpertsComponent {}
