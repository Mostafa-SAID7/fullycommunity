import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingType = 'spinner' | 'dots' | 'pulse' | 'skeleton';

@Component({
  selector: 'ui-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html'
})
export class LoadingComponent {
  @Input() type: LoadingType = 'spinner';
  @Input() size: LoadingSize = 'md';
  @Input() text = '';
  @Input() overlay = false;

  get containerClasses(): string {
    const baseClasses = 'flex items-center justify-center';
    const overlayClasses = this.overlay 
      ? 'fixed inset-0 bg-background/80 dark:bg-background-dark/80 backdrop-blur-sm z-50' 
      : '';
    
    return `${baseClasses} ${overlayClasses}`.trim();
  }

  get spinnerClasses(): string {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    
    return `animate-spin text-primary ${sizeClasses[this.size]}`.trim();
  }

  get dotsClasses(): string {
    const sizeClasses = {
      sm: 'w-1 h-1',
      md: 'w-1.5 h-1.5',
      lg: 'w-2 h-2',
      xl: 'w-3 h-3'
    };
    
    return `bg-primary rounded-full ${sizeClasses[this.size]}`.trim();
  }

  get pulseClasses(): string {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24'
    };
    
    return `bg-primary rounded-full animate-pulse ${sizeClasses[this.size]}`.trim();
  }
}