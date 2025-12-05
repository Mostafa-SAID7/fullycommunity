import { Injectable, ErrorHandler, inject, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

export interface AppError {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  details?: any;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface ToastNotification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private router = inject(Router);
  private ngZone = inject(NgZone);

  private errorsSubject = new BehaviorSubject<AppError[]>([]);
  private toastSubject = new Subject<ToastNotification>();

  public errors$ = this.errorsSubject.asObservable();
  public toast$ = this.toastSubject.asObservable();

  handleError(error: any): void {
    console.error('Global error caught:', error);

    // Handle different types of errors
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (error instanceof Error) {
      this.handleJavaScriptError(error);
    } else {
      this.handleUnknownError(error);
    }
  }

  handleHttpError(error: HttpErrorResponse): void {
    let errorMessage = 'An unexpected error occurred';
    let errorTitle = 'Error';

    switch (error.status) {
      case 0:
        errorTitle = 'Network Error';
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        break;
      case 400:
        errorTitle = 'Bad Request';
        errorMessage = error.error?.message || 'The request was invalid.';
        break;
      case 401:
        errorTitle = 'Unauthorized';
        errorMessage = 'Your session has expired. Please log in again.';
        this.ngZone.run(() => {
          this.router.navigate(['/auth/login']);
        });
        break;
      case 403:
        errorTitle = 'Forbidden';
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorTitle = 'Not Found';
        errorMessage = 'The requested resource was not found.';
        break;
      case 422:
        errorTitle = 'Validation Error';
        errorMessage = this.formatValidationErrors(error.error?.errors) || 'Please check your input and try again.';
        break;
      case 429:
        errorTitle = 'Too Many Requests';
        errorMessage = 'You are making too many requests. Please wait a moment and try again.';
        break;
      case 500:
        errorTitle = 'Server Error';
        errorMessage = 'An internal server error occurred. Please try again later.';
        break;
      case 502:
      case 503:
      case 504:
        errorTitle = 'Service Unavailable';
        errorMessage = 'The service is temporarily unavailable. Please try again later.';
        break;
      default:
        errorTitle = `Error ${error.status}`;
        errorMessage = error.error?.message || error.message || errorMessage;
    }

    this.addError({
      type: 'error',
      title: errorTitle,
      message: errorMessage,
      details: error
    });

    // Show toast for certain errors
    if ([400, 422, 429].includes(error.status)) {
      this.showToast({
        type: 'error',
        title: errorTitle,
        message: errorMessage,
        duration: 5000
      });
    }
  }

  handleJavaScriptError(error: Error): void {
    const errorTitle = error.name || 'JavaScript Error';
    const errorMessage = error.message || 'An unexpected error occurred';

    this.addError({
      type: 'error',
      title: errorTitle,
      message: errorMessage,
      details: {
        stack: error.stack,
        name: error.name
      }
    });

    // Don't show toast for JS errors in production
    if (!environment.production) {
      this.showToast({
        type: 'error',
        title: errorTitle,
        message: errorMessage,
        duration: 8000
      });
    }
  }

  handleUnknownError(error: any): void {
    const errorMessage = typeof error === 'string' ? error : 'An unknown error occurred';
    
    this.addError({
      type: 'error',
      title: 'Unknown Error',
      message: errorMessage,
      details: error
    });
  }

  // Public methods for manual error handling
  showError(title: string, message: string, details?: any): void {
    this.addError({
      type: 'error',
      title,
      message,
      details
    });

    this.showToast({
      type: 'error',
      title,
      message,
      duration: 5000
    });
  }

  showWarning(title: string, message: string): void {
    this.showToast({
      type: 'warning',
      title,
      message,
      duration: 4000
    });
  }

  showInfo(title: string, message: string): void {
    this.showToast({
      type: 'info',
      title,
      message,
      duration: 3000
    });
  }

  showSuccess(title: string, message: string): void {
    this.showToast({
      type: 'success',
      title,
      message,
      duration: 3000
    });
  }

  clearErrors(): void {
    this.errorsSubject.next([]);
  }

  removeError(errorId: string): void {
    const currentErrors = this.errorsSubject.value;
    const updatedErrors = currentErrors.filter(error => error.id !== errorId);
    this.errorsSubject.next(updatedErrors);
  }

  private addError(errorData: Omit<AppError, 'id' | 'timestamp'>): void {
    const error: AppError = {
      ...errorData,
      id: this.generateId(),
      timestamp: new Date()
    };

    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next([...currentErrors, error]);

    // Keep only last 50 errors
    if (currentErrors.length > 50) {
      this.errorsSubject.next(currentErrors.slice(-50));
    }
  }

  private showToast(toastData: Omit<ToastNotification, 'id'>): void {
    const toast: ToastNotification = {
      ...toastData,
      id: this.generateId()
    };

    this.toastSubject.next(toast);
  }

  private formatValidationErrors(errors: any): string {
    if (!errors) return '';

    if (typeof errors === 'string') return errors;

    if (Array.isArray(errors)) {
      return errors.join(', ');
    }

    if (typeof errors === 'object') {
      const messages: string[] = [];
      for (const [field, fieldErrors] of Object.entries(errors)) {
        if (Array.isArray(fieldErrors)) {
          messages.push(`${field}: ${fieldErrors.join(', ')}`);
        } else if (typeof fieldErrors === 'string') {
          messages.push(`${field}: ${fieldErrors}`);
        }
      }
      return messages.join('; ');
    }

    return 'Validation failed';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Import environment
import { environment } from '../../../../environments/environment';