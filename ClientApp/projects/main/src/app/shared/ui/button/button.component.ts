import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() icon = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  
  @Output() clicked = new EventEmitter<Event>();

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-segoe font-medium rounded-fluent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary/50 shadow-fluent hover:shadow-fluent-lg',
      secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary/50 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
      accent: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent/50 shadow-fluent hover:shadow-fluent-lg',
      success: 'bg-success text-white hover:bg-success-600 focus:ring-success/50 shadow-fluent hover:shadow-fluent-lg',
      error: 'bg-error text-white hover:bg-error-600 focus:ring-error/50 shadow-fluent hover:shadow-fluent-lg',
      warning: 'bg-warning text-secondary-900 hover:bg-warning-600 focus:ring-warning/50 shadow-fluent hover:shadow-fluent-lg',
      ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/50',
      outline: 'border border-border text-secondary-700 hover:bg-secondary-50 focus:ring-primary/50 dark:border-border-dark dark:text-secondary-300 dark:hover:bg-secondary-800'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-3'
    };

    const widthClass = this.fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${widthClass}`.trim();
  }

  onClick(event: Event) {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}