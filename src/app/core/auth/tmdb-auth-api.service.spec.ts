import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TMDB_CONFIG, TmdbConfig } from '../../shared/config/tmdb.config';
import { TmdbAuthApiService } from './tmdb-auth-api.service';

describe('TmdbAuthApiService', () => {
  let service: TmdbAuthApiService;
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
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TMDB_CONFIG, useValue: config },
      ],
    });

    service = TestBed.inject(TmdbAuthApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('creates request token with redirect URL', () => {
    const redirectTo = 'http://localhost:4200/auth/callback';

    service.createRequestToken(redirectTo).subscribe();

    const req = httpTesting.expectOne(`${config.apiBaseUrlV4}/auth/request_token`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ redirect_to: redirectTo });
    req.flush({ request_token: 'req-1', success: true });
  });

  it('creates access token with request token payload', () => {
    service.createAccessToken('req-1').subscribe();

    const req = httpTesting.expectOne(`${config.apiBaseUrlV4}/auth/access_token`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ request_token: 'req-1' });
    req.flush({ access_token: 'acc-1', success: true });
  });
});
