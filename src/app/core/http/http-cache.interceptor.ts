import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize, of, shareReplay, tap } from 'rxjs';

import { TMDB_CONFIG, TmdbConfig } from '../../shared/config/tmdb.config';
import {
  CACHE_INVALIDATION_PATTERNS,
  CACHE_TTL_MS,
  CACHING_ENABLED,
  SKIP_CACHE_INVALIDATION,
} from './http-cache.tokens';

type CachedEntry = {
  expiresAt: number;
  response: HttpResponse<unknown>;
};

const responseCache = new Map<string, CachedEntry>();
const inFlightRequests = new Map<string, Observable<HttpEvent<unknown>>>();

export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject<TmdbConfig>(TMDB_CONFIG);

  if (!isTmdbUrl(req.url, config)) {
    return next(req);
  }

  if (req.method !== 'GET') {
    if (!req.context.get(SKIP_CACHE_INVALIDATION)) {
      invalidateCache(req.url, req.context.get(CACHE_INVALIDATION_PATTERNS));
    }
    return next(req);
  }

  if (!isCachingEnabled(req, config)) {
    return next(req);
  }

  const ttlMs = resolveTtlMs(req, config);
  if (ttlMs <= 0) {
    return next(req);
  }

  const cacheKey = buildCacheKey(req.urlWithParams);
  const now = Date.now();
  const cached = responseCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return of(cached.response.clone());
  }

  if (cached && cached.expiresAt <= now) {
    responseCache.delete(cacheKey);
  }

  const inFlight = inFlightRequests.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const request$ = next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        responseCache.set(cacheKey, {
          expiresAt: Date.now() + ttlMs,
          response: event.clone(),
        });
      }
    }),
    finalize(() => {
      inFlightRequests.delete(cacheKey);
    }),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  inFlightRequests.set(cacheKey, request$);
  return request$;
};

function isTmdbUrl(url: string, config: TmdbConfig): boolean {
  return url.startsWith(config.apiBaseUrlV3) || url.startsWith(config.apiBaseUrlV4);
}

function isCachingEnabled(req: HttpRequest<unknown>, config: TmdbConfig): boolean {
  return config.httpCache.enabled && req.context.get(CACHING_ENABLED);
}

function resolveTtlMs(req: HttpRequest<unknown>, config: TmdbConfig): number {
  const requestTtl = req.context.get(CACHE_TTL_MS);
  return requestTtl ?? config.httpCache.defaultTtlMs;
}

function buildCacheKey(urlWithParams: string): string {
  return urlWithParams;
}

function invalidateCache(url: string, patterns: readonly string[] | null): void {
  if (patterns && patterns.length > 0) {
    const uniquePatterns = new Set(patterns);

    for (const cacheKey of responseCache.keys()) {
      const shouldInvalidate = Array.from(uniquePatterns).some((pattern) =>
        cacheKey.includes(pattern),
      );
      if (shouldInvalidate) {
        responseCache.delete(cacheKey);
      }
    }

    return;
  }

  for (const cacheKey of responseCache.keys()) {
    if (cacheKey.startsWith(urlOrigin(url))) {
      responseCache.delete(cacheKey);
    }
  }
}

function urlOrigin(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}

export function clearHttpResponseCache(): void {
  responseCache.clear();
  inFlightRequests.clear();
}
