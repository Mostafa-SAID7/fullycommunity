import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qa-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Enhanced Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="flex-1">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Community Q&A</h1>
              <p class="text-lg text-gray-600 dark:text-gray-400 mt-1">Ask questions, share knowledge, and help the automotive community grow</p>
            </div>
          </div>
          
          <!-- Community Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="stat-card group">
              <div class="stat-icon" style="background-color: var(--color-primary-100); color: var(--color-primary)">
                <svg class="w-6 h-6" style="color: var(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="stat-value">{{ totalQuestions() }}</div>
              <div class="stat-label">Total Questions</div>
            </div>
            
            <div class="stat-card group">
              <div class="stat-icon" style="background-color: var(--color-success); opacity: 0.1; color: var(--color-success)">
                <svg class="w-6 h-6" style="color: var(--color-success)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="stat-value">{{ answeredCount() }}</div>
              <div class="stat-label">Answered</div>
            </div>
            
            <div class="stat-card group">
              <div class="stat-icon" style="background-color: var(--color-warning); opacity: 0.1; color: var(--color-warning)">
                <svg class="w-6 h-6" style="color: var(--color-warning)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div class="stat-value">{{ unansweredCount() }}</div>
              <div class="stat-label">Unanswered</div>
            </div>
            
            <div class="stat-card group">
              <div class="stat-icon" style="background-color: var(--color-info); opacity: 0.1; color: var(--color-info)">
                <svg class="w-6 h-6" style="color: var(--color-info)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <div class="stat-value">{{ bountyCount() }}</div>
              <div class="stat-label">With Bounty</div>
            </div>
          </div>
        </div>
        
        <!-- Ask Question Button -->
        <div class="flex flex-col gap-3">
          <button (click)="askQuestion.emit()" 
                  class="fluent-button primary inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Ask Question
          </button>
          
          <button (click)="toggleFilters.emit()" 
                  class="fluent-button secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
            </svg>
            Advanced Filters
          </button>
        </div>
      </div>
    </div>
  `
})
export class QAHeaderComponent {
  totalQuestions = input.required<number>();
  answeredCount = input.required<number>();
  unansweredCount = input.required<number>();
  bountyCount = input.required<number>();
  
  askQuestion = output<void>();
  toggleFilters = output<void>();
}