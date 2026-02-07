import { TestBed } from '@angular/core/testing';

import { SentryClient } from '../../observability/sentry/sentry.client';
import { SENTRY_CONFIG } from '../../observability/sentry/sentry.config';
import { SentryLogSink } from './sentry-log.sink';

describe('SentryLogSink', () => {
  let sentryClient: {
    addBreadcrumb: ReturnType<typeof vi.fn>;
    log: ReturnType<typeof vi.fn>;
    withScope: ReturnType<typeof vi.fn>;
    captureException: ReturnType<typeof vi.fn>;
    captureMessage: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    sentryClient = {
      addBreadcrumb: vi.fn(),
      log: vi.fn(),
      withScope: vi.fn((callback: (scope: ScopeStub) => void) =>
        callback({
          setLevel: vi.fn(),
          setTag: vi.fn(),
          setContext: vi.fn(),
        }),
      ),
      captureException: vi.fn(() => 'event-1'),
      captureMessage: vi.fn(() => 'event-2'),
    };
  });

  it('does not send anything when sentry is disabled', () => {
    TestBed.configureTestingModule({
      providers: [
        SentryLogSink,
        { provide: SentryClient, useValue: sentryClient },
        {
          provide: SENTRY_CONFIG,
          useValue: {
            enabled: false,
            dsn: '',
            environment: 'test',
            release: undefined,
            enableLogs: true,
            tracesSampleRate: 0.1,
            tracePropagationTargets: ['localhost'],
            attachStacktrace: true,
            sendDefaultPii: false,
          },
        },
      ],
    });

    const sink = TestBed.inject(SentryLogSink);
    sink.write({
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'boom',
      context: {},
      route: '/home',
      sessionId: 'session-1',
      userAgent: 'unit-test',
    });

    expect(sentryClient.addBreadcrumb).not.toHaveBeenCalled();
    expect(sentryClient.log).not.toHaveBeenCalled();
    expect(sentryClient.captureException).not.toHaveBeenCalled();
  });

  it('sends breadcrumb and captures error events', () => {
    TestBed.configureTestingModule({
      providers: [
        SentryLogSink,
        { provide: SentryClient, useValue: sentryClient },
        {
          provide: SENTRY_CONFIG,
          useValue: {
            enabled: true,
            dsn: 'https://example.ingest.sentry.io/1',
            environment: 'test',
            release: undefined,
            enableLogs: true,
            tracesSampleRate: 0.1,
            tracePropagationTargets: ['localhost'],
            attachStacktrace: true,
            sendDefaultPii: false,
          },
        },
      ],
    });

    const sink = TestBed.inject(SentryLogSink);
    sink.write({
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'boom',
      context: {
        error: {
          name: 'Error',
          message: 'boom',
        },
      },
      route: '/home',
      sessionId: 'session-1',
      userAgent: 'unit-test',
    });

    expect(sentryClient.addBreadcrumb).toHaveBeenCalledTimes(1);
    expect(sentryClient.log).toHaveBeenCalledTimes(1);
    expect(sentryClient.withScope).toHaveBeenCalledTimes(1);
    expect(sentryClient.captureException).toHaveBeenCalledTimes(1);
  });
});

type ScopeStub = {
  setLevel: ReturnType<typeof vi.fn>;
  setTag: ReturnType<typeof vi.fn>;
  setContext: ReturnType<typeof vi.fn>;
};
