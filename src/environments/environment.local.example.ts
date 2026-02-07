export const environment = {
  production: false,
  tmdb: {
    apiBaseUrlV3: 'https://api.themoviedb.org/3',
    apiBaseUrlV4: 'https://api.themoviedb.org/4',
    readAccessToken: 'YOUR_TMDB_READ_ACCESS_TOKEN',
    redirectUri: 'http://localhost:4200/auth/callback',
    httpCache: {
      enabled: true,
      defaultTtlMs: 30000,
    },
  },
};
