import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuestionCardComponent } from '../question-card/question-card.component';

export interface QuestionListItem {
  id: string;
  title: string;
  content?: string;
  slug: string;
  status: string;
  tags: string[];
  viewCount: number;
  answerCount: number;
  voteCount: number;
  hasAcceptedAnswer: boolean;
  bountyPoints?: number;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    isVerified: boolean;
    reputation: number;
  };
}

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterLink, QuestionCardComponent],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading()" class="space-y-6">
      <div *ngFor="let i of [1,2,3,4,5]" class="fluent-card p-6">
        <div class="flex gap-6">
          <div class="flex flex-col gap-3 shrink-0">
            <div class="loading-skeleton w-20 h-16 rounded-lg"></div>
            <div class="loading-skeleton w-20 h-16 rounded-lg"></div>
            <div class="loading-skeleton w-20 h-8 rounded-lg"></div>
          </div>
          <div class="flex-1 space-y-4">
            <div class="loading-skeleton h-7 w-3/4 rounded"></div>
            <div class="loading-skeleton h-4 w-full rounded"></div>
            <div class="loading-skeleton h-4 w-2/3 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div *ngIf="!loading() && error()" class="text-center py-16 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Something went wrong</h3>
      <p class="text-red-600 dark:text-red-300 mb-6 max-w-md mx-auto">{{ error() }}</p>
      <button (click)="clearFilters.emit()" class="px-6 py-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors font-medium text-sm shadow-sm">
        Try Again
      </button>
    </div>

    <!-- Card View -->
    <div *ngIf="!loading() && viewMode() === 'card'" class="space-y-6">
      <app-question-card 
        *ngFor="let question of questions(); trackBy: trackByQuestionId" 
        [question]="question">
      </app-question-card>
    </div>

    <!-- Compact View -->
    <div *ngIf="!loading() && viewMode() === 'compact'" class="fluent-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Question</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">Votes</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">Answers</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">Views</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-48">Author</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr *ngFor="let question of questions(); trackBy: trackByQuestionId" 
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                [routerLink]="['/community/qa', question.slug]">
              <td class="px-6 py-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ question.title }}</h3>
                <div class="flex flex-wrap gap-1.5">
                  <span *ngFor="let tag of question.tags.slice(0, 4)" 
                        class="inline-block px-2 py-0.5 text-xs font-medium rounded"
                        style="background-color: var(--color-primary-100); color: var(--color-primary)">
                    {{ tag }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-lg font-bold">{{ formatNumber(question.voteCount) }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full"
                      [class.bg-primary-500]="question.hasAcceptedAnswer"
                      [class.text-white]="question.hasAcceptedAnswer"
                      [class.bg-gray-100]="!question.hasAcceptedAnswer">
                  {{ question.answerCount }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatNumber(question.viewCount) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                       style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)">
                    {{ question.author.firstName[0] }}{{ question.author.lastName[0] }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ question.author.firstName }} {{ question.author.lastName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ getRelativeTime(question.createdAt) }}</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div *ngIf="!loading() && questions().length === 0" class="text-center py-20">
      <div class="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
           style="background: linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-200) 100%)">
        <svg class="w-12 h-12" style="color: var(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {{ hasFilters() ? 'No questions found' : 'No questions yet' }}
      </h3>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        {{ hasFilters() ? 'Try adjusting your search or filters.' : 'Be the first to ask a question!' }}
      </p>
      <div class="flex gap-4 justify-center">
        <button *ngIf="hasFilters()" (click)="clearFilters.emit()" class="fluent-button secondary px-6 py-3">
          Clear All Filters
        </button>
        <button (click)="askQuestion.emit()" class="fluent-button primary px-8 py-3">
          Ask Question
        </button>
      </div>
    </div>
  `
})
export class QuestionListComponent {
  questions = input.required<QuestionListItem[]>();
  loading = input.required<boolean>();
  error = input<string | null>(null);
  viewMode = input.required<'card' | 'compact'>();
  hasFilters = input.required<boolean>();

  clearFilters = output<void>();
  askQuestion = output<void>();

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  }

  trackByQuestionId(index: number, question: QuestionListItem): string {
    return question.id;
  }
}