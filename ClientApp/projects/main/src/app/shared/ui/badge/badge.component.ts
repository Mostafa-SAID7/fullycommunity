import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'accent';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() dot = false;
  @Input() outline = false;

  get badgeClasses(): string {
    const baseClasses = 'inline-flex items-center font-segoe font-medium rounded-full';
    
    const sizeClasses = {
      sm: this.dot ? 'w-2 h-2' : 'px-2 py-0.5 text-xs',
      md: this.dot ? 'w-2.5 h-2.5' : 'px-2.5 py-0.5 text-xs',
      lg: this.dot ? 'w-3 h-3' : 'px-3 py-1 text-sm'
    };

    const variantClasses = this.outline ? {
      primary: 'border border-primary text-primary bg-primary/10',
      secondary: 'border border-secondary-300 text-secondary-700 bg-secondary-50 dark:border-secondary-600 dark:text-secondary-300 dark:bg-secondary-800',
      success: 'border border-success text-success bg-success/10',
      error: 'border border-error text-error bg-error/10',
      warning: 'border border-warning text-warning-600 bg-warning/10',
      info: 'border border-info text-info bg-info/10',
      accent: 'border border-accent text-accent bg-accent/10'
    } : {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary-200 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200',
      success: 'bg-success text-white',
      error: 'bg-error text-white',
      warning: 'bg-warning text-secondary-900',
      info: 'bg-info text-white',
      accent: 'bg-accent text-white'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`.trim();
  }
}