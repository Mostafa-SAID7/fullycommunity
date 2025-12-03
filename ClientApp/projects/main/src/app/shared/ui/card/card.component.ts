import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() padding = true;
  @Input() hover = false;
  @Input() clickable = false;

  get cardClasses(): string {
    const baseClasses = 'rounded-fluent-lg transition-all duration-200';
    
    const variantClasses = {
      default: 'bg-background dark:bg-background-dark border border-border dark:border-border-dark',
      elevated: 'bg-background dark:bg-background-dark shadow-fluent-lg',
      outlined: 'bg-background dark:bg-background-dark border-2 border-primary/20',
      filled: 'bg-background-surface dark:bg-background-surface-dark'
    };

    const paddingClass = this.padding ? 'p-6' : '';
    const hoverClass = this.hover ? 'hover:shadow-fluent-xl hover:-translate-y-1' : '';
    const clickableClass = this.clickable ? 'cursor-pointer' : '';
    
    return `${baseClasses} ${variantClasses[this.variant]} ${paddingClass} ${hoverClass} ${clickableClass}`.trim();
  }
}