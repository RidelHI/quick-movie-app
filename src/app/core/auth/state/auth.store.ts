import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';

import { LoggerService } from '../../logging/logger.service';
import { TMDB_CONFIG, TmdbConfig } from '../../../shared/config/tmdb.config';
import { TmdbAuthApiService } from '../tmdb-auth-api.service';

const ACCESS_TOKEN_KEY = 'tmdb.access_token';
const REQUEST_TOKEN_KEY = 'tmdb.request_token';

type AuthState = {
  accessToken: string | null;
  error: string | null;
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(
    (): AuthState => ({
      accessToken: readAccessToken(),
      error: null,
    }),
  ),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.accessToken()),
  })),
  withMethods((store) => {
    const api = inject(TmdbAuthApiService);
    const router = inject(Router);
    const config = inject<TmdbConfig>(TMDB_CONFIG);
    const logger = inject(LoggerService);

    const startLogin = rxMethod<string>((redirect$) =>
      redirect$.pipe(
        tap(() => patchState(store, { error: null })),
        switchMap((redirectTo) =>
          api.createRequestToken(redirectTo).pipe(
            tap((response) => {
              sessionStorage.setItem(REQUEST_TOKEN_KEY, response.request_token);
              window.location.assign(buildApprovalUrl(response.request_token));
            }),
            catchError((error) => {
              logger.captureException(error, 'Failed to start TMDB login flow', { redirectTo });
              patchState(store, { error: 'No se pudo iniciar sesion.' });
              return EMPTY;
            }),
          ),
        ),
      ),
    );

    const completeLogin = rxMethod<void>((trigger$) =>
      trigger$.pipe(
        switchMap(() => {
          const requestToken = sessionStorage.getItem(REQUEST_TOKEN_KEY);
          if (!requestToken) {
            void router.navigateByUrl('/auth');
            return EMPTY;
          }

          return api.createAccessToken(requestToken).pipe(
            tap((response) => {
              sessionStorage.removeItem(REQUEST_TOKEN_KEY);
              sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
              patchState(store, { accessToken: response.access_token, error: null });
              void router.navigateByUrl('/home');
            }),
            catchError((error) => {
              logger.captureException(error, 'Failed to complete TMDB login flow');
              sessionStorage.removeItem(REQUEST_TOKEN_KEY);
              patchState(store, { error: 'No se pudo completar la sesion.' });
              return EMPTY;
            }),
          );
        }),
      ),
    );

    return {
      startLogin: (redirectTo = config.redirectUri) => {
        if (!config.readAccessToken) {
          logger.warn('TMDB read token is missing while starting login flow');
          patchState(store, { error: 'Configura TMDB_READ_ACCESS_TOKEN en environments.' });
          return;
        }
        startLogin(redirectTo);
      },
      completeLogin: () => completeLogin(void 0),
      logout: () => {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        patchState(store, { accessToken: null, error: null });
        void router.navigateByUrl('/auth');
      },
    };
  }),
);

function buildApprovalUrl(requestToken: string): string {
  return `https://www.themoviedb.org/auth/access?request_token=${requestToken}`;
}

function readAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}
