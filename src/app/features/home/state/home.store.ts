import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, switchMap, tap } from 'rxjs';

import { LoggerService } from '../../../core/logging/logger.service';
import { TmdbMoviesApiService } from '../data-access/tmdb-movies-api.service';
import { mapMovieListResponseDtoToPaginatedResult } from '../domain/mappers/pagination.mapper';
import { MovieSummary } from '../domain/models/movie-summary.model';

type HomeRequest = {
  language: string;
};

type HomeState = {
  request: HomeRequest | null;
  nowPlaying: MovieSummary[];
  page: number;
  totalPages: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  languageFilter: string;
};

const initialState: HomeState = {
  request: null,
  nowPlaying: [],
  page: 0,
  totalPages: 1,
  loading: false,
  loadingMore: false,
  error: null,
  searchQuery: '',
  languageFilter: 'all',
};

export const HomeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(TmdbMoviesApiService);
    const logger = inject(LoggerService);

    const loadNowPlaying = rxMethod<{ page: number; language: string; append: boolean }>((params$) =>
      params$.pipe(
        tap(({ append }) =>
          patchState(store, { loading: !append, loadingMore: append, error: null }),
        ),
        switchMap((params) =>
          api.getNowPlaying(params.page, { language: params.language }).pipe(
            map((dto) => mapMovieListResponseDtoToPaginatedResult(dto)),
            tap((result) => {
              const current = params.append ? store.nowPlaying() : [];
              const merged = new Map(
                [...current, ...result.items].map((movie) => [movie.id, movie]),
              );
              const sorted = Array.from(merged.values()).sort((a, b) => {
                const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
                const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
                if (dateA === dateB) {
                  return a.title.localeCompare(b.title);
                }
                return dateB - dateA;
              });
              patchState(store, {
                nowPlaying: sorted,
                page: result.page,
                totalPages: result.totalPages,
                loading: false,
                loadingMore: false,
              });
            }),
            catchError((error) => {
              logger.captureException(error, 'Failed to load now playing movies', {
                request: params,
              });
              patchState(store, {
                loading: false,
                loadingMore: false,
                error: 'No se pudieron cargar las peliculas.',
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    );

    return {
      loadNowPlaying: (language = 'es-ES') => {
        const request: HomeRequest = { language };
        patchState(store, { request });
        loadNowPlaying({ page: 1, language: request.language, append: false });
      },
      reload: () => {
        const request = store.request();
        if (request) {
          loadNowPlaying({ page: 1, language: request.language, append: false });
        }
      },
      loadNextPage: () => {
        const request = store.request();
        if (!request || store.loading() || store.loadingMore()) {
          return;
        }
        const nextPage = store.page() + 1;
        if (nextPage > store.totalPages()) {
          return;
        }
        loadNowPlaying({ page: nextPage, language: request.language, append: true });
      },
      setSearchQuery: (query: string) => {
        patchState(store, { searchQuery: query });
      },
      setLanguageFilter: (language: string) => {
        patchState(store, { languageFilter: language });
      },
    };
  }),
);
