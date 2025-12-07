import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass">
      <svg [class]="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    </div>
  `
})
export class BrandLogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() variant: 'primary' | 'white' | 'gradient' = 'primary';

  get containerClass(): string {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20'
    };

    const variantClasses = {
      primary: 'bg-primary',
      white: 'bg-white',
      gradient: 'bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600'
    };

    return `inline-flex items-center justify-center ${sizeClasses[this.size]} ${variantClasses[this.variant]} rounded-lg sm:rounded-xl shadow-lg`;
  }

  get iconClass(): string {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5',
      lg: 'w-8 h-8',
      xl: 'w-10 h-10'
    };

    const colorClass = this.variant === 'white' ? 'text-primary' : 'text-white';

    return `${sizeClasses[this.size]} ${colorClass}`;
  }
}
