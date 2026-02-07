import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TMDB_CONFIG, TmdbConfig } from '../../../shared/config/tmdb.config';
import { TmdbMoviesApiService } from './tmdb-movies-api.service';

describe('TmdbMoviesApiService', () => {
  let service: TmdbMoviesApiService;
  let httpTesting: HttpTestingController;

  const config: TmdbConfig = {
    apiBaseUrlV3: 'https://api.example.com/3',
    apiBaseUrlV4: 'https://api.example.com/4',
    readAccessToken: 'read-token',
    redirectUri: 'http://localhost:4200/auth/callback',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TMDB_CONFIG, useValue: config },
      ],
    });

    service = TestBed.inject(TmdbMoviesApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('requests now playing movies with default page', () => {
    service.getNowPlaying().subscribe();

    const req = httpTesting.expectOne((request) => {
      return (
        request.url === `${config.apiBaseUrlV3}/movie/now_playing` &&
        request.params.get('page') === '1' &&
        !request.params.has('language') &&
        !request.params.has('region')
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush({ page: 1, total_pages: 1, total_results: 0, results: [] });
  });

  it('requests now playing movies with page and locale options', () => {
    service.getNowPlaying(3, { language: 'es-ES', region: 'ES' }).subscribe();

    const req = httpTesting.expectOne((request) => {
      return (
        request.url === `${config.apiBaseUrlV3}/movie/now_playing` &&
        request.params.get('page') === '3' &&
        request.params.get('language') === 'es-ES' &&
        request.params.get('region') === 'ES'
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush({ page: 3, total_pages: 1, total_results: 0, results: [] });
  });
});
