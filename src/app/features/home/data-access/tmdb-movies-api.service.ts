import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { withHttpCache } from '../../../core/http/http-cache.tokens';
import { TMDB_CONFIG, TmdbConfig } from '../../../shared/config/tmdb.config';
import { TmdbPaginatedResponse } from '../domain/dto/tmdb-paginated-response.dto';
import { TmdbMovieListItemDto } from '../domain/dto/tmdb-movie-list-item.dto';

const NOW_PLAYING_TTL_MS = 60_000;

@Injectable({ providedIn: 'root' })
export class TmdbMoviesApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject<TmdbConfig>(TMDB_CONFIG);

  getNowPlaying(
    page = 1,
    options: { language?: string; region?: string } = {},
  ): Observable<TmdbPaginatedResponse<TmdbMovieListItemDto>> {
    let params = new HttpParams().set('page', page);

    if (options.language) {
      params = params.set('language', options.language);
    }

    if (options.region) {
      params = params.set('region', options.region);
    }

    return this.http.get<TmdbPaginatedResponse<TmdbMovieListItemDto>>(
      `${this.config.apiBaseUrlV3}/movie/now_playing`,
      {
        params,
        context: withHttpCache({ ttlMs: NOW_PLAYING_TTL_MS }),
      },
    );
  }
}
