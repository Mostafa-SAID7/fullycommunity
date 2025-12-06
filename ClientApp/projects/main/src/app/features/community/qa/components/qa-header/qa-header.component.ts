import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-qa-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Community Q&A</h1>
        <p class="text-gray-600 dark:text-gray-400">Ask questions, share knowledge, and help others with their car issues.</p>
        
        <div class="flex flex-wrap gap-4 mt-4 text-sm">
          <div class="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <span class="font-semibold text-gray-900 dark:text-white">{{ totalQuestions() }}</span> questions
          </div>
          <div class="flex items-center gap-1.5 text-green-600 dark:text-green-400">
            <span class="font-semibold">{{ answeredCount() }}</span> answered
          </div>
          <div class="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
            <span class="font-semibold">{{ unansweredCount() }}</span> needs answer
          </div>
          <div *ngIf="bountyCount() > 0" class="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
            <span class="font-semibold">{{ bountyCount() }}</span> bounties
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button (click)="toggleFilters.emit()" 
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </svg>
          Filters
        </button>
        
        <button (click)="askQuestion.emit()" 
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Ask Question
        </button>
      </div>
    </div>
  `
})
export class QAHeaderComponent {
    // Inputs
    totalQuestions = input.required<number>();
    answeredCount = input.required<number>();
    unansweredCount = input.required<number>();
    bountyCount = input.required<number>();

    // Outputs
    askQuestion = output<void>();
    toggleFilters = output<void>();
}
