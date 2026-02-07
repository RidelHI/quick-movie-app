import { HttpContext, HttpContextToken } from '@angular/common/http';

export type HttpCacheOptions = {
  enabled?: boolean;
  ttlMs?: number | null;
};

export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
export const CACHE_TTL_MS = new HttpContextToken<number | null>(() => null);
export const SKIP_CACHE_INVALIDATION = new HttpContextToken<boolean>(() => false);
export const CACHE_INVALIDATION_PATTERNS = new HttpContextToken<readonly string[] | null>(
  () => null,
);

export function withHttpCache(options: HttpCacheOptions = {}): HttpContext {
  let context = new HttpContext();

  if (options.enabled !== undefined) {
    context = context.set(CACHING_ENABLED, options.enabled);
  }

  if (options.ttlMs !== undefined) {
    context = context.set(CACHE_TTL_MS, options.ttlMs);
  }

  return context;
}

export function withCacheInvalidation(patterns: readonly string[]): HttpContext {
  return new HttpContext().set(CACHE_INVALIDATION_PATTERNS, patterns);
}

export function withoutCacheInvalidation(): HttpContext {
  return new HttpContext().set(SKIP_CACHE_INVALIDATION, true);
}
