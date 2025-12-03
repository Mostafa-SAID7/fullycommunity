import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() icon = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() clearable = false;
  
  @Output() cleared = new EventEmitter<void>();
  @Output() iconClicked = new EventEmitter<void>();

  value = '';
  focused = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get inputClasses(): string {
    const baseClasses = 'w-full font-segoe rounded-fluent border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const stateClasses = this.errorText 
      ? 'border-error focus:border-error focus:ring-error/50' 
      : 'border-border dark:border-border-dark focus:border-primary';

    const iconPadding = this.icon 
      ? (this.iconPosition === 'left' ? 'pl-10' : 'pr-10')
      : '';

    const clearablePadding = this.clearable && this.value ? 'pr-10' : '';
    
    return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses} ${iconPadding} ${clearablePadding} bg-background dark:bg-background-dark text-secondary-900 dark:text-secondary-100`.trim();
  }

  get containerClasses(): string {
    return 'relative';
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.onTouched();
  }

  clear() {
    this.value = '';
    this.onChange(this.value);
    this.cleared.emit();
  }

  onIconClick() {
    this.iconClicked.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}