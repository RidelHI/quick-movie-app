import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { LoggerService } from '../logging/logger.service';

export const httpErrorLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const start = nowMs();

  return next(req).pipe(
    catchError((error: unknown) => {
      const durationMs = Math.max(0, Math.round(nowMs() - start));

      if (error instanceof HttpErrorResponse) {
        logger.error('HTTP request failed', {
          method: req.method,
          url: req.urlWithParams,
          status: error.status,
          statusText: error.statusText,
          durationMs,
          response: error.error,
        });
      } else {
        logger.captureException(error, 'HTTP pipeline failed', {
          method: req.method,
          url: req.urlWithParams,
          durationMs,
        });
      }

      return throwError(() => error);
    }),
  );
};

function nowMs(): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}
