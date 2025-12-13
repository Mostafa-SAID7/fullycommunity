import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './logo-button.component.html',
  styleUrl: './logo-button.component.scss'
})
export class LogoButtonComponent {
  @Input() text: string = 'CC';
  @Input() size: number | string = 96;
  @Input() fontSize: number = 48;
  @Input() containerClasses: string = '';
  @Input() textClasses: string = '';
  @Input() showText: boolean = true;
  @Input() brandName: string = '';
  @Input() subtitle: string = '';
  @Input() routerLink: string | null = null;

  get logoSize(): number {
    if (typeof this.size === 'string') {
      switch (this.size) {
        case 'sm': return 48;
        case 'md': return 64;
        case 'lg': return 96;
        case 'xl': return 128;
        default: return 96;
      }
    }
    return this.size;
  }

  get logoFontSize(): number {
    return Math.floor(this.logoSize * 0.5);
  }
}
