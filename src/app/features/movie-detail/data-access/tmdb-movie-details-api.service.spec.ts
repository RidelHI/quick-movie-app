import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TMDB_CONFIG, TmdbConfig } from '../../../shared/config/tmdb.config';
import { TmdbMovieDetailsApiService } from './tmdb-movie-details-api.service';

describe('TmdbMovieDetailsApiService', () => {
  let service: TmdbMovieDetailsApiService;
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

    service = TestBed.inject(TmdbMovieDetailsApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('requests movie details with default language', () => {
    service.getMovieDetails(10).subscribe();

    const req = httpTesting.expectOne((request) => {
      return (
        request.url === `${config.apiBaseUrlV3}/movie/10` &&
        request.params.get('language') === 'es-ES'
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush({ id: 10 });
  });

  it('requests movie details with custom language', () => {
    service.getMovieDetails(20, 'en-US').subscribe();

    const req = httpTesting.expectOne((request) => {
      return (
        request.url === `${config.apiBaseUrlV3}/movie/20` &&
        request.params.get('language') === 'en-US'
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush({ id: 20 });
  });
});
