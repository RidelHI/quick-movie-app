import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { TMDB_CONFIG, TmdbConfig } from '../../../shared/config/tmdb.config';
import { TmdbAuthApiService } from '../tmdb-auth-api.service';
import { AuthStore } from './auth.store';

type AuthStoreInstance = InstanceType<typeof AuthStore>;

describe('AuthStore', () => {
  let store: AuthStoreInstance;
  let api: {
    createRequestToken: ReturnType<typeof vi.fn>;
    createAccessToken: ReturnType<typeof vi.fn>;
  };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  const config: TmdbConfig = {
    apiBaseUrlV3: 'https://api.example.com/3',
    apiBaseUrlV4: 'https://api.example.com/4',
    readAccessToken: 'read-token',
    redirectUri: 'http://localhost:4200/auth/callback',
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: TmdbAuthApiService, useValue: api },
        { provide: Router, useValue: router },
        { provide: TMDB_CONFIG, useValue: config },
      ],
    });

    store = TestBed.inject(AuthStore);
  };

  beforeEach(() => {
    sessionStorage.clear();
    api = {
      createRequestToken: vi.fn(),
      createAccessToken: vi.fn(),
    };
    router = { navigateByUrl: vi.fn() };
  });

  it('initializes access token from sessionStorage', () => {
    sessionStorage.setItem('tmdb.access_token', 'token-123');

    setup();

    expect(store.accessToken()).toBe('token-123');
    expect(store.isAuthenticated()).toBe(true);
  });

  it('completes login and stores access token', () => {
    sessionStorage.setItem('tmdb.request_token', 'req-1');
    api.createAccessToken.mockReturnValue(of({ access_token: 'token-abc', success: true }));

    setup();
    store.completeLogin();

    expect(api.createAccessToken).toHaveBeenCalledWith('req-1');
    expect(store.accessToken()).toBe('token-abc');
    expect(sessionStorage.getItem('tmdb.access_token')).toBe('token-abc');
    expect(sessionStorage.getItem('tmdb.request_token')).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('navigates to auth when request token is missing', () => {
    setup();

    store.completeLogin();

    expect(api.createAccessToken).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth');
  });

  it('clears session on logout', () => {
    sessionStorage.setItem('tmdb.access_token', 'token-123');

    setup();
    store.logout();

    expect(sessionStorage.getItem('tmdb.access_token')).toBeNull();
    expect(store.accessToken()).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth');
  });
});
