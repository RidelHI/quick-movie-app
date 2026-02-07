export const environment = {
  production: true,
  tmdb: {
    apiBaseUrlV3: 'https://api.themoviedb.org/3',
    apiBaseUrlV4: 'https://api.themoviedb.org/4',
    readAccessToken: 'YOUR_TMDB_READ_ACCESS_TOKEN',
    redirectUri: 'https://your-domain-or-pages-url/auth/callback',
    httpCache: {
      enabled: true,
      defaultTtlMs: 30000,
    },
  },
};
