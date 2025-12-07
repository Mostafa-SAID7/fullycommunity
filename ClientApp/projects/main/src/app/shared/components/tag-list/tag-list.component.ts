import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      @for (tag of displayTags(); track tag) {
      <span 
        [class]="tagClass()"
        (click)="onTagClick(tag)"
        [class.cursor-pointer]="clickable()"
        [class.hover:scale-105]="clickable()"
        class="transition-all duration-200">
        {{ tag }}
      </span>
      }
      @if (tags().length > maxDisplay() && maxDisplay() > 0) {
      <span class="text-xs text-gray-500 dark:text-gray-400">
        +{{ tags().length - maxDisplay() }} more
      </span>
      }
    </div>
  `
})
export class TagListComponent {
  tags = input.required<string[]>();
  maxDisplay = input<number>(5);
  clickable = input<boolean>(false);
  variant = input<'default' | 'primary' | 'success' | 'warning'>('default');
  size = input<'sm' | 'md'>('md');

  tagClick = output<string>();

  displayTags = () => {
    const max = this.maxDisplay();
    return max > 0 ? this.tags().slice(0, max) : this.tags();
  };

  tagClass = () => {
    const variants = {
      default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600',
      primary: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800',
      success: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800',
      warning: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-800'
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm'
    };

    return `${variants[this.variant()]} ${sizes[this.size()]} rounded-full font-medium`;
  };

  onTagClick(tag: string) {
    if (this.clickable()) {
      this.tagClick.emit(tag);
    }
  }
}
