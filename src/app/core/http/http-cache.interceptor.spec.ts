import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TMDB_CONFIG, TmdbConfig } from '../../shared/config/tmdb.config';
import { withHttpCache } from './http-cache.tokens';
import { clearHttpResponseCache, httpCacheInterceptor } from './http-cache.interceptor';

describe('httpCacheInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  const config: TmdbConfig = {
    apiBaseUrlV3: 'https://api.example.com/3',
    apiBaseUrlV4: 'https://api.example.com/4',
    readAccessToken: 'read-token',
    redirectUri: 'http://localhost:4200/auth/callback',
    httpCache: {
      enabled: true,
      defaultTtlMs: 30_000,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpCacheInterceptor])),
        provideHttpClientTesting(),
        { provide: TMDB_CONFIG, useValue: config },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    clearHttpResponseCache();
    vi.useRealTimers();
    httpTesting.verify();
  });

  it('returns cached GET response within ttl', () => {
    const url = `${config.apiBaseUrlV3}/movie/now_playing?page=1`;
    const responses: Array<{ id: number }> = [];

    http
      .get<{ id: number }>(url, { context: withHttpCache({ ttlMs: 1_000 }) })
      .subscribe((body) => {
        responses.push(body);
      });

    const req = httpTesting.expectOne(url);
    req.flush({ id: 1 });

    http
      .get<{ id: number }>(url, { context: withHttpCache({ ttlMs: 1_000 }) })
      .subscribe((body) => {
        responses.push(body);
      });

    httpTesting.expectNone(url);
    expect(responses).toEqual([{ id: 1 }, { id: 1 }]);
  });

  it('expires cache entries after ttl', () => {
    vi.useFakeTimers();
    const url = `${config.apiBaseUrlV3}/movie/now_playing?page=1`;

    http.get<{ id: number }>(url, { context: withHttpCache({ ttlMs: 500 }) }).subscribe();
    httpTesting.expectOne(url).flush({ id: 1 });

    vi.advanceTimersByTime(501);

    http.get<{ id: number }>(url, { context: withHttpCache({ ttlMs: 500 }) }).subscribe();
    httpTesting.expectOne(url).flush({ id: 2 });
  });

  it('deduplicates in-flight GET requests with same key', () => {
    const url = `${config.apiBaseUrlV3}/movie/now_playing?page=1`;
    const responses: Array<{ id: number }> = [];

    http.get<{ id: number }>(url).subscribe((body) => responses.push(body));
    http.get<{ id: number }>(url).subscribe((body) => responses.push(body));

    const req = httpTesting.expectOne(url);
    req.flush({ id: 7 });

    expect(responses).toEqual([{ id: 7 }, { id: 7 }]);
  });

  it('invalidates cache after a mutating TMDB request', () => {
    const moviesUrl = `${config.apiBaseUrlV3}/movie/now_playing?page=1`;
    const mutationUrl = `${config.apiBaseUrlV4}/auth/access_token`;

    http.get<{ id: number }>(moviesUrl).subscribe();
    httpTesting.expectOne(moviesUrl).flush({ id: 1 });

    http.post(mutationUrl, { request_token: 'req-1' }).subscribe();
    httpTesting.expectOne(mutationUrl).flush({ success: true });

    http.get<{ id: number }>(moviesUrl).subscribe();
    httpTesting.expectOne(moviesUrl).flush({ id: 2 });
  });

  it('skips cache when disabled in request context', () => {
    const url = `${config.apiBaseUrlV3}/movie/now_playing?page=1`;

    http.get<{ id: number }>(url, { context: withHttpCache({ enabled: false }) }).subscribe();
    httpTesting.expectOne(url).flush({ id: 1 });

    http.get<{ id: number }>(url, { context: withHttpCache({ enabled: false }) }).subscribe();
    httpTesting.expectOne(url).flush({ id: 2 });
  });
});
