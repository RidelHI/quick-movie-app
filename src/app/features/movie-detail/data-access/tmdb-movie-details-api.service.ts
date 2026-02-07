import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { withHttpCache } from '../../../core/http/http-cache.tokens';
import { TMDB_CONFIG, TmdbConfig } from '../../../shared/config/tmdb.config';
import { TmdbMovieDetailDto } from '../domain/dto/tmdb-movie-detail.dto';

const MOVIE_DETAILS_TTL_MS = 300_000;

@Injectable({
  providedIn: 'root',
})
export class TmdbMovieDetailsApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject<TmdbConfig>(TMDB_CONFIG);

  getMovieDetails(id: number, language = 'es-ES'): Observable<TmdbMovieDetailDto> {
    const params = new HttpParams().set('language', language);

    return this.http.get<TmdbMovieDetailDto>(`${this.config.apiBaseUrlV3}/movie/${id}`, {
      params,
      context: withHttpCache({ ttlMs: MOVIE_DETAILS_TTL_MS }),
    });
  }
}
