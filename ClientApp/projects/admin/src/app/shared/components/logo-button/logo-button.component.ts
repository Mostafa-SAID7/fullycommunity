import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="logo-button-container">
      <a [routerLink]="routerLink" class="logo-button" [class.no-link]="!routerLink">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="logo-text" *ngIf="showText">
          <span class="brand-name">{{ brandName }}</span>
          <span class="brand-subtitle" *ngIf="subtitle">{{ subtitle }}</span>
        </div>
      </a>
    </div>
  `,
  styleUrl: './logo-button.component.scss'
})
export class LogoButtonComponent {
  @Input() routerLink: string | null = '/admin/dashboard';
  @Input() brandName: string = 'Community Car';
  @Input() subtitle: string = 'Admin Portal';
  @Input() showText: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}