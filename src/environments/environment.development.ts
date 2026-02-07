export const environment = {
  production: false,
  observability: {
    logger: {
      minimumLevel: 'debug',
      consoleEnabled: true,
      persistenceEnabled: true,
      maxEntries: 400,
      storageKey: 'quick-movie-app.logs',
      includeStackTrace: true,
    },
    sentry: {
      enabled: false,
      dsn: 'https://f9a69f22b7ddfd401ae83435af6998c6@o4510846246125568.ingest.us.sentry.io/4510846247436288',
      environment: 'development',
      release: undefined,
      enableLogs: true,
      tracesSampleRate: 0.2,
      tracePropagationTargets: ['localhost', 'http://localhost:4200'],
      attachStacktrace: true,
      sendDefaultPii: false,
    },
  },
  tmdb: {
    apiBaseUrlV3: 'https://api.themoviedb.org/3',
    apiBaseUrlV4: 'https://api.themoviedb.org/4',
    readAccessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzllNTRlOWNhYzJjNzQzMzEyN2I5MTMyNjE0MzY3OSIsIm5iZiI6MTc3MDEzNDgyMi43NDUsInN1YiI6IjY5ODIxZDI2NmUzN2NhYzJmNTQxOTNiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ES3AMSxpg9FB02nndF2LxjDn3LoHKnpXHz7RODBi7s8',
    redirectUri: 'http://localhost:4200/auth/callback',
    httpCache: {
      enabled: true,
      defaultTtlMs: 30000,
    },
  },
};
