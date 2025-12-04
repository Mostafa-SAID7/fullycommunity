import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchInputComponent, SelectComponent, ChipComponent, ButtonComponent } from '../../ui';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'search' | 'date' | 'range';
  options?: { label: string; value: any }[];
  placeholder?: string;
  value?: any;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchInputComponent, SelectComponent, ChipComponent, ButtonComponent],
  template: `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border dark:border-gray-700 space-y-4">
      <!-- Filter Controls -->
      <div class="flex flex-wrap gap-4">
        <div *ngFor="let filter of filters; trackBy: trackByKey" class="flex-1 min-w-48">
          
          <!-- Search Input -->
          <ui-search-input
            *ngIf="filter.type === 'search'"
            [(ngModel)]="filter.value"
            [placeholder]="filter.placeholder || 'Search...'"
            (searched)="onFilterChange(filter.key, $event)"
            size="md">
          </ui-search-input>
          
          <!-- Select -->
          <ui-select
            *ngIf="filter.type === 'select'"
            [(ngModel)]="filter.value"
            [options]="filter.options || []"
            [placeholder]="filter.placeholder || filter.label"
            (selectionChange)="onFilterChange(filter.key, $event)"
            size="md"
            [fullWidth]="true">
          </ui-select>
          
          <!-- Multi-select (using chips) -->
          <div *ngIf="filter.type === 'multiselect'" class="space-y-2">
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {{ filter.label }}
            </label>
            <div class="flex flex-wrap gap-1">
              <ui-chip
                *ngFor="let option of filter.options"
                [label]="option.label"
                [variant]="isSelected(filter.value, option.value) ? 'primary' : 'default'"
                [clickable]="true"
                (clicked)="toggleMultiSelect(filter, option.value)">
              </ui-chip>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters & Actions -->
      <div class="flex items-center justify-between pt-2 border-t border-border dark:border-gray-600" *ngIf="hasActiveFilters || showClearAll">
        <div class="flex flex-wrap gap-2">
          <span class="text-sm text-secondary-600 dark:text-secondary-400 self-center">Active filters:</span>
          <ui-chip
            *ngFor="let activeFilter of activeFilters"
            [label]="activeFilter.label"
            variant="primary"
            [removable]="true"
            (removed)="removeFilter(activeFilter.key)">
          </ui-chip>
        </div>
        
        <ui-button
          *ngIf="showClearAll"
          variant="ghost"
          size="sm"
          (clicked)="clearAllFilters()">
          Clear All
        </ui-button>
      </div>
    </div>
  `
})
export class FilterBarComponent {
  @Input() filters: FilterOption[] = [];
  @Input() showClearAll = true;
  
  @Output() filtersChanged = new EventEmitter<{ [key: string]: any }>();
  @Output() filterCleared = new EventEmitter<string>();
  @Output() allFiltersCleared = new EventEmitter<void>();

  get hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }

  get activeFilters(): { key: string; label: string }[] {
    return this.filters
      .filter(filter => this.hasValue(filter.value))
      .map(filter => ({
        key: filter.key,
        label: this.getFilterLabel(filter)
      }));
  }

  onFilterChange(key: string, value: any) {
    const filter = this.filters.find(f => f.key === key);
    if (filter) {
      filter.value = value;
      this.emitFiltersChanged();
    }
  }

  toggleMultiSelect(filter: FilterOption, value: any) {
    if (!filter.value) {
      filter.value = [];
    }
    
    const index = filter.value.indexOf(value);
    if (index > -1) {
      filter.value.splice(index, 1);
    } else {
      filter.value.push(value);
    }
    
    this.emitFiltersChanged();
  }

  removeFilter(key: string) {
    const filter = this.filters.find(f => f.key === key);
    if (filter) {
      filter.value = filter.type === 'multiselect' ? [] : '';
      this.filterCleared.emit(key);
      this.emitFiltersChanged();
    }
  }

  clearAllFilters() {
    this.filters.forEach(filter => {
      filter.value = filter.type === 'multiselect' ? [] : '';
    });
    this.allFiltersCleared.emit();
    this.emitFiltersChanged();
  }

  isSelected(filterValue: any[], value: any): boolean {
    return Array.isArray(filterValue) && filterValue.includes(value);
  }

  trackByKey(index: number, filter: FilterOption): string {
    return filter.key;
  }

  private hasValue(value: any): boolean {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  }

  private getFilterLabel(filter: FilterOption): string {
    if (filter.type === 'multiselect' && Array.isArray(filter.value)) {
      return `${filter.label} (${filter.value.length})`;
    }
    
    if (filter.type === 'select' && filter.options) {
      const option = filter.options.find(opt => opt.value === filter.value);
      return option ? `${filter.label}: ${option.label}` : filter.label;
    }
    
    return `${filter.label}: ${filter.value}`;
  }

  private emitFiltersChanged() {
    const filterValues: { [key: string]: any } = {};
    this.filters.forEach(filter => {
      if (this.hasValue(filter.value)) {
        filterValues[filter.key] = filter.value;
      }
    });
    this.filtersChanged.emit(filterValues);
  }
}