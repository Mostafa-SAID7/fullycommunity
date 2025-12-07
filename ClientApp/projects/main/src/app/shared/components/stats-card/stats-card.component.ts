import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
      [class]="customClass()">
      <div 
        class="text-2xl font-bold mb-1"
        [class]="valueColorClass()">
        {{ value() }}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ label() }}
      </div>
      @if (icon()) {
      <div class="mt-2">
        <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="icon()"/>
        </svg>
      </div>
      }
    </div>
  `
})
export class StatsCardComponent {
  value = input.required<number | string>();
  label = input.required<string>();
  icon = input<string>();
  color = input<'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple'>('default');
  customClass = input<string>('');

  valueColorClass = () => {
    const colors = {
      default: 'text-gray-900 dark:text-white',
      primary: 'text-blue-600 dark:text-blue-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-orange-600 dark:text-orange-400',
      danger: 'text-red-600 dark:text-red-400',
      purple: 'text-purple-600 dark:text-purple-400'
    };
    return colors[this.color()];
  };
}
