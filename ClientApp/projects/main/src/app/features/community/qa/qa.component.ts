import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QAService, QuestionListItem, QuestionCategory, QuestionStatus } from '../../../core/services/qa.service';

@Component({
  selector: 'app-qa',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Q&A Forum</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Ask questions, share knowledge, help the community</p>
        </div>
        <button (click)="showAskModal = true" 
                class="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Ask Question
        </button>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ totalQuestions() }}</p>
          <p class="text-sm text-gray-500">Questions</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ answeredCount() }}</p>
          <p class="text-sm text-gray-500">Answered</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-orange-600">{{ unansweredCount() }}</p>
          <p class="text-sm text-gray-500">Unanswered</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-purple-600">{{ bountyCount() }}</p>
          <p class="text-sm text-gray-500">With Bounty</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
        <div class="flex flex-wrap gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-[250px]">
            <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="loadQuestions()" 
                   placeholder="Search questions..."
                   class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
          </div>
          
          <!-- Sort Tabs -->
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            @for (sort of sortOptions; track sort.value) {
              <button (click)="sortBy = sort.value; loadQuestions()"
                      [class]="sortBy === sort.value ? 'bg-white dark:bg-gray-600 shadow' : ''"
                      class="px-4 py-2 rounded-lg text-sm font-medium transition">
                {{ sort.label }}
              </button>
            }
          </div>
          
          <!-- Filter Dropdown -->
          <select [(ngModel)]="selectedStatus" (change)="loadQuestions()" 
                  class="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Answered">Answered</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mt-4">
          <span class="text-sm text-gray-500 mr-2">Popular tags:</span>
          @for (tag of popularTags; track tag) {
            <button (click)="filterByTag(tag)"
                    [class]="selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'"
                    class="px-3 py-1 rounded-full text-sm transition">
              {{ tag }}
            </button>
          }
        </div>
      </div>

      <!-- Questions List -->
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="space-y-4">
          @for (question of questions(); track question.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl p-5 hover:shadow-md transition cursor-pointer"
                 [routerLink]="['/community/qa', question.slug]">
              <div class="flex gap-4">
                <!-- Vote/Answer Stats -->
                <div class="hidden md:flex flex-col items-center gap-2 min-w-[80px]">
                  <div class="text-center p-2 rounded-lg" 
                       [class]="question.voteCount > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700'">
                    <p class="text-lg font-bold" [class]="question.voteCount > 0 ? 'text-green-600' : ''">
                      {{ question.voteCount }}
                    </p>
                    <p class="text-xs text-gray-500">votes</p>
                  </div>
                  <div class="text-center p-2 rounded-lg"
                       [class]="question.hasAcceptedAnswer ? 'bg-green-500 text-white' : question.answerCount > 0 ? 'border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-700'">
                    <p class="text-lg font-bold">{{ question.answerCount }}</p>
                    <p class="text-xs" [class]="question.hasAcceptedAnswer ? 'text-green-100' : 'text-gray-500'">answers</p>
                  </div>
                  <div class="text-center text-xs text-gray-500">
                    {{ question.viewCount }} views
                  </div>
                </div>

                <!-- Question Content -->
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 line-clamp-2">
                      {{ question.title }}
                    </h3>
                    @if (question.bountyPoints) {
                      <span class="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
                        +{{ question.bountyPoints }} bounty
                      </span>
                    }
                  </div>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-2 mb-3">
                    @for (tag of question.tags; track tag) {
                      <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                        {{ tag }}
                      </span>
                    }
                  </div>

                  <!-- Meta -->
                  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <!-- Mobile Stats -->
                    <div class="flex md:hidden gap-3">
                      <span>{{ question.voteCount }} votes</span>
                      <span [class]="question.hasAcceptedAnswer ? 'text-green-600 font-medium' : ''">
                        {{ question.answerCount }} answers
                      </span>
                    </div>
                    
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                        {{ question.author.firstName[0] }}{{ question.author.lastName[0] }}
                      </div>
                      <span>{{ question.author.firstName }} {{ question.author.lastName }}</span>
                      @if (question.author.isVerified) {
                        <span class="text-blue-500">✓</span>
                      }
                      <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {{ question.author.reputation }} rep
                      </span>
                    </div>
                    <span>asked {{ question.createdAt | date:'MMM d' }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (questions().length === 0 && !loading()) {
        <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p class="text-4xl mb-4">❓</p>
          <p class="text-gray-500 mb-4">No questions found</p>
          <button (click)="showAskModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Ask the first question
          </button>
        </div>
      }

      <!-- Ask Question Modal -->
      @if (showAskModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Ask a Question</h2>
                <button (click)="showAskModal = false" class="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Title</label>
                  <input type="text" [(ngModel)]="newQuestion.title" 
                         placeholder="What's your question? Be specific."
                         class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2">Details</label>
                  <textarea [(ngModel)]="newQuestion.content" rows="6"
                            placeholder="Include all the information someone would need to answer your question"
                            class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input type="text" [(ngModel)]="newQuestion.tagsInput" 
                         placeholder="e.g., maintenance, oil-change, toyota"
                         class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                </div>
              </div>
              
              <div class="flex justify-end gap-3 mt-6">
                <button (click)="showAskModal = false" 
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button (click)="submitQuestion()" 
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Post Question
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class QAComponent implements OnInit {
  private qaService = inject(QAService);

  questions = signal<QuestionListItem[]>([]);
  categories = signal<QuestionCategory[]>([]);
  loading = signal(false);
  
  totalQuestions = signal(0);
  answeredCount = signal(0);
  unansweredCount = signal(0);
  bountyCount = signal(0);

  searchTerm = '';
  sortBy = 'newest';
  selectedStatus = '';
  selectedTag = '';
  showAskModal = false;

  newQuestion = { title: '', content: '', tagsInput: '' };

  sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'votes', label: 'Votes' },
    { value: 'unanswered', label: 'Unanswered' },
    { value: 'active', label: 'Active' }
  ];

  popularTags = ['maintenance', 'electric', 'brakes', 'engine', 'oil-change', 'tires', 'battery'];

  ngOnInit() {
    this.loadQuestions();
    this.loadCategories();
  }

  loadQuestions() {
    this.loading.set(true);
    this.qaService.getQuestions({
      status: this.selectedStatus as QuestionStatus || undefined,
      searchTerm: this.searchTerm || undefined,
      tag: this.selectedTag || undefined,
      sortBy: this.sortBy
    }).subscribe({
      next: (result) => {
        this.questions.set(result.items);
        this.totalQuestions.set(result.totalCount);
        this.updateStats(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadCategories() {
    this.qaService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  updateStats(questions: QuestionListItem[]) {
    this.answeredCount.set(questions.filter(q => q.hasAcceptedAnswer).length);
    this.unansweredCount.set(questions.filter(q => q.answerCount === 0).length);
    this.bountyCount.set(questions.filter(q => q.bountyPoints).length);
  }

  filterByTag(tag: string) {
    this.selectedTag = this.selectedTag === tag ? '' : tag;
    this.loadQuestions();
  }

  submitQuestion() {
    if (!this.newQuestion.title || !this.newQuestion.content) return;
    
    this.qaService.createQuestion({
      title: this.newQuestion.title,
      content: this.newQuestion.content,
      tags: this.newQuestion.tagsInput.split(',').map(t => t.trim()).filter(t => t)
    }).subscribe({
      next: () => {
        this.showAskModal = false;
        this.newQuestion = { title: '', content: '', tagsInput: '' };
        this.loadQuestions();
      }
    });
  }
}
