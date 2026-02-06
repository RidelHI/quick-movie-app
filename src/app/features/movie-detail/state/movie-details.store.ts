import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, switchMap, tap } from 'rxjs';

import { TmdbMovieDetailsApiService } from '../data-access/tmdb-movie-details-api.service';
import { mapMovieDetailDtoToDetail } from '../domain/mappers/movie-detail.mapper';
import { MovieDetail } from '../domain/models/movie-detail.model';

type MovieDetailsRequest = {
    id: number;
    language: string;
};

type MovieDetailsState = {
    request: MovieDetailsRequest | null;
    movie: MovieDetail | null;
    loading: boolean;
    error: string | null;
};

const initialState: MovieDetailsState = {
    request: null,
    movie: null,
    loading: false,
    error: null,
};

export const MovieDetailsStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        movie: computed(() => store.movie()),
        loading: computed(() => store.loading()),
        error: computed(() => store.error()),
    })),
    withMethods((store) => {
        const api = inject(TmdbMovieDetailsApiService);

    const loadMovie = rxMethod<MovieDetailsRequest>((request$) =>
      request$.pipe(
        tap(() => patchState(store, { loading: true, error: null, movie: null })),
                switchMap((request) =>
                    api.getMovieDetails(request.id, request.language).pipe(
                        map((dto) => mapMovieDetailDtoToDetail(dto)),
                        tap((movie) => patchState(store, { movie, loading: false })),
                        catchError(() => {
                            patchState(store, {
                                error: 'No se pudieron cargar los detalles de la pelicula.',
                                loading: false,
                            });
                            return EMPTY;
                        }),
                    ),
                ),
            ),
        );

    return {
      loadMovie: (id: number, language = 'es-ES') => {
        const request = { id, language };
        patchState(store, { request });
        loadMovie(request);
      },
      reload: () => {
        const request = store.request();
        if (request) {
          loadMovie(request);
        }
      },
    };
  }),
);
