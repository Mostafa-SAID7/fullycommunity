import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QAService } from '../../../core/services/community/qa';
import { QuestionList, QuestionCategory, QuestionStatus } from '../../../core/interfaces/community/qa';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { StatsCardComponent } from '../../../shared/components';
import { SidebarLayoutComponent } from '../../../shared/components/sidebar-layout/sidebar-layout.component';
import { type SidebarShortcut } from '../../../shared/components/left-sidebar/left-sidebar.component';
import { type SponsoredItem, type EventReminder, type Contact } from '../../../shared/components/right-sidebar/right-sidebar.component';

// Import child components
import { QuestionListComponent } from './components/question-list/question-list.component';
import { AskQuestionModalComponent } from './components/ask-question-modal/ask-question-modal.component';

export interface NewQuestionForm {
  title: string;
  content: string;
  tagsInput: string;
  categoryId: string;
}

@Component({
  selector: 'app-qa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatsCardComponent,
    AskQuestionModalComponent,
    QuestionListComponent,
    SidebarLayoutComponent
  ],
  templateUrl: './qa.component.html'
})
export class QAComponent implements OnInit {
  private qaService = inject(QAService);
  private router = inject(Router);

  // Core data
  questions = signal<QuestionList[]>([]);
  categories = signal<QuestionCategory[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Modal state
  showAskModal = signal(false);

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

  showAdvancedFilters = signal(false);

  // New question form
  newQuestion: NewQuestionForm = {
    title: '',
    content: '',
    tagsInput: '',
    categoryId: ''
  };

  // Sidebar configuration
  shortcuts: SidebarShortcut[] = [
    { id: '1', name: 'Car Enthusiasts', image: '/assets/groups/car-enthusiasts.jpg', type: 'group' },
    { id: '2', name: 'DIY Mechanics', image: '/assets/groups/diy-mechanics.jpg', type: 'group' }
  ];

  sponsoredItems: SponsoredItem[] = [
    { id: '1', title: 'Premium Car Parts', url: 'autoparts.com', image: '/assets/ads/car-parts.jpg' }
  ];

  events: EventReminder[] = [
    { id: '1', title: 'Car Meet - Downtown', time: 'Tomorrow at 6:00 PM' }
  ];

  contacts: Contact[] = [
    { id: '1', name: 'John Doe', initials: 'JD', online: true },
    { id: '2', name: 'Alice Smith', initials: 'AS', online: true }
  ];

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

  loadQuestions() {
    this.loading.set(true);
    this.error.set(null);

    const filter: any = {
      searchTerm: this.searchTerm || undefined,
      tag: this.selectedTag || undefined,
      sortBy: this.sortBy as any
    };

    if (this.selectedStatus) {
      filter.status = (this.selectedStatus as unknown) as QuestionStatus;
    }
    if (this.selectedCategory) {
      filter.categoryId = this.selectedCategory;
    }
    if (this.bountyFilter === 'bounty') {
      filter.hasBounty = true;
    }
    if (this.bountyFilter === 'answered') {
      filter.hasAcceptedAnswer = true;
    }

    this.qaService.getQuestions(filter).subscribe({
      next: (result: any) => {
        this.questions.set(result.items);
        this.totalQuestions.set(result.totalCount);
        this.updateStats(result.items);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load questions:', err);
        this.error.set('Failed to load questions. Please check your connection and try again.');
        this.loading.set(false);
      }
    });
  }

  loadCategories() {
    this.qaService.getCategories().subscribe({
      next: (cats: any) => this.categories.set(cats),
      error: (err: any) => console.error('Failed to load categories:', err)
    });
  }

  updateStats(questions: QuestionList[]) {
    this.answeredCount.set(questions.filter(q => q.hasAcceptedAnswer).length);
    this.unansweredCount.set(questions.filter(q => q.answerCount === 0).length);
    // Note: bountyPoints is not available in QuestionList, only in full QuestionDto
    // To get accurate bounty count, we would need to fetch full details or add it to the list DTO
    this.bountyCount.set(0);
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

  navigateToTag(tag: string) {
    this.router.navigate(['/community/qa/tag', tag]);
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

  navigateToAskQuestion() {
    this.showAskModal.set(true);
  }

  onQuestionCreated() {
    this.showAskModal.set(false);
    this.loadQuestions(); // Refresh the questions list
  }

  onModalClosed() {
    this.showAskModal.set(false);
  }
}
