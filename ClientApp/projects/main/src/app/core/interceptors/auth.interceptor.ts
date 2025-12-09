import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

/**
 * Auth interceptor - adds JWT token to requests and handles token refresh
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Skip auth for login/register endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Clone request with token if available
  if (token) {
    req = req.clone({
      setHeaders: { 
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  } else {
    req = req.clone({ withCredentials: true });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.status === 401 && token && !req.url.includes('/auth/refresh-token')) {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          return authService.refreshToken({ refreshToken }).pipe(
            switchMap((response) => {
              // Retry original request with new token
              const clonedReq = req.clone({
                setHeaders: { 
                  Authorization: `Bearer ${response.accessToken}`
                }
              });
              return next(clonedReq);
            }),
            catchError((refreshError) => {
              // Refresh failed - logout and redirect
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // No refresh token - logout and redirect
          authService.logout();
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
