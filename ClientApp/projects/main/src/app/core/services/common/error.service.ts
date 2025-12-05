import { Injectable, signal } from '@angular/core';
import { AppError } from '../../types/common.types';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errors = signal<AppError[]>([]);
  readonly currentErrors = this.errors.asReadonly();

  showError(message: string) {
    this.addNotification(message, 'error');
  }

  showWarning(message: string) {
    this.addNotification(message, 'warning');
  }

  showInfo(message: string) {
    this.addNotification(message, 'info');
  }

  showSuccess(message: string) {
    this.addNotification(message, 'success');
  }

  private addNotification(message: string, type: AppError['type']) {
    const error: AppError = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: new Date()
    };
    this.errors.update(e => [...e, error]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => this.dismiss(error.id), 5000);
  }

  dismiss(id: string) {
    this.errors.update(e => e.filter(err => err.id !== id));
  }

  clearAll() {
    this.errors.set([]);
  }
}
