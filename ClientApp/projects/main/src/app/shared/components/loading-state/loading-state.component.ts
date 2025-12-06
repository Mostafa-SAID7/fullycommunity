import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Spinner Loading -->
    <div *ngIf="type === 'spinner'" class="flex flex-col items-center justify-center p-8 space-y-4">
      <div class="relative">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700"></div>
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
      <p *ngIf="message" class="text-gray-600 dark:text-gray-400 text-sm font-medium">{{ message }}</p>
    </div>

    <!-- Card Loading -->
    <div *ngIf="type === 'card'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
        <span class="text-gray-600 dark:text-gray-400 font-medium">{{ message || 'Loading...' }}</span>
      </div>
    </div>

    <!-- Inline Loading -->
    <div *ngIf="type === 'inline'" class="inline-flex items-center space-x-2">
      <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
      <span *ngIf="message" class="text-gray-600 dark:text-gray-400 text-sm">{{ message }}</span>
    </div>
  `
})
export class LoadingStateComponent {
  @Input() type: 'spinner' | 'card' | 'inline' = 'spinner';
  @Input() message?: string;
}