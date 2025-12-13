import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copyright',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="copyright-container">
      <p class="copyright-text">
        © {{ currentYear }} Community Car. All rights reserved.
      </p>
    </div>
  `,
  styleUrl: './copyright.component.scss'
})
export class CopyrightComponent {
  currentYear = new Date().getFullYear();
}