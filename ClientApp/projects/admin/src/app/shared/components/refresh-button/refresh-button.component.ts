import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refresh-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="onRefresh()"
      [disabled]="loading() || disabled()"
      [class]="getButtonClasses()"
      [title]="title() || 'Refresh data'"
      type="button">
      
      <!-- Loading/Refresh Icon -->
      <svg 
        class="w-4 h-4 transition-transform duration-300"
        [class.animate-spin]="loading()"
        [class.rotate-180]="!loading() && showRotateEffect()"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24">
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      
      <!-- Text (optional) -->
      <span *ngIf="showText()" class="ml-2 font-medium">
        {{ loading() ? loadingText() : refreshText() }}
      </span>
      
      <!-- Status Indicator -->
      <div *ngIf="showStatusIndicator() && lastRefresh()" 
           class="absolute -top-1 -right-1 w-3 h-3 rounded-full"
           [class.bg-green-400]="status() === 'success'"
           [class.bg-red-400]="status() === 'error'"
           [class.bg-yellow-400]="status() === 'warning'"
           [class.animate-pulse]="status() === 'warning'">
      </div>
    </button>
  `,
  styleUrl: './refresh-button.component.scss'
})
export class RefreshButtonComponent {
  // Inputs
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  variant = input<'primary' | 'secondary' | 'ghost' | 'success' | 'warning'>('secondary');
  size = input<'sm' | 'md' | 'lg'>('md');
  showText = input<boolean>(true);
  refreshText = input<string>('Refresh');
  loadingText = input<string>('Refreshing...');
  title = input<string>('');
  showStatusIndicator = input<boolean>(false);
  status = input<'success' | 'error' | 'warning' | null>(null);
  lastRefresh = input<Date | null>(null);
  showRotateEffect = input<boolean>(true);

  // Outputs
  refresh = output<void>();

  onRefresh() {
    if (!this.loading() && !this.disabled()) {
      this.refresh.emit();
    }
  }

  getButtonClasses(): string {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95';
    
    // Size classes
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    // Variant classes
    const variantClasses = {
      primary: 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg hover:shadow-xl focus:ring-primary/50 disabled:from-gray-400 disabled:to-gray-500',
      secondary: 'bg-white border-2 border-gray-300 text-gray-700 shadow-md hover:border-primary hover:text-primary hover:shadow-lg focus:ring-primary/50 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500/50 disabled:text-gray-400',
      success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl focus:ring-green-500/50 disabled:from-gray-400 disabled:to-gray-500',
      warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500/50 disabled:from-gray-400 disabled:to-gray-500'
    };

    // Disabled state
    const disabledClasses = this.loading() || this.disabled() 
      ? 'cursor-not-allowed opacity-60 transform-none hover:scale-100' 
      : 'cursor-pointer';

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${disabledClasses}`;
  }
}