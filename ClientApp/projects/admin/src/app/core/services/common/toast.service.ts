import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastId = 0;
  toasts = signal<Toast[]>([]);

  show(type: Toast['type'], message: string, duration = 5000, position: Toast['position'] = 'top-right') {
    const id = ++this.toastId;
    const toast: Toast = { id, type, message, duration, position };
    
    this.toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string, duration?: number, position?: Toast['position']) {
    this.show('success', message, duration, position);
  }

  error(message: string, duration?: number, position?: Toast['position']) {
    this.show('error', message, duration, position);
  }

  warning(message: string, duration?: number, position?: Toast['position']) {
    this.show('warning', message, duration, position);
  }

  info(message: string, duration?: number, position?: Toast['position']) {
    this.show('info', message, duration, position);
  }

  remove(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }

  // Convenience methods for different positions
  successTopRight(message: string, duration?: number) {
    this.success(message, duration, 'top-right');
  }

  errorTopRight(message: string, duration?: number) {
    this.error(message, duration, 'top-right');
  }

  warningTopRight(message: string, duration?: number) {
    this.warning(message, duration, 'top-right');
  }

  infoTopRight(message: string, duration?: number) {
    this.info(message, duration, 'top-right');
  }
}
