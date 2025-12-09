import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, timer } from 'rxjs';

/**
 * Retry interceptor - retries failed requests with exponential backoff
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip retry for certain methods and endpoints
  const skipRetry = req.method !== 'GET' ||
                    req.headers.has('X-Skip-Retry') ||
                    req.url.includes('/auth/');

  if (skipRetry) {
    return next(req);
  }

  // Retry with exponential backoff
  return next(req).pipe(
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
        if (error.status >= 400 && error.status < 500 && 
            error.status !== 408 && error.status !== 429) {
          throw error;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
        console.log(`Retrying request (attempt ${retryCount}) after ${delayMs}ms`);
        return timer(delayMs);
      }
    })
  );
};
