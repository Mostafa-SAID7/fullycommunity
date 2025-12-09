import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 * Logging interceptor - logs HTTP requests and responses (development only)
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  
  console.log(`🚀 ${req.method} ${req.urlWithParams}`);
  
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`✅ ${req.method} ${req.urlWithParams} - ${event.status} (${elapsed}ms)`);
        }
      },
      error: (error) => {
        const elapsed = Date.now() - started;
        console.error(`❌ ${req.method} ${req.urlWithParams} - ${error.status} (${elapsed}ms)`, error);
      }
    })
  );
};
