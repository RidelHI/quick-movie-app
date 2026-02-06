import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TMDB_CONFIG, TmdbConfig } from '../../shared/config/tmdb.config';
import { AuthStore } from '../auth/state/auth.store';

const AUTH_PATHS = ['/auth/request_token', '/auth/access_token'];

export const tmdbAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject<TmdbConfig>(TMDB_CONFIG);

  if (!isTmdbUrl(req.url, config)) {
    return next(req);
  }

  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const token = isAuthRequest(req.url)
    ? config.readAccessToken
    : (inject(AuthStore).accessToken() ?? config.readAccessToken);

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    }),
  );
};

function isTmdbUrl(url: string, config: TmdbConfig): boolean {
  return url.startsWith(config.apiBaseUrlV3) || url.startsWith(config.apiBaseUrlV4);
}

function isAuthRequest(url: string): boolean {
  return AUTH_PATHS.some((path) => url.includes(path));
}
