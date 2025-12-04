import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
}

export type SelectSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <label *ngIf="label" [class]="labelClasses">
        {{ label }}
        <span *ngIf="required" class="text-error ml-1">*</span>
      </label>
      
      <div class="relative">
        <select
          [value]="value"
          [disabled]="disabled"
          [required]="required"
          (change)="onChange($event)"
          (blur)="onBlur()"
          [class]="selectClasses">
          
          <option value="" disabled>{{ placeholder }}</option>
          
          <ng-container *ngFor="let option of options">
            <option 
              [value]="option.value" 
              [disabled]="option.disabled">
              {{ option.label }}
            </option>
          </ng-container>
        </select>
        
        <!-- Custom Arrow -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <p *ngIf="helperText && !errorText" [class]="helperClasses">{{ helperText }}</p>
      <p *ngIf="errorText" [class]="errorClasses">{{ errorText }}</p>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() size: SelectSize = 'md';
  @Input() placeholder = 'Select an option';
  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() fullWidth = true;
  
  @Output() selectionChange = new EventEmitter<any>();

  value = '';
  
  private onChangeFn = (value: any) => {};
  private onTouchedFn = () => {};

  get containerClasses(): string {
    const baseClasses = 'space-y-1';
    const widthClass = this.fullWidth ? 'w-full' : 'w-auto';
    return `${baseClasses} ${widthClass}`.trim();
  }

  get labelClasses(): string {
    return 'block text-sm font-medium text-secondary-700 dark:text-secondary-300';
  }

  get selectClasses(): string {
    const baseClasses = 'w-full font-segoe rounded-fluent border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-background dark:bg-background-dark text-secondary-900 dark:text-secondary-100';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm pr-8',
      md: 'px-4 py-2 text-sm pr-10',
      lg: 'px-4 py-3 text-base pr-10'
    };

    const stateClasses = this.errorText 
      ? 'border-error focus:border-error focus:ring-error/50' 
      : 'border-border dark:border-border-dark focus:border-primary';
    
    return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses}`.trim();
  }

  get helperClasses(): string {
    return 'text-xs text-secondary-500 dark:text-secondary-400';
  }

  get errorClasses(): string {
    return 'text-xs text-error';
  }

  onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChangeFn(this.value);
    this.selectionChange.emit(this.value);
  }

  onBlur() {
    this.onTouchedFn();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}