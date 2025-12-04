import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton';

@Component({
  selector: 'ui-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <!-- Spinner -->
      <div *ngIf="variant === 'spinner'" [class]="spinnerClasses"></div>
      
      <!-- Dots -->
      <div *ngIf="variant === 'dots'" class="flex space-x-1">
        <div *ngFor="let dot of [1,2,3]" [class]="dotClasses" [style.animation-delay]="(dot - 1) * 0.2 + 's'"></div>
      </div>
      
      <!-- Pulse -->
      <div *ngIf="variant === 'pulse'" [class]="pulseClasses"></div>
      
      <!-- Skeleton -->
      <div *ngIf="variant === 'skeleton'" class="space-y-3">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
      </div>
      
      <!-- Text -->
      <p *ngIf="text" [class]="textClasses">{{ text }}</p>
    </div>
  `,
  styles: [`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    
    .animate-bounce-dot {
      animation: bounce 1.4s infinite ease-in-out both;
    }
  `]
})
export class LoadingComponent {
  @Input() variant: LoadingVariant = 'spinner';
  @Input() size: LoadingSize = 'md';
  @Input() text = '';
  @Input() center = true;

  get containerClasses(): string {
    const baseClasses = 'flex flex-col items-center';
    const centerClass = this.center ? 'justify-center' : '';
    return `${baseClasses} ${centerClass}`.trim();
  }

  get spinnerClasses(): string {
    const baseClasses = 'border-2 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin';
    
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]}`.trim();
  }

  get dotClasses(): string {
    const baseClasses = 'bg-primary rounded-full animate-bounce-dot';
    
    const sizeClasses = {
      sm: 'w-1 h-1',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]}`.trim();
  }

  get pulseClasses(): string {
    const baseClasses = 'bg-primary rounded-full animate-pulse';
    
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]}`.trim();
  }

  get textClasses(): string {
    const baseClasses = 'text-secondary-600 dark:text-secondary-400 mt-2';
    
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]}`.trim();
  }
}