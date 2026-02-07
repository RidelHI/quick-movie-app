export const environment = {
  production: false,
  observability: {
    logger: {
      minimumLevel: 'info',
      consoleEnabled: true,
      persistenceEnabled: true,
      maxEntries: 300,
      storageKey: 'quick-movie-app.logs',
      includeStackTrace: true,
    },
    sentry: {
      enabled: false,
      dsn: '',
      environment: 'development',
      release: undefined,
      enableLogs: true,
      tracesSampleRate: 0.1,
      tracePropagationTargets: ['localhost', 'http://localhost:4200'],
      attachStacktrace: true,
      sendDefaultPii: false,
    },
  },
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
