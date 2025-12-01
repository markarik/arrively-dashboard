import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, retry, switchMap, throwError, timer } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/auth/token/token.service';
import { log } from 'console';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

// Retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAYS = [1000, 2000, 3000,4000,5000]; // in milliseconds

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Skip interceptor for auth-related requests
  if (req.url.includes('/admin-login') || req.url.includes('/refresh-token')) {
    return next(req);
  }

  // Add auth header if token exists
  const token = tokenService.userToken;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only retry on network errors or 5xx server errors
      if (error.status >= 500 || error.status === 0) {
        console.log(`Server error for ${req.url}, will retry:`, error);
        return throwError(() => error);
      }

      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject = new BehaviorSubject<string | null>(null);

          const refreshToken = tokenService.refreshToken;

          if (!refreshToken) {
            authService.logout();
            router.navigate(['/admin/signin']);
            return throwError(() => error);
          }

          // Attempt to refresh the token
          return authService.refreshToken(refreshToken).pipe(
            switchMap((response: any) => {
              isRefreshing = false;
              refreshTokenSubject.next(response.token);

              // Retry the original request with new token
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`
                }
              });
              return next(newRequest);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              authService.logout();
              router.navigate(['/admin/signin']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // If refresh is in progress, wait for it to complete
          return refreshTokenSubject.pipe(
            switchMap((token: string | null) => {
              if (!token) {
                return throwError(() => new Error('No token available'));
              }
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              return next(newRequest);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
