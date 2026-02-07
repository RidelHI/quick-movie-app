import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface TmdbConfig {
  apiBaseUrlV3: string;
  apiBaseUrlV4: string;
  readAccessToken: string;
  redirectUri: string;
  httpCache: {
    enabled: boolean;
    defaultTtlMs: number;
  };
}

export const TMDB_CONFIG = new InjectionToken<TmdbConfig>('TMDB_CONFIG');

export const DEFAULT_TMDB_CONFIG: TmdbConfig = {
  apiBaseUrlV3: environment.tmdb.apiBaseUrlV3,
  apiBaseUrlV4: environment.tmdb.apiBaseUrlV4,
  readAccessToken: environment.tmdb.readAccessToken,
  redirectUri: environment.tmdb.redirectUri,
  httpCache: {
    enabled: environment.tmdb.httpCache.enabled,
    defaultTtlMs: environment.tmdb.httpCache.defaultTtlMs,
  },
};
