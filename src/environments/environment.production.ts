export const environment = {
  production: true,
  observability: {
    logger: {
      minimumLevel: 'warn',
      consoleEnabled: false,
      persistenceEnabled: true,
      maxEntries: 500,
      storageKey: 'quick-movie-app.logs',
      includeStackTrace: true,
    },
    sentry: {
      enabled: false,
      dsn: '',
      environment: 'production',
      release: undefined,
      enableLogs: true,
      tracesSampleRate: 0.1,
      tracePropagationTargets: ['localhost', 'https://api.themoviedb.org'],
      attachStacktrace: true,
      sendDefaultPii: false,
    },
  },
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
