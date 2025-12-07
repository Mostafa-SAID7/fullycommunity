import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuestionListItem } from '../../../../../core/services/community/qa.service';
import { LoadingStateComponent } from '../../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingStateComponent, EmptyStateComponent],
  template: `
    <!-- Loading State -->
    <app-loading-state 
      *ngIf="loading()" 
      type="card" 
      count="3"
      message="Loading questions...">
    </app-loading-state>

    <!-- Error State -->
    <app-empty-state 
      *ngIf="error() && !loading()"
      icon="error"
      title="Failed to load questions"
      [description]="error()!"
      actionText="Try Again"
      actionIcon="refresh"
      variant="error"
      (actionClicked)="askQuestion.emit()"> <!-- Reusing emit for retry logic or simple refresh -->
    </app-empty-state>

    <!-- Empty State -->
    <app-empty-state 
      *ngIf="!loading() && !error() && questions().length === 0"
      icon="questions"
      [title]="hasFilters() ? 'No matching questions found' : 'No questions yet'"
      [description]="hasFilters() ? 'Try adjusting your filters to see more results.' : 'Be the first to ask a question in the community!'"
      [actionText]="hasFilters() ? 'Clear Filters' : 'Ask Question'"
      [actionIcon]="hasFilters() ? 'filter_off' : 'add'"
      (actionClicked)="hasFilters() ? clearFilters.emit() : askQuestion.emit()">
    </app-empty-state>

    <!-- Questions List -->
    <div *ngIf="!loading() && !error() && questions().length > 0" class="space-y-4">
      <div *ngFor="let question of questions()" 
           class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all hover:shadow-md">
        
        <div class="flex items-start gap-4">
          <!-- Stats Column -->
          <div class="flex flex-col items-center gap-2 min-w-[60px] text-sm hidden sm:flex">
            <div class="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 min-w-[60px]">
              <span class="font-bold text-lg" [class.text-green-600]="question.voteCount > 0">{{ question.voteCount }}</span>
              <span class="text-xs text-gray-500">votes</span>
            </div>
            
            <div class="flex flex-col items-center p-2 rounded-lg min-w-[60px]"
                 [ngClass]="{
                   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200': question.hasAcceptedAnswer,
                   'bg-gray-50 dark:bg-gray-700/50 border': !question.hasAcceptedAnswer && question.answerCount > 0
                 }">
              <span class="font-bold text-lg">{{ question.answerCount }}</span>
              <span class="text-xs">answers</span>
            </div>

            <div class="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
              <span class="font-medium">{{ question.viewCount }}</span>
              <span class="text-xs">views</span>
            </div>
          </div>

          <!-- Content Column -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4 mb-2">
              <div class="space-y-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                  <a [routerLink]="['/community/qa', question.id]" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {{ question.title }}
                  </a>
                </h3>
                
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span *ngFor="let tag of question.tags" 
                        class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Bounty Badge -->
              <div *ngIf="question.bountyPoints" class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold whitespace-nowrap">
                <span>+{{ question.bountyPoints }}</span>
                <span>bounty</span>
              </div>
            </div>

            <!-- Meta -->
            <div class="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <div *ngIf="question.category" class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                  <span>{{ question.category.name }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <img [src]="question.author.avatar" [alt]="question.author.name" class="w-5 h-5 rounded-full ring-2 ring-white dark:ring-gray-800">
                <span class="font-medium text-gray-900 dark:text-gray-300 hover:underline cursor-pointer">{{ question.author.name }}</span>
                <span>asked {{ question.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuestionListComponent {
  // Inputs
  questions = input.required<QuestionListItem[]>();
  loading = input.required<boolean>();
  error = input.required<string | null>();
  viewMode = input.required<'card' | 'compact'>();
  hasFilters = input.required<boolean>();

  // Outputs
  clearFilters = output<void>();
  askQuestion = output<void>();
}
