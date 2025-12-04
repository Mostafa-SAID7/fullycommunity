import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SearchInputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-search-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <div class="relative">
        <!-- Search Icon -->
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <!-- Input -->
        <input
          type="search"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (keyup.enter)="onEnter()"
          (keyup.escape)="onEscape()"
          [class]="inputClasses">
        
        <!-- Clear Button -->
        <button
          *ngIf="clearable && value && !disabled && !readonly"
          type="button"
          (click)="clear()"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- Loading Spinner -->
        <div *ngIf="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <div class="w-4 h-4 border-2 border-gray-200 dark:border-gray-600 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
      
      <!-- Helper Text -->
      <p *ngIf="helperText && !errorText" [class]="helperClasses">{{ helperText }}</p>
      <p *ngIf="errorText" [class]="errorClasses">{{ errorText }}</p>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true
    }
  ]
})
export class SearchInputComponent implements ControlValueAccessor {
  @Input() size: SearchInputSize = 'md';
  @Input() placeholder = 'Search...';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() clearable = true;
  @Input() loading = false;
  @Input() fullWidth = true;
  @Input() debounceTime = 300;
  
  @Output() searched = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();
  @Output() focusChanged = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  value = '';
  isFocused = false;
  private debounceTimer: any;
  
  private onChangeFn = (value: string) => {};
  private onTouchedFn = () => {};

  get containerClasses(): string {
    const baseClasses = 'space-y-1';
    const widthClass = this.fullWidth ? 'w-full' : 'w-auto';
    return `${baseClasses} ${widthClass}`.trim();
  }

  get inputClasses(): string {
    const baseClasses = 'w-full font-segoe rounded-fluent border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed bg-background dark:bg-background-dark text-secondary-900 dark:text-secondary-100';
    
    const sizeClasses = {
      sm: 'pl-9 pr-3 py-1.5 text-sm',
      md: 'pl-10 pr-4 py-2 text-sm',
      lg: 'pl-10 pr-4 py-3 text-base'
    };

    const stateClasses = this.errorText 
      ? 'border-error focus:border-error focus:ring-error/50' 
      : 'border-border dark:border-border-dark focus:border-primary';

    const clearablePadding = this.clearable && this.value && !this.loading ? 'pr-10' : '';
    const loadingPadding = this.loading ? 'pr-10' : '';
    
    return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses} ${clearablePadding} ${loadingPadding}`.trim();
  }

  get helperClasses(): string {
    return 'text-xs text-secondary-500 dark:text-secondary-400';
  }

  get errorClasses(): string {
    return 'text-xs text-error';
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChangeFn(this.value);
    
    // Debounced search
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.searched.emit(this.value);
    }, this.debounceTime);
  }

  onFocus() {
    this.isFocused = true;
    this.focusChanged.emit();
  }

  onBlur() {
    this.isFocused = false;
    this.onTouchedFn();
    this.blurred.emit();
  }

  onEnter() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.searched.emit(this.value);
  }

  onEscape() {
    if (this.clearable) {
      this.clear();
    }
  }

  clear() {
    this.value = '';
    this.onChangeFn(this.value);
    this.cleared.emit();
    this.searched.emit(this.value);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}