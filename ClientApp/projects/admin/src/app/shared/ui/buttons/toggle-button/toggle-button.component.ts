import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButtonComponent),
      multi: true
    }
  ]
})
export class ToggleButtonComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() label?: string;
  @Input() labelPosition: 'left' | 'right' = 'right';
  
  @Output() change = new EventEmitter<boolean>();

  value = false;
  
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  toggle() {
    if (this.disabled) return;
    
    this.value = !this.value;
    this.onChange(this.value);
    this.onTouched();
    this.change.emit(this.value);
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getContainerClasses(): string {
    const classes = ['toggle-container'];
    
    classes.push(`toggle-${this.size}`);
    
    if (this.disabled) classes.push('toggle-disabled');
    
    return classes.join(' ');
  }

  getToggleClasses(): string {
    const classes = ['toggle-switch'];
    
    classes.push(`toggle-${this.size}`);
    classes.push(`toggle-${this.color}`);
    
    if (this.value) classes.push('toggle-active');
    if (this.disabled) classes.push('toggle-disabled');
    
    return classes.join(' ');
  }
}