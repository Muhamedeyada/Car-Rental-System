import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const isLoginAttempt = /\/(admin|customer)\/login$/.test(req.url);
        if (!isLoginAttempt) {
          authService.clearAuth();
          if (isPlatformBrowser(platformId)) {
            const isAdminScope = req.url.includes('/admin/');
            router.navigate([isAdminScope ? '/admin/login' : '/login']);
            toastService.showError('error_unauthorized');
          }
        }
      } else if (error.status === 404) {
        toastService.showError('error_not_found');
      } else if (error.status === 500) {
        toastService.showError('error_server');
      } else if (error.status === 0) {
        toastService.showError('error_server');
      }

      return throwError(() => error);
    })
  );
};
