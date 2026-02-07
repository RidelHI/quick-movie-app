import { resolveSentryConfig } from './sentry.config';

describe('resolveSentryConfig', () => {
  it('returns defaults when observability config is missing', () => {
    const config = resolveSentryConfig({ production: false });

    expect(config.enabled).toBe(false);
    expect(config.enableLogs).toBe(true);
    expect(config.environment).toBe('development');
    expect(config.tracesSampleRate).toBe(0.1);
  });

  it('uses production environment fallback and custom values', () => {
    const config = resolveSentryConfig({
      production: true,
      observability: {
        sentry: {
          enabled: true,
          dsn: 'https://example.ingest.sentry.io/123',
          tracesSampleRate: 0.5,
          tracePropagationTargets: ['localhost', 'https://api.example.com'],
        },
      },
    });

    expect(config.enabled).toBe(true);
    expect(config.enableLogs).toBe(true);
    expect(config.environment).toBe('production');
    expect(config.dsn).toContain('example.ingest.sentry.io');
    expect(config.tracesSampleRate).toBe(0.5);
    expect(config.tracePropagationTargets).toEqual(['localhost', 'https://api.example.com']);
  });

  it('normalizes invalid sample rate and targets', () => {
    const config = resolveSentryConfig({
      production: false,
      observability: {
        sentry: {
          tracesSampleRate: 2,
          tracePropagationTargets: [123 as unknown as string, '' as unknown as string],
        },
      },
    });

    expect(config.tracesSampleRate).toBe(0.1);
    expect(config.tracePropagationTargets).toEqual(['localhost', 'http://localhost:4200']);
  });
});
