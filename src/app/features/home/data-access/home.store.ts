import { Injectable, signal } from '@angular/core';
import { catchError, finalize, map, of, tap } from 'rxjs';

import { TmdbApiService } from '../../../core/http/tmdb-api.service';
import { mapMovieListResponseDtoToPaginatedResult } from '../../../domain/movies/mappers/pagination.mapper';

@Injectable({ providedIn: 'root' })
export class HomeStore {
  readonly titles = signal<string[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly api: TmdbApiService) {}

  loadNowPlayingTitles(limit = 10): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.api
      .getNowPlaying(1, { language: 'es-ES' })
      .pipe(
        map((dto) => mapMovieListResponseDtoToPaginatedResult(dto)),
        map((result) => result.items.slice(0, limit).map((movie) => movie.title)),
        tap((titles) => this.titles.set(titles)),
        catchError(() => {
          this.error.set('No se pudieron cargar las peliculas.');
          return of([] as string[]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }
}
