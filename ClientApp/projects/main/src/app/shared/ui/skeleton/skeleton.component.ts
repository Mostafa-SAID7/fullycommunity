import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="skeletonClasses" [style.width]="width" [style.height]="height">
      <div class="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer"></div>
    </div>
  `,
  styles: [`
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .animate-shimmer {
      animation: shimmer 2s infinite linear;
    }
  `]
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'rectangular';
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() animation = true;

  get skeletonClasses(): string {
    const baseClasses = 'overflow-hidden';
    
    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: '',
      rounded: 'rounded-lg'
    };

    const animationClass = this.animation ? '' : '[&>div]:animate-none';
    
    return `${baseClasses} ${variantClasses[this.variant]} ${animationClass}`.trim();
  }
}