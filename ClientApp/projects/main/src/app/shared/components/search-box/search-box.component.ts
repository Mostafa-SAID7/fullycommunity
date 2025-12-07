import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface SearchConfig {
  placeholder?: string;
  debounceTime?: number;
  minLength?: number;
  showClearButton?: boolean;
  showSearchIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
}

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative" [ngClass]="containerClass">
      <!-- Search Input Wrapper -->
      <div class="relative flex items-center group" [ngClass]="getWrapperClasses()">
        <!-- Search Icon -->
        <div *ngIf="config.showSearchIcon !== false" class="absolute left-3 pointer-events-none transition-colors duration-300" [class.text-primary]="isFocused" [class.text-gray-400]="!isFocused">
          <svg 
            [ngClass]="getIconSize()"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Input Field -->
        <input
          #searchInput
          type="text"
          class="w-full outline-none transition-all placeholder-transition"
          [ngClass]="getInputClasses()"
          [placeholder]="config.placeholder || 'Search...'"
          [(ngModel)]="searchTerm"
          (input)="onInput($event)"
          (keyup.enter)="onEnter()"
          (focus)="onFocus()"
          (blur)="onBlur()"
          [attr.aria-label]="config.placeholder || 'Search'"
          autocomplete="off" />

        <!-- Clear Button -->
        <button
          *ngIf="config.showClearButton !== false && searchTerm"
          type="button"
          class="absolute right-3 text-gray-400 hover:text-primary transition-colors animate-fade-in-fast"
          (click)="clearSearch()"
          [attr.aria-label]="'Clear search'">
          <svg 
            [ngClass]="getIconSize()"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Search Suggestions -->
      <div 
        *ngIf="showSuggestions && suggestions.length > 0 && isFocused" 
        class="absolute z-50 w-full mt-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-fluent-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-md animate-slide-down">
        <div
          *ngFor="let suggestion of suggestions; trackBy: trackBySuggestion"
          class="flex items-center justify-between px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 cursor-pointer transition-all border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0 group"
          (click)="selectSuggestion(suggestion)">
          <div class="flex items-center gap-2">
             <svg class="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             <span class="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-primary transition-colors">{{ suggestion.text }}</span>
          </div>
          <span 
            *ngIf="suggestion.count" 
            class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors">
            {{ suggestion.count }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-transition::placeholder {
      transition: color 0.3s ease;
    }
    :host.focused .placeholder-transition::placeholder {
      color: #9ca3af;
    }
  `]
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  @Input() config: SearchConfig = {};
  @Input() suggestions: Array<{ text: string; count?: number }> = [];
  @Input() showSuggestions = false;
  @Input() containerClass = '';

  @Output() search = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<string>();

  searchTerm = '';
  isFocused = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  get size(): string {
    return this.config.size || 'md';
  }

  get variant(): string {
    return this.config.variant || 'default';
  }

  ngOnInit(): void {
    const debounceMs = this.config.debounceTime || 300;
    this.searchSubject
      .pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((term: string) => {
        if (term.length >= (this.config.minLength || 0)) {
          this.search.emit(term);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
    this.searchChange.emit(this.searchTerm);
  }

  onEnter(): void {
    if (this.searchTerm.trim()) {
      this.search.emit(this.searchTerm.trim());
      this.isFocused = false;
    }
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    // Delay to allow click on suggestions
    setTimeout(() => {
      this.isFocused = false;
    }, 200);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
    this.searchChange.emit('');
    this.search.emit('');
    this.searchInput.nativeElement.focus();
  }

  selectSuggestion(suggestion: { text: string; count?: number }): void {
    this.searchTerm = suggestion.text;
    this.suggestionSelected.emit(suggestion.text);
    this.search.emit(suggestion.text);
    this.isFocused = false;
  }

  trackBySuggestion(_index: number, item: { text: string; count?: number }): string {
    return item.text;
  }

  focus(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  getWrapperClasses(): string {
    const classes: string[] = [];

    // Variant styles
    switch (this.variant) {
      case 'outlined':
        classes.push('border-2 border-gray-300 dark:border-gray-600 bg-transparent');
        break;
      case 'filled':
        classes.push('bg-gray-100/50 dark:bg-gray-800/50 border border-transparent backdrop-blur-sm');
        break;
      default:
        // Default is now slightly transparent/glassy
        classes.push('bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-sm');
    }

    classes.push('rounded-lg transition-all duration-300');

    if (this.isFocused) {
      // Fluent focus: Primary ring + Border
      classes.push('ring-2 ring-primary/20 border-primary dark:border-primary shadow-fluent');
    } else {
      classes.push('hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm');
    }

    return classes.join(' ');
  }

  getInputClasses(): string {
    const classes: string[] = [];

    // Size styles
    switch (this.size) {
      case 'sm':
        classes.push('text-sm py-1.5');
        break;
      case 'lg':
        classes.push('text-base py-3');
        break;
      default:
        classes.push('text-sm py-2');
    }

    // Padding based on icons
    if (this.config.showSearchIcon !== false) {
      classes.push('pl-10');
    } else {
      classes.push('pl-4');
    }

    if (this.config.showClearButton !== false && this.searchTerm) {
      classes.push('pr-10');
    } else {
      classes.push('pr-4');
    }

    // Variant styles
    switch (this.variant) {
      case 'filled':
        classes.push('bg-transparent');
        break;
      default:
        classes.push('bg-transparent');
    }

    classes.push('text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500');

    return classes.join(' ');
  }

  getIconSize(): string {
    switch (this.size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  }
}
