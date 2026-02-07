import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoggerService } from '../../../core/logging/logger.service';
import { TmdbMoviesApiService } from '../data-access/tmdb-movies-api.service';
import { TmdbMovieListItemDto } from '../domain/dto/tmdb-movie-list-item.dto';
import { TmdbPaginatedResponse } from '../domain/dto/tmdb-paginated-response.dto';
import { HomeStore } from './home.store';

type HomeStoreInstance = InstanceType<typeof HomeStore>;

describe('HomeStore', () => {
  let store: HomeStoreInstance;
  let api: { getNowPlaying: ReturnType<typeof vi.fn> };
  let logger: { captureException: ReturnType<typeof vi.fn> };

  const buildMovie = (id: number): TmdbMovieListItemDto => ({
    adult: false,
    backdrop_path: null,
    genre_ids: [12],
    id,
    original_language: 'en',
    original_title: `Original ${id}`,
    overview: 'Overview',
    popularity: 1,
    poster_path: null,
    release_date: '2024-01-01',
    title: `Movie ${id}`,
    video: false,
    vote_average: 7.5,
    vote_count: 100,
  });

  const buildResponse = (count: number): TmdbPaginatedResponse<TmdbMovieListItemDto> => ({
    page: 1,
    total_pages: 1,
    total_results: count,
    results: Array.from({ length: count }, (_, index) => buildMovie(index + 1)),
  });

  beforeEach(() => {
    api = { getNowPlaying: vi.fn() };
    logger = { captureException: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        HomeStore,
        { provide: TmdbMoviesApiService, useValue: api },
        { provide: LoggerService, useValue: logger },
      ],
    });

    store = TestBed.inject(HomeStore);
  });

  it('loads now playing movies', () => {
    api.getNowPlaying.mockReturnValue(of(buildResponse(3)));

    store.loadNowPlayingTitles(2);

    expect(api.getNowPlaying).toHaveBeenCalledWith(1, { language: 'es-ES' });
    expect(store.request()).toEqual({ page: 1, limit: 2, language: 'es-ES' });
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.nowPlaying().length).toBe(2);
  });

  it('does not reload when no request is set', () => {
    store.reload();

    expect(api.getNowPlaying).not.toHaveBeenCalled();
  });

  it('sets error on load failure', () => {
    api.getNowPlaying.mockReturnValue(throwError(() => new Error('boom')));

    store.loadNowPlayingTitles(10);

    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('No se pudieron cargar las peliculas.');
    expect(store.nowPlaying()).toEqual([]);
  });
});
