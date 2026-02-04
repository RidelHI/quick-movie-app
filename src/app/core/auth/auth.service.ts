import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

import { TMDB_CONFIG, TmdbConfig } from '../config/tmdb.config';
import { TmdbApiService } from '../http/tmdb-api.service';

const ACCESS_TOKEN_KEY = 'tmdb.access_token';
const REQUEST_TOKEN_KEY = 'tmdb.request_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(TmdbApiService);
  private readonly router = inject(Router);
  private readonly config = inject<TmdbConfig>(TMDB_CONFIG);

  private readonly accessTokenSignal = signal<string | null>(this.readAccessToken());
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenSignal());

  startLogin(redirectTo = this.config.redirectUri): void {
    this.api
      .createRequestToken(redirectTo)
      .pipe(
        tap((response) => {
          sessionStorage.setItem(REQUEST_TOKEN_KEY, response.request_token);
          const url = this.buildApprovalUrl(response.request_token);
          window.location.assign(url);
        }),
        catchError(() => of(null))
      )
      .subscribe();
  }

  completeLogin(): void {
    const requestToken = sessionStorage.getItem(REQUEST_TOKEN_KEY);
    if (!requestToken) {
      void this.router.navigateByUrl('/auth');
      return;
    }

    this.api
      .createAccessToken(requestToken)
      .pipe(
        tap((response) => {
          sessionStorage.removeItem(REQUEST_TOKEN_KEY);
          sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
          this.accessTokenSignal.set(response.access_token);
          void this.router.navigateByUrl('/home');
        }),
        catchError(() => {
          sessionStorage.removeItem(REQUEST_TOKEN_KEY);
          return of(null);
        })
      )
      .subscribe();
  }

  logout(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    this.accessTokenSignal.set(null);
    void this.router.navigateByUrl('/auth');
  }

  private buildApprovalUrl(requestToken: string): string {
    return `https://www.themoviedb.org/auth/access?request_token=${requestToken}`;
  }

  private readAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }
}
