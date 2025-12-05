import { Component, inject, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { QAService, QuestionListItem, QuestionCategory, QuestionStatus } from '../../../core/services/qa.service';
import { ThemeService } from '../../../core/services/theme.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

// Import child components
import { QAHeaderComponent } from './components/qa-header/qa-header.component';
import { QASearchFiltersComponent } from './components/qa-search-filters/qa-search-filters.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { AskQuestionModalComponent, NewQuestionForm } from './components/ask-question-modal/ask-question-modal.component';

@Component({
  selector: 'app-qa',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    QAHeaderComponent,
    QASearchFiltersComponent,
    QuestionListComponent,
    AskQuestionModalComponent
  ],
  template: `
    <!-- Microsoft Fluent Design Q&A Community Page -->
    <div class="microsoft-bg min-h-screen">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
        <!-- Header Component -->
        <app-qa-header
          [totalQuestions]="totalQuestions()"
          [answeredCount]="answeredCount()"
          [unansweredCount]="unansweredCount()"
          [bountyCount]="bountyCount()"
          (askQuestion)="showAskModal = true"
          (toggleFilters)="toggleAdvancedFilters()">
        </app-qa-header>

        <!-- Search and Filters Component -->
        <app-qa-search-filters
          [categories]="categories()"
          [showAdvancedFilters]="showAdvancedFilters()"
          [sortOptions]="sortOptions"
          [popularTags]="popularTags"
          [(searchTerm)]="searchTerm"
          [(sortBy)]="sortBy"
          [(viewMode)]="viewMode"
          [(selectedStatus)]="selectedStatus"
          [(selectedCategory)]="selectedCategory"
          [(selectedTag)]="selectedTag"
          [(dateFilter)]="dateFilter"
          [(bountyFilter)]="bountyFilter"
          (searchInput)="onSearchInput($event)"
          (filtersChanged)="loadQuestions()"
          (tagSelected)="filterByTag($event)"
          (viewModeChanged)="viewMode = $event"
          (sortChanged)="selectSort($event)">
        </app-qa-search-filters>

        <!-- Results Summary -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ questions().length }} of {{ totalQuestions() }} questions
            <span *ngIf="searchTerm || hasActiveFilters()" class="ml-2">
              • <button (click)="clearAllFilters()" class="hover:underline font-medium" style="color: var(--color-primary)">Clear all filters</button>
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ questions().length }} results</span>
          </div>
        </div>

        <!-- Question List Component -->
        <app-question-list
          [questions]="questions()"
          [loading]="loading()"
          [viewMode]="viewMode"
          [hasFilters]="hasActiveFilters()"
          (clearFilters)="clearAllFilters()"
          (askQuestion)="showAskModal = true">
        </app-question-list>

        <!-- Ask Question Modal Component -->
        <app-ask-question-modal
          [show]="showAskModal"
          [categories]="categories()"
          [popularTags]="popularTags"
          [(formData)]="newQuestion"
          (closed)="showAskModal = false"
          (submitted)="submitQuestion($event)">
        </app-ask-question-modal>
      </div>
    </div>
  `
})
export class QAComponent implements OnInit {
  private qaService = inject(QAService);
  private themeService = inject(ThemeService);

  // Core data
  questions = signal<QuestionListItem[]>([]);
  categories = signal<QuestionCategory[]>([]);
  loading = signal(false);
  
  // Statistics
  totalQuestions = signal(0);
  answeredCount = signal(0);
  unansweredCount = signal(0);
  bountyCount = signal(0);

  // Search & Filters
  searchTerm = '';
  private searchSubject = new Subject<string>();
  sortBy = 'newest';
  viewMode: 'card' | 'compact' = 'card';
  selectedStatus = '';
  selectedCategory = '';
  selectedTag = '';
  dateFilter = 'all';
  bountyFilter = '';
  showAskModal = false;
  showAdvancedFilters = signal(false);

  // New question form
  newQuestion: NewQuestionForm = { 
    title: '', 
    content: '', 
    tagsInput: '',
    categoryId: ''
  };

  // Enhanced sort options with icons
  sortOptions = [
    { 
      value: 'newest', 
      label: 'Newest',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    { 
      value: 'votes', 
      label: 'Most Votes',
      icon: 'M5 15l7-7 7 7'
    },
    { 
      value: 'unanswered', 
      label: 'Unanswered',
      icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    { 
      value: 'active', 
      label: 'Most Active',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    { 
      value: 'bounty', 
      label: 'Bounty',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
    }
  ];

  popularTags = [
    'maintenance', 'electric', 'brakes', 'engine', 'oil-change', 
    'tires', 'battery', 'transmission', 'suspension', 'diagnostics',
    'hybrid', 'tesla', 'bmw', 'mercedes', 'toyota', 'honda'
  ];

  // Tag counts for popular tags
  tagCounts = new Map<string, number>();

  constructor() {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadQuestions();
    });
  }

  ngOnInit() {
    this.loadQuestions();
    this.loadCategories();
    this.loadTagCounts();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close dropdowns when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      // Close any open dropdowns
    }
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

  // Enhanced UI Actions
  toggleAdvancedFilters() {
    this.showAdvancedFilters.update(v => !v);
  }

  selectSort(value: string) {
    this.sortBy = value;
    this.loadQuestions();
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value;
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadQuestions();
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.selectedTag = '';
    this.dateFilter = 'all';
    this.bountyFilter = '';
    this.sortBy = 'newest';
    this.loadQuestions();
  }

  hasActiveFilters(): boolean {
    return this.selectedStatus !== '' || 
           this.selectedCategory !== '' || 
           this.selectedTag !== '' || 
           this.dateFilter !== 'all' || 
           this.bountyFilter !== '';
  }

  filterByTag(tag: string) {
    this.selectedTag = this.selectedTag === tag ? '' : tag;
    this.loadQuestions();
  }

  getTagCount(tag: string): number {
    return this.tagCounts.get(tag) || 0;
  }

  // Enhanced data loading
  loadTagCounts() {
    // This would typically come from the API
    this.popularTags.forEach(tag => {
      this.tagCounts.set(tag, Math.floor(Math.random() * 100) + 1);
    });
  }





  submitQuestion(formData: NewQuestionForm) {
    if (!formData.title || !formData.content) return;
    
    this.qaService.createQuestion({
      title: formData.title,
      content: formData.content,
      tags: formData.tagsInput.split(',').map(t => t.trim()).filter(t => t),
      categoryId: formData.categoryId || undefined
    }).subscribe({
      next: () => {
        this.showAskModal = false;
        this.newQuestion = { title: '', content: '', tagsInput: '', categoryId: '' };
        this.loadQuestions();
      }
    });
  }
}
