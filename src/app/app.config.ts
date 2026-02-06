import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { DEFAULT_TMDB_CONFIG, TMDB_CONFIG } from './shared/config/tmdb.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: TMDB_CONFIG, useValue: DEFAULT_TMDB_CONFIG },
  ],
};
