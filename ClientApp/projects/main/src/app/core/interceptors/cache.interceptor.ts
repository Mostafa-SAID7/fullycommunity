import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

/**
 * Cache interceptor - caches GET requests for better performance
 */
const cache = new Map<string, { response: HttpResponse<any>; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Skip caching for certain endpoints
  const skipCache = req.headers.has('X-Skip-Cache') ||
                    req.url.includes('/auth/') ||
                    req.url.includes('/notifications/');

  if (skipCache) {
    return next(req);
  }

  // Check cache
  const cachedResponse = cache.get(req.urlWithParams);
  if (cachedResponse) {
    const age = Date.now() - cachedResponse.timestamp;
    if (age < CACHE_DURATION) {
      // Return cached response
      return of(cachedResponse.response.clone());
    } else {
      // Remove expired cache
      cache.delete(req.urlWithParams);
    }
  }

  // Make request and cache response
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.urlWithParams, {
          response: event.clone(),
          timestamp: Date.now()
        });
      }
    })
  );
};

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Clear cache for specific URL pattern
 */
export function clearCacheByPattern(pattern: string): void {
  const keys = Array.from(cache.keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  });
}
