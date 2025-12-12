import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true
    }
  ]
})
export class SelectInputComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Select an option';
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'filled' | 'outlined' = 'default';
  @Input() multiple = false;
  
  @Output() selectionChange = new EventEmitter<any>();

  value: any = null;
  isOpen = false;
  
  private onChange = (value: any) => {};
  private onTouched = () => {};

  toggleDropdown() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  selectOption(option: SelectOption) {
    if (option.disabled) return;
    
    if (this.multiple) {
      const currentValue = Array.isArray(this.value) ? this.value : [];
      const index = currentValue.findIndex(v => v === option.value);
      
      if (index > -1) {
        currentValue.splice(index, 1);
      } else {
        currentValue.push(option.value);
      }
      
      this.value = [...currentValue];
    } else {
      this.value = option.value;
      this.isOpen = false;
    }
    
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
  }

  isSelected(option: SelectOption): boolean {
    if (this.multiple) {
      return Array.isArray(this.value) && this.value.includes(option.value);
    }
    return this.value === option.value;
  }

  getDisplayText(): string {
    if (this.multiple) {
      const selectedOptions = this.options.filter(opt => this.isSelected(opt));
      if (selectedOptions.length === 0) return this.placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} items selected`;
    }
    
    const selectedOption = this.options.find(opt => opt.value === this.value);
    return selectedOption ? selectedOption.label : this.placeholder;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getContainerClasses(): string {
    const classes = ['select-container'];
    
    classes.push(`select-${this.size}`);
    classes.push(`select-${this.variant}`);
    
    if (this.isOpen) classes.push('select-open');
    if (this.disabled) classes.push('select-disabled');
    if (this.error) classes.push('select-error');
    
    return classes.join(' ');
  }
}