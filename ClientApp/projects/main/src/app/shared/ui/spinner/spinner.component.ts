import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'border' | 'dots' | 'pulse';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Border Spinner -->
    <div *ngIf="variant === 'border'" [class]="borderSpinnerClasses"></div>
    
    <!-- Dots Spinner -->
    <div *ngIf="variant === 'dots'" class="flex space-x-1">
      <div *ngFor="let dot of [1,2,3]" 
           [class]="dotClasses" 
           [style.animation-delay]="(dot - 1) * 0.2 + 's'"></div>
    </div>
    
    <!-- Pulse Spinner -->
    <div *ngIf="variant === 'pulse'" [class]="pulseSpinnerClasses"></div>
  `,
  styles: [`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .animate-bounce-dot {
      animation: bounce 1.4s infinite ease-in-out both;
    }
  `]
})
export class SpinnerComponent {
  @Input() variant: SpinnerVariant = 'border';
  @Input() size: SpinnerSize = 'md';
  @Input() color = 'primary';

  get borderSpinnerClasses(): string {
    const baseClasses = 'border-2 border-gray-200 dark:border-gray-700 rounded-full animate-spin';
    
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    const colorClasses = {
      primary: 'border-t-primary',
      secondary: 'border-t-secondary-500',
      success: 'border-t-success',
      error: 'border-t-error',
      warning: 'border-t-warning',
      info: 'border-t-info'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]} ${colorClasses[this.color as keyof typeof colorClasses] || colorClasses.primary}`.trim();
  }

  get dotClasses(): string {
    const baseClasses = 'rounded-full animate-bounce-dot';
    
    const sizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    };

    const colorClasses = {
      primary: 'bg-primary',
      secondary: 'bg-secondary-500',
      success: 'bg-success',
      error: 'bg-error',
      warning: 'bg-warning',
      info: 'bg-info'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]} ${colorClasses[this.color as keyof typeof colorClasses] || colorClasses.primary}`.trim();
  }

  get pulseSpinnerClasses(): string {
    const baseClasses = 'rounded-full animate-pulse';
    
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    const colorClasses = {
      primary: 'bg-primary',
      secondary: 'bg-secondary-500',
      success: 'bg-success',
      error: 'bg-error',
      warning: 'bg-warning',
      info: 'bg-info'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]} ${colorClasses[this.color as keyof typeof colorClasses] || colorClasses.primary}`.trim();
  }
}