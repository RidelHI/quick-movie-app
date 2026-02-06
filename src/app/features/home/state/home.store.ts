import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, throwError } from 'rxjs';

import { TmdbMoviesApiService } from '../data-access/tmdb-movies-api.service';
import { mapMovieListResponseDtoToPaginatedResult } from '../domain/mappers/pagination.mapper';
import { MovieSummary } from '../domain/models/movie-summary.model';

@Injectable({ providedIn: 'root' })
export class HomeStore {
  private readonly api = inject(TmdbMoviesApiService);

  private readonly request = signal<
    | {
        page: number;
        limit: number;
        language: string;
      }
    | undefined
  >(undefined);

  private readonly nowPlayingResource = rxResource<
    MovieSummary[],
    | {
        page: number;
        limit: number;
        language: string;
      }
    | undefined
  >({
    params: () => this.request(),
    defaultValue: [],
    stream: ({ params }) => {
      if (!params) {
        return of([]);
      }

      return this.api.getNowPlaying(params.page, { language: params.language }).pipe(
        map((dto) => mapMovieListResponseDtoToPaginatedResult(dto)),
        map((result) => result.items.slice(0, params.limit)),
        catchError(() => throwError(() => new Error('No se pudieron cargar las peliculas.'))),
      );
    },
  });

  readonly nowPlaying = this.nowPlayingResource.value;
  readonly loading = this.nowPlayingResource.isLoading;
  readonly error = computed(() => this.nowPlayingResource.error()?.message ?? null);

  loadNowPlayingTitles(limit = 10): void {
    this.request.set({ page: 1, limit, language: 'es-ES' });
  }

  reload(): void {
    this.nowPlayingResource.reload();
  }
}
