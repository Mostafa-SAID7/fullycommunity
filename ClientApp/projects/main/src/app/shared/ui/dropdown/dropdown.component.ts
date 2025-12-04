import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DropdownItem {
  label: string;
  value: any;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
}

export type DropdownSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements OnInit, OnDestroy {
  @Input() items: DropdownItem[] = [];
  @Input() placeholder = 'Select an option';
  @Input() disabled = false;
  @Input() searchable = false;
  @Input() multiple = false;
  @Input() selectedValue: any = null;
  @Input() selectedValues: any[] = [];
  @Input() size: DropdownSize = 'md';
  @Input() fullWidth = false;
  
  @Output() selectionChange = new EventEmitter<any>();
  @Output() multiSelectionChange = new EventEmitter<any[]>();

  isOpen = false;
  searchQuery = '';
  filteredItems: DropdownItem[] = [];

  ngOnInit() {
    this.filteredItems = [...this.items];
    document.addEventListener('click', this.handleOutsideClick);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  get containerClasses(): string {
    return this.fullWidth ? 'w-full' : 'w-auto';
  }

  get triggerClasses(): string {
    const baseClasses = 'relative flex items-center justify-between font-segoe rounded-fluent border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed bg-background dark:bg-background-dark text-secondary-900 dark:text-secondary-100 border-border dark:border-border-dark hover:border-primary dark:hover:border-primary';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-2',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-4 py-3 text-base gap-3'
    };

    const widthClass = this.fullWidth ? 'w-full' : 'min-w-48';
    
    return `${baseClasses} ${sizeClasses[this.size]} ${widthClass}`.trim();
  }

  get menuClasses(): string {
    return 'absolute z-50 mt-1 w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-fluent shadow-fluent-lg max-h-80 overflow-hidden';
  }

  get selectedLabel(): string {
    if (this.multiple) {
      return this.selectedValues.length > 0 
        ? `${this.selectedValues.length} selected`
        : this.placeholder;
    }
    
    const selected = this.items.find(item => item.value === this.selectedValue);
    return selected ? selected.label : this.placeholder;
  }

  toggle() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.filterItems();
      }
    }
  }

  selectItem(item: DropdownItem) {
    if (item.disabled) return;

    if (this.multiple) {
      const index = this.selectedValues.indexOf(item.value);
      if (index > -1) {
        this.selectedValues.splice(index, 1);
      } else {
        this.selectedValues.push(item.value);
      }
      this.multiSelectionChange.emit([...this.selectedValues]);
    } else {
      this.selectedValue = item.value;
      this.selectionChange.emit(item.value);
      this.isOpen = false;
    }
  }

  isSelected(item: DropdownItem): boolean {
    if (this.multiple) {
      return this.selectedValues.includes(item.value);
    }
    return this.selectedValue === item.value;
  }

  getItemClasses(item: DropdownItem): string {
    const baseClasses = 'w-full flex items-center px-3 py-2 text-sm text-left transition-colors duration-150';
    const stateClasses = item.disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-secondary-50 dark:hover:bg-secondary-800 focus:bg-secondary-50 dark:focus:bg-secondary-800 focus:outline-none';
    const selectedClasses = this.isSelected(item) 
      ? 'bg-primary/10 text-primary' 
      : 'text-secondary-900 dark:text-secondary-100';
    
    return `${baseClasses} ${stateClasses} ${selectedClasses}`.trim();
  }

  filterItems() {
    if (!this.searchQuery) {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item =>
        item.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.filterItems();
  }

  trackByValue(index: number, item: DropdownItem): any {
    return item.value;
  }

  private handleOutsideClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isOpen = false;
    }
  };
}