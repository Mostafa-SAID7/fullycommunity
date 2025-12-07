import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface QuestionCategory {
  id: string;
  name: string;
}

@Component({
  selector: 'app-qa-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Search Bar -->
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input type="text" 
                   [(ngModel)]="searchTerm"
                   (input)="onSearchInput($event)"
                   placeholder="Search questions, answers, tags, or users..."
                   class="w-full pl-12 pr-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <div *ngIf="searchTerm()" class="absolute inset-y-0 right-0 flex items-center pr-4">
              <button (click)="clearSearch()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Sort and View Controls -->
        <div class="flex items-center gap-4">
          <!-- Sort Tabs -->
          <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button *ngFor="let sort of sortOptions(); trackBy: trackBySortValue"
                    (click)="selectSort(sort.value)"
                    [class.bg-white]="sortBy() === sort.value"
                    [class.dark:bg-gray-700]="sortBy() === sort.value"
                    [class.text-blue-600]="sortBy() === sort.value"
                    [class.dark:text-blue-400]="sortBy() === sort.value"
                    [class.shadow-sm]="sortBy() === sort.value"
                    class="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="sort.icon"/>
              </svg>
              {{ sort.label }}
            </button>
          </div>

          <!-- View Mode Toggle -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button (click)="setViewMode('card')"
                    class="p-2 rounded-md transition-all"
                    [class.bg-white]="viewMode() === 'card'"
                    [class.dark:bg-gray-700]="viewMode() === 'card'"
                    [class.text-blue-600]="viewMode() === 'card'"
                    [class.dark:text-blue-400]="viewMode() === 'card'"
                    [class.shadow-sm]="viewMode() === 'card'"
                    title="Card View">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button (click)="setViewMode('compact')"
                    class="p-2 rounded-md transition-all"
                    [class.bg-white]="viewMode() === 'compact'"
                    [class.dark:bg-gray-700]="viewMode() === 'compact'"
                    [class.text-blue-600]="viewMode() === 'compact'"
                    [class.dark:text-blue-400]="viewMode() === 'compact'"
                    [class.shadow-sm]="viewMode() === 'compact'"
                    title="Compact View">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div *ngIf="showAdvancedFilters()" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select [(ngModel)]="selectedStatus" (change)="filtersChanged.emit()" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Questions</option>
              <option value="Open">Open</option>
              <option value="Answered">Answered</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select [(ngModel)]="selectedCategory" (change)="filtersChanged.emit()" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories()" [value]="category.id">{{ category.name }}</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
            <select [(ngModel)]="dateFilter" (change)="filtersChanged.emit()" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <!-- Bounty Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bounty</label>
            <select [(ngModel)]="bountyFilter" (change)="filtersChanged.emit()" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Questions</option>
              <option value="with-bounty">With Bounty</option>
              <option value="no-bounty">No Bounty</option>
            </select>
          </div>
        </div>

        <!-- Popular Tags -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Popular Tags</label>
          <div class="flex flex-wrap gap-2">
            <button 
              *ngFor="let tag of popularTags()"
              (click)="filterByTag(tag)"
              [ngClass]="{
                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-500 border-2': selectedTag() === tag
              }"
              class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer">
              #{{ tag }}
              <span *ngIf="getTagCount(tag)" class="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded-full">
                {{ getTagCount(tag) }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QASearchFiltersComponent {
  // Inputs
  categories = input.required<QuestionCategory[]>();
  showAdvancedFilters = input.required<boolean>();
  sortOptions = input.required<any[]>();
  popularTags = input.required<string[]>();

  // Two-way bindings
  searchTerm = model.required<string>();
  sortBy = model.required<string>();
  viewMode = model.required<'card' | 'compact'>();
  selectedStatus = model.required<string>();
  selectedCategory = model.required<string>();
  selectedTag = model.required<string>();
  dateFilter = model.required<string>();
  bountyFilter = model.required<string>();

  // Outputs
  searchInput = output<Event>();
  filtersChanged = output<void>();
  tagSelected = output<string>();
  viewModeChanged = output<'card' | 'compact'>();
  sortChanged = output<string>();

  onSearchInput(event: Event) {
    this.searchInput.emit(event);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.filtersChanged.emit();
  }

  selectSort(value: string) {
    this.sortBy.set(value);
    this.sortChanged.emit(value);
  }

  setViewMode(mode: 'card' | 'compact') {
    this.viewMode.set(mode);
    this.viewModeChanged.emit(mode);
  }

  filterByTag(tag: string) {
    const currentTag = this.selectedTag() === tag ? '' : tag;
    this.selectedTag.set(currentTag);
    this.tagSelected.emit(currentTag);
  }

  getTagCount(tag: string): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  trackBySortValue(index: number, item: any): string {
    return item.value;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }
}