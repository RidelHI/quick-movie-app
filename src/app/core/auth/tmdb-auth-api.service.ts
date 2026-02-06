import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TMDB_CONFIG, TmdbConfig } from '../../shared/config/tmdb.config';

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
export class TmdbAuthApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject<TmdbConfig>(TMDB_CONFIG);

  createRequestToken(redirectTo: string): Observable<TmdbRequestTokenResponse> {
    return this.http.post<TmdbRequestTokenResponse>(
      `${this.config.apiBaseUrlV4}/auth/request_token`,
      { redirect_to: redirectTo },
    );
  }

  createAccessToken(requestToken: string): Observable<TmdbAccessTokenResponse> {
    return this.http.post<TmdbAccessTokenResponse>(
      `${this.config.apiBaseUrlV4}/auth/access_token`,
      { request_token: requestToken },
    );
  }
}
