import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TraceService } from '@sentry/angular';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/error/global-error.handler';
import { httpCacheInterceptor } from './core/http/http-cache.interceptor';
import { httpErrorLoggingInterceptor } from './core/http/http-error-logging.interceptor';
import { SentryLogSink } from './core/logging/sinks/sentry-log.sink';
import { LOG_SINKS } from './core/logging/log-sink';
import { SENTRY_CONFIG } from './core/observability/sentry/sentry.config';
import { tmdbAuthInterceptor } from './core/http/tmdb-auth.interceptor';
import { DEFAULT_TMDB_CONFIG, TMDB_CONFIG } from './shared/config/tmdb.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tmdbAuthInterceptor, httpCacheInterceptor, httpErrorLoggingInterceptor]),
    ),
    provideAppInitializer(() => {
      const sentryConfig = inject(SENTRY_CONFIG);
      if (sentryConfig.enabled && sentryConfig.dsn.trim().length > 0) {
        inject(TraceService);
      }
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: LOG_SINKS, useClass: SentryLogSink, multi: true },
    { provide: TMDB_CONFIG, useValue: DEFAULT_TMDB_CONFIG },
  ],
};
