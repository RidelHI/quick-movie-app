import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { TmdbMovieDetailsApiService } from '../data-access/tmdb-movie-details-api.service';
import { TmdbMovieDetailDto } from '../domain/dto/tmdb-movie-detail.dto';
import { MovieDetailsStore } from './movie-details.store';

type MovieDetailsStoreInstance = InstanceType<typeof MovieDetailsStore>;

describe('MovieDetailsStore', () => {
  let store: MovieDetailsStoreInstance;
  let api: { getMovieDetails: ReturnType<typeof vi.fn> };

  const buildMovieDetailDto = (id: number): TmdbMovieDetailDto => ({
    adult: false,
    backdrop_path: '/backdrop.jpg',
    belongs_to_collection: null,
    budget: 1000000,
    genres: [{ id: 1, name: 'Action' }],
    homepage: 'https://example.com',
    id,
    imdb_id: 'tt123456',
    original_language: 'en',
    original_title: 'Original Movie',
    overview: 'Overview',
    popularity: 10,
    poster_path: '/poster.jpg',
    production_companies: [{ id: 1, name: 'Studio', logo_path: null, origin_country: 'US' }],
    production_countries: [{ iso_3166_1: 'US', name: 'United States' }],
    release_date: '2024-01-01',
    revenue: 5000000,
    runtime: 120,
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }],
    status: 'Released',
    tagline: 'Tagline',
    title: 'Movie',
    video: false,
    vote_average: 7.2,
    vote_count: 1200,
  });

  beforeEach(() => {
    api = { getMovieDetails: vi.fn() };

    TestBed.configureTestingModule({
      providers: [MovieDetailsStore, { provide: TmdbMovieDetailsApiService, useValue: api }],
    });

    store = TestBed.inject(MovieDetailsStore);
  });

  it('loads movie details', () => {
    api.getMovieDetails.mockReturnValue(of(buildMovieDetailDto(10)));

    store.loadMovie(10);

    expect(api.getMovieDetails).toHaveBeenCalledWith(10, 'es-ES');
    expect(store.request()).toEqual({ id: 10, language: 'es-ES' });
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.movie()?.id).toBe(10);
  });

  it('reloads using last request', () => {
    api.getMovieDetails.mockReturnValue(of(buildMovieDetailDto(11)));
    store.loadMovie(11);
    api.getMovieDetails.mockClear();

    store.reload();

    expect(api.getMovieDetails).toHaveBeenCalledWith(11, 'es-ES');
  });

  it('sets error on load failure', () => {
    api.getMovieDetails.mockReturnValue(throwError(() => new Error('boom')));

    store.loadMovie(12);

    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('No se pudieron cargar los detalles de la pelicula.');
    expect(store.movie()).toBeNull();
  });
});
