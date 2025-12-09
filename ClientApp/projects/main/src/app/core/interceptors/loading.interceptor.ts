import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

/**
 * Loading interceptor - tracks HTTP requests for loading indicators
 * Note: You'll need to create a LoadingService to use this
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Uncomment when LoadingService is created
  // const loadingService = inject(LoadingService);
  
  // Skip loading for certain endpoints
  const skipLoading = req.headers.has('X-Skip-Loading') || 
                      req.url.includes('/notifications/count') ||
                      req.url.includes('/health');

  if (!skipLoading) {
    // loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        // loadingService.hide();
      }
    })
  );
};
