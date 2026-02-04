import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TMDB_CONFIG, TmdbConfig } from '../config/tmdb.config';
import { TmdbPaginatedResponse } from '../../domain/movies/dto/tmdb-paginated-response.dto';
import { TmdbMovieListItemDto } from '../../domain/movies/dto/tmdb-movie-list-item.dto';

export interface TmdbRequestTokenResponse {
  request_token: string;
  success: boolean;
  status_message?: string;
  status_code?: number;
}

export interface TmdbAccessTokenResponse {
  access_token: string;
  success: boolean;
  account_id?: string;
  status_message?: string;
  status_code?: number;
}

@Injectable({ providedIn: 'root' })
export class TmdbApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(TMDB_CONFIG) private readonly config: TmdbConfig
  ) {}

  createRequestToken(redirectTo: string): Observable<TmdbRequestTokenResponse> {
    return this.http.post<TmdbRequestTokenResponse>(
      `${this.config.apiBaseUrlV4}/auth/request_token`,
      { redirect_to: redirectTo },
      { headers: this.buildAuthHeaders(this.config.readAccessToken) }
    );
  }

  createAccessToken(requestToken: string): Observable<TmdbAccessTokenResponse> {
    return this.http.post<TmdbAccessTokenResponse>(
      `${this.config.apiBaseUrlV4}/auth/access_token`,
      { request_token: requestToken },
      { headers: this.buildAuthHeaders(this.config.readAccessToken) }
    );
  }

  getNowPlaying(
    page = 1,
    options: { language?: string; region?: string } = {}
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
      { headers: this.buildAuthHeaders(this.config.readAccessToken), params }
    );
  }

  private buildAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    });
  }
}
