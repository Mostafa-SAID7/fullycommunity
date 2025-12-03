import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html'
})
export class ToastComponent implements OnInit {
  @Input() type: ToastType = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() duration = 5000;
  @Input() closable = true;
  @Input() persistent = false;
  
  @Output() closed = new EventEmitter<void>();

  visible = true;

  ngOnInit() {
    if (!this.persistent && this.duration > 0) {
      setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  get toastClasses(): string {
    const baseClasses = 'max-w-sm w-full bg-background dark:bg-background-dark shadow-fluent-lg rounded-fluent-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-slide-up';
    
    const typeClasses = {
      success: 'border-l-4 border-success',
      error: 'border-l-4 border-error',
      warning: 'border-l-4 border-warning',
      info: 'border-l-4 border-info'
    };
    
    return `${baseClasses} ${typeClasses[this.type]}`.trim();
  }

  get iconPath(): string {
    const icons = {
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[this.type];
  }

  get iconColor(): string {
    const colors = {
      success: 'text-success',
      error: 'text-error',
      warning: 'text-warning',
      info: 'text-info'
    };
    return colors[this.type];
  }

  close() {
    this.visible = false;
    setTimeout(() => {
      this.closed.emit();
    }, 200);
  }
}