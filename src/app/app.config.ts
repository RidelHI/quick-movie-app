import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { tmdbAuthInterceptor } from './core/http/tmdb-auth.interceptor';
import { DEFAULT_TMDB_CONFIG, TMDB_CONFIG } from './shared/config/tmdb.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tmdbAuthInterceptor])),
    { provide: TMDB_CONFIG, useValue: DEFAULT_TMDB_CONFIG },
  ],
};
