import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  persistent?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<ToastMessage[]>([]);
  
  toasts = this._toasts.asReadonly();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  show(toast: Omit<ToastMessage, 'id'>): string {
    const id = this.generateId();
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      closable: true,
      persistent: false,
      ...toast
    };

    this._toasts.update(toasts => [...toasts, newToast]);

    // Auto-remove toast after duration
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }

    return id;
  }

  remove(id: string): void {
    this._toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }

  // Convenience methods
  success(message: string, title?: string, options?: Partial<ToastMessage>): string {
    return this.show({
      type: 'success',
      message,
      title,
      ...options
    });
  }

  error(message: string, title?: string, options?: Partial<ToastMessage>): string {
    return this.show({
      type: 'error',
      message,
      title,
      duration: 0, // Don't auto-close error messages
      ...options
    });
  }

  warning(message: string, title?: string, options?: Partial<ToastMessage>): string {
    return this.show({
      type: 'warning',
      message,
      title,
      ...options
    });
  }

  info(message: string, title?: string, options?: Partial<ToastMessage>): string {
    return this.show({
      type: 'info',
      message,
      title,
      ...options
    });
  }
}