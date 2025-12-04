import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
export type ChipSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="chipClasses">
      <!-- Icon -->
      <span *ngIf="icon" class="flex-shrink-0" [innerHTML]="icon"></span>
      
      <!-- Avatar -->
      <img *ngIf="avatar" [src]="avatar" [alt]="label" [class]="avatarClasses">
      
      <!-- Label -->
      <span class="truncate">{{ label }}</span>
      
      <!-- Remove Button -->
      <button
        *ngIf="removable && !disabled"
        type="button"
        (click)="onRemove($event)"
        [class]="removeButtonClasses"
        [attr.aria-label]="'Remove ' + label">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `
})
export class ChipComponent {
  @Input() label = '';
  @Input() variant: ChipVariant = 'default';
  @Input() size: ChipSize = 'md';
  @Input() icon = '';
  @Input() avatar = '';
  @Input() removable = false;
  @Input() disabled = false;
  @Input() clickable = false;
  
  @Output() clicked = new EventEmitter<Event>();
  @Output() removed = new EventEmitter<Event>();

  get chipClasses(): string {
    const baseClasses = 'inline-flex items-center font-segoe font-medium rounded-full transition-all duration-200';
    
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs gap-1',
      md: 'px-3 py-1.5 text-sm gap-1.5',
      lg: 'px-4 py-2 text-base gap-2'
    };

    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      primary: 'bg-primary/10 text-primary border border-primary/20',
      secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200',
      success: 'bg-success/10 text-success border border-success/20',
      error: 'bg-error/10 text-error border border-error/20',
      warning: 'bg-warning/10 text-warning-600 border border-warning/20',
      info: 'bg-info/10 text-info border border-info/20'
    };

    const interactionClasses = this.clickable && !this.disabled 
      ? 'cursor-pointer hover:shadow-sm' 
      : '';

    const disabledClasses = this.disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : '';
    
    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${interactionClasses} ${disabledClasses}`.trim();
  }

  get avatarClasses(): string {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    
    return `rounded-full object-cover ${sizeClasses[this.size]}`;
  }

  get removeButtonClasses(): string {
    const baseClasses = 'flex-shrink-0 rounded-full transition-colors duration-150 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50';
    
    const sizeClasses = {
      sm: 'p-0.5',
      md: 'p-1',
      lg: 'p-1'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  onClick(event: Event) {
    if (!this.disabled && this.clickable) {
      this.clicked.emit(event);
    }
  }

  onRemove(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this.removed.emit(event);
    }
  }
}