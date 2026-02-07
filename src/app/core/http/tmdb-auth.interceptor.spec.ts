import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TMDB_CONFIG, TmdbConfig } from '../../shared/config/tmdb.config';
import { AuthStore } from '../auth/state/auth.store';
import { tmdbAuthInterceptor } from './tmdb-auth.interceptor';

describe('tmdbAuthInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let accessToken: string | null;

  const config: TmdbConfig = {
    apiBaseUrlV3: 'https://api.example.com/3',
    apiBaseUrlV4: 'https://api.example.com/4',
    readAccessToken: 'read-token',
    redirectUri: 'http://localhost:4200/auth/callback',
  };

  const authStore = {
    accessToken: vi.fn(() => accessToken),
  };

  beforeEach(() => {
    accessToken = 'store-token';
    authStore.accessToken.mockClear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tmdbAuthInterceptor])),
        provideHttpClientTesting(),
        { provide: TMDB_CONFIG, useValue: config },
        { provide: AuthStore, useValue: authStore },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('adds store access token to TMDB API requests', () => {
    http.get(`${config.apiBaseUrlV3}/movie/now_playing`).subscribe();

    const req = httpTesting.expectOne(`${config.apiBaseUrlV3}/movie/now_playing`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer store-token');
    expect(req.request.headers.get('accept')).toBe('application/json');
    req.flush({});
  });

  it('falls back to read token when store token is missing', () => {
    accessToken = null;

    http.get(`${config.apiBaseUrlV3}/movie/now_playing`).subscribe();

    const req = httpTesting.expectOne(`${config.apiBaseUrlV3}/movie/now_playing`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer read-token');
    req.flush({});
  });

  it('uses read token for auth endpoints', () => {
    http.post(`${config.apiBaseUrlV4}/auth/request_token`, {}).subscribe();

    const req = httpTesting.expectOne(`${config.apiBaseUrlV4}/auth/request_token`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer read-token');
    req.flush({});
  });

  it('does not modify non-TMDB URLs', () => {
    http.get('https://example.org/ping').subscribe();

    const req = httpTesting.expectOne('https://example.org/ping');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(req.request.headers.has('accept')).toBe(false);
    req.flush({});
  });

  it('keeps request headers unchanged when authorization already exists', () => {
    http
      .get(`${config.apiBaseUrlV3}/movie/now_playing`, {
        headers: { Authorization: 'Bearer custom-token' },
      })
      .subscribe();

    const req = httpTesting.expectOne(`${config.apiBaseUrlV3}/movie/now_playing`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer custom-token');
    expect(req.request.headers.has('accept')).toBe(false);
    req.flush({});
  });
});
