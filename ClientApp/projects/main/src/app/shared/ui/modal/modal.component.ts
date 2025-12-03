import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() size: ModalSize = 'md';
  @Input() title = '';
  @Input() closable = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  
  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();

  ngOnInit() {
    if (this.closeOnEscape) {
      document.addEventListener('keydown', this.handleEscape);
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleEscape);
  }

  get modalClasses(): string {
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    };

    return `relative bg-background dark:bg-background-dark rounded-fluent-lg shadow-fluent-xl transform transition-all ${sizeClasses[this.size]}`.trim();
  }

  close() {
    if (this.closable) {
      this.isOpen = false;
      this.closed.emit();
    }
  }

  onBackdropClick() {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  private handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  };
}