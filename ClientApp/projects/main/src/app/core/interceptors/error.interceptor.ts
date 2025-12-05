import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/common/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const currentUrl = router.url;
      
      // Public pages - don't redirect on 401/403
      const publicPaths = ['/podcasts', '/videos', '/marketplace', '/community', '/services', '/', '/login', '/register'];
      const isPublicPage = publicPaths.some(path => currentUrl.startsWith(path) || currentUrl === path);

      switch (error.status) {
        case 0:
          if (!isPublicPage) {
            (errorService as any).showError('Unable to connect to server.');
          }
          break;
        case 400:
          (errorService as any).showError(error.error?.message || 'Bad request.');
          break;
        case 401:
          // Don't redirect on public pages - let component handle it
          if (!isPublicPage) {
            (errorService as any).showError('Session expired. Please login again.');
            router.navigate(['/login']);
          }
          break;
        case 403:
          if (!isPublicPage) {
            (errorService as any).showError('You do not have permission.');
            router.navigate(['/forbidden']);
          }
          break;
        case 422:
          (errorService as any).showError(error.error?.message || 'Validation error.');
          break;
        case 500:
          (errorService as any).showError('Server error. Please try again later.');
          break;
        case 503:
          (errorService as any).showError('Service temporarily unavailable.');
          break;
      }

      return throwError(() => ({ status: error.status, message: error.message, error: error.error }));
    })
  );
};
