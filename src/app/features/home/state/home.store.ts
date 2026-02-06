import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, switchMap, tap } from 'rxjs';

import { TmdbMoviesApiService } from '../data-access/tmdb-movies-api.service';
import { mapMovieListResponseDtoToPaginatedResult } from '../domain/mappers/pagination.mapper';
import { MovieSummary } from '../domain/models/movie-summary.model';

type HomeRequest = {
  page: number;
  limit: number;
  language: string;
};

type HomeState = {
  request: HomeRequest | null;
  nowPlaying: MovieSummary[];
  loading: boolean;
  error: string | null;
};

const initialState: HomeState = {
  request: null,
  nowPlaying: [],
  loading: false,
  error: null,
};

export const HomeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(TmdbMoviesApiService);

    const loadNowPlaying = rxMethod<HomeRequest>((params$) =>
      params$.pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((params) =>
          api.getNowPlaying(params.page, { language: params.language }).pipe(
            map((dto) => mapMovieListResponseDtoToPaginatedResult(dto)),
            map((result) => result.items.slice(0, params.limit)),
            tap((items) => patchState(store, { nowPlaying: items, loading: false })),
            catchError(() => {
              patchState(store, {
                loading: false,
                error: 'No se pudieron cargar las peliculas.',
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    );

    return {
      loadNowPlayingTitles: (limit = 10) => {
        const request: HomeRequest = { page: 1, limit, language: 'es-ES' };
        patchState(store, { request });
        loadNowPlaying(request);
      },
      reload: () => {
        const request = store.request();
        if (request) {
          loadNowPlaying(request);
        }
      },
    };
  }),
);
