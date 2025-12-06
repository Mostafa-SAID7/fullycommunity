import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QAService, QuestionDetail, Answer } from '../../../../core/services/community/qa.service';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingStateComponent, EmptyStateComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto p-6">
      <!-- Loading State -->
      <app-loading-state 
        *ngIf="loading()" 
        type="card" 
        message="Loading question details...">
      </app-loading-state>

      <!-- Error State -->
      <app-empty-state 
        *ngIf="error() && !loading()"
        icon="error"
        title="Question Not Found"
        description="The question you're looking for doesn't exist or has been removed."
        actionText="Back to Q&A"
        actionIcon="search"
        variant="error"
        (actionClicked)="goBack()">
      </app-empty-state>

      <!-- Question Detail -->
      <div *ngIf="question() && !loading() && !error()" class="space-y-6">
        
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <button (click)="goBack()" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Q&A
          </button>
          <span>/</span>
          <span class="text-gray-900 dark:text-white">{{ question()?.title }}</span>
        </nav>

        <!-- Question Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          
          <!-- Question Header -->
          <div class="flex items-start gap-6 mb-6">
            <!-- Vote Section -->
            <div class="flex flex-col items-center gap-2 min-w-[60px]">
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                </svg>
              </button>
              <span class="text-xl font-bold text-gray-900 dark:text-white">{{ question()?.voteCount }}</span>
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            <!-- Question Content -->
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {{ question()?.title }}
              </h1>
              
              <div class="prose dark:prose-invert max-w-none mb-6" [innerHTML]="question()?.content">
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span *ngFor="let tag of question()?.tags" 
                      class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                  {{ tag }}
                </span>
              </div>

              <!-- Question Meta -->
              <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-4">
                  <span>Asked {{ question()?.createdAt | date:'medium' }}</span>
                  <span>{{ question()?.viewCount }} views</span>
                </div>
                <div class="flex items-center gap-2">
                  <img [src]="question()?.author?.avatar" 
                       [alt]="question()?.author?.name"
                       class="w-6 h-6 rounded-full">
                  <span>{{ question()?.author?.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Answers Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ question()?.answerCount }} Answer{{ question()?.answerCount !== 1 ? 's' : '' }}
          </h2>

          <!-- No Answers State -->
          <app-empty-state 
            *ngIf="question()?.answerCount === 0"
            icon="questions"
            title="No answers yet"
            description="Be the first to help by providing an answer to this question."
            actionText="Write an Answer"
            actionIcon="add"
            (actionClicked)="scrollToAnswerForm()">
          </app-empty-state>

          <!-- Answers List -->
          <div *ngIf="(question()?.answerCount ?? 0) > 0" class="space-y-6">
            <div *ngFor="let answer of question()?.answers" 
                 class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
              
              <div class="flex items-start gap-6">
                <!-- Vote Section -->
                <div class="flex flex-col items-center gap-2 min-w-[60px]">
                  <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                    </svg>
                  </button>
                  <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ answer.voteCount }}</span>
                  <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  
                  <!-- Accepted Answer Badge -->
                  <div *ngIf="answer.isAccepted" 
                       class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <!-- Answer Content -->
                <div class="flex-1">
                  <div class="prose dark:prose-invert max-w-none mb-4" [innerHTML]="answer.content">
                  </div>

                  <!-- Answer Meta -->
                  <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div class="flex items-center gap-4">
                      <span>Answered {{ answer.createdAt | date:'medium' }}</span>
                      <button class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Reply
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <img [src]="answer.author.avatar" 
                           [alt]="answer.author.name"
                           class="w-6 h-6 rounded-full">
                      <span>{{ answer.author.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Answer Form -->
        <div id="answer-form" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Answer
          </h3>
          
          <form (ngSubmit)="submitAnswer()" class="space-y-4">
            <div>
              <textarea 
                [(ngModel)]="newAnswer"
                name="answer"
                rows="8"
                placeholder="Write your answer here..."
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                required>
              </textarea>
            </div>
            
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Please provide a helpful and detailed answer.
              </p>
              <button 
                type="submit"
                [disabled]="!newAnswer.trim() || submitting()"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed">
                <span *ngIf="!submitting()">Post Answer</span>
                <span *ngIf="submitting()" class="flex items-center gap-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Posting...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class QuestionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qaService = inject(QAService);

  question = signal<QuestionDetail | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);

  newAnswer = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuestion(id);
    }
  }

  loadQuestion(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.qaService.getQuestionById(id).subscribe({
      next: (question) => {
        this.question.set(question);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load question:', err);
        this.error.set('Failed to load question');
        this.loading.set(false);
      }
    });
  }

  submitAnswer() {
    if (!this.newAnswer.trim() || !this.question()?.id) return;

    this.submitting.set(true);

    this.qaService.createAnswer(this.question()!.id, {
      content: this.newAnswer
    }).subscribe({
      next: () => {
        this.newAnswer = '';
        this.submitting.set(false);
        // Reload question to show new answer
        this.loadQuestion(this.question()!.id);
      },
      error: (err) => {
        console.error('Failed to submit answer:', err);
        this.submitting.set(false);
      }
    });
  }

  scrollToAnswerForm() {
    document.getElementById('answer-form')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  goBack() {
    this.router.navigate(['/community/qa']);
  }
}