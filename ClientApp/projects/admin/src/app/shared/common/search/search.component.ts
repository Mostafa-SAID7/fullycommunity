import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Input() placeholder = 'Search...';
  @Input() value = '';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() showClearButton = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'filled' | 'outlined' = 'default';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  focused = signal(false);

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearch();
    }
    
    if (event.key === 'Escape') {
      this.onClear();
    }
  }

  onSearch() {
    if (!this.disabled && !this.loading) {
      this.search.emit(this.value);
    }
  }

  onClear() {
    if (!this.disabled && !this.loading) {
      this.value = '';
      this.valueChange.emit(this.value);
      this.clear.emit();
    }
  }

  onFocus() {
    this.focused.set(true);
  }

  onBlur() {
    this.focused.set(false);
  }

  getContainerClasses(): string {
    const classes = ['search-container'];
    
    classes.push(`search-${this.size}`);
    classes.push(`search-${this.variant}`);
    
    if (this.focused()) classes.push('search-focused');
    if (this.disabled) classes.push('search-disabled');
    if (this.loading) classes.push('search-loading');
    
    return classes.join(' ');
  }
}