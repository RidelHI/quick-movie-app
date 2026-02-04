import { InjectionToken } from '@angular/core';

export interface TmdbConfig {
  apiBaseUrlV3: string;
  apiBaseUrlV4: string;
  readAccessToken: string;
  redirectUri: string;
}

export const TMDB_CONFIG = new InjectionToken<TmdbConfig>('TMDB_CONFIG');

export const DEFAULT_TMDB_CONFIG: TmdbConfig = {
  apiBaseUrlV3: 'https://api.themoviedb.org/3',
  apiBaseUrlV4: 'https://api.themoviedb.org/4',
  readAccessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzllNTRlOWNhYzJjNzQzMzEyN2I5MTMyNjE0MzY3OSIsIm5iZiI6MTc3MDEzNDgyMi43NDUsInN1YiI6IjY5ODIxZDI2NmUzN2NhYzJmNTQxOTNiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ES3AMSxpg9FB02nndF2LxjDn3LoHKnpXHz7RODBi7s8',
  redirectUri: 'http://localhost:4200/auth/callback'
};
