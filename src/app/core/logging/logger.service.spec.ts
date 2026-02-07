import { TestBed } from '@angular/core/testing';

import { LOGGER_CONFIG, LoggerConfig } from './logger.config';
import { LOG_SINKS } from './log-sink';
import { LoggerService } from './logger.service';

const LOG_STORAGE_KEY = 'quick-movie-app.logs.test';
const SESSION_KEY = 'quick-movie-app.logger.session-id';

describe('LoggerService', () => {
  let service: LoggerService;
  let config: LoggerConfig;

  beforeEach(() => {
    localStorage.removeItem(LOG_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    vi.restoreAllMocks();

    config = {
      minimumLevel: 'debug',
      consoleEnabled: false,
      persistenceEnabled: true,
      maxEntries: 2,
      storageKey: LOG_STORAGE_KEY,
      includeStackTrace: true,
    };

    TestBed.configureTestingModule({
      providers: [LoggerService, { provide: LOGGER_CONFIG, useValue: config }],
    });

    service = TestBed.inject(LoggerService);
  });

  afterEach(() => {
    localStorage.removeItem(LOG_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  });

  it('keeps a bounded buffer and persists logs', () => {
    service.info('event 1');
    service.warn('event 2');
    service.error('event 3');

    const entries = service.getEntries();
    expect(entries).toHaveLength(2);
    expect(entries[0].message).toBe('event 2');
    expect(entries[1].message).toBe('event 3');

    const persisted = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) ?? '[]') as Array<{
      message: string;
    }>;
    expect(persisted).toHaveLength(2);
    expect(persisted[0].message).toBe('event 2');
    expect(persisted[1].message).toBe('event 3');
  });

  it('filters out logs below configured minimum level', () => {
    TestBed.resetTestingModule();
    config = {
      ...config,
      minimumLevel: 'warn',
    };
    TestBed.configureTestingModule({
      providers: [LoggerService, { provide: LOGGER_CONFIG, useValue: config }],
    });
    service = TestBed.inject(LoggerService);

    service.debug('debug event');
    service.info('info event');
    service.warn('warn event');

    const entries = service.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].message).toBe('warn event');
    expect(entries[0].level).toBe('warn');
  });

  it('captures exceptions with serialized error payload', () => {
    service.captureException(new Error('boom'), 'failed request', { feature: 'home' });

    const entry = service.getEntries()[0];
    expect(entry.message).toBe('failed request');
    expect(entry.context['feature']).toBe('home');
    expect(entry.context['error']).toEqual(
      expect.objectContaining({
        name: 'Error',
        message: 'boom',
      }),
    );
  });

  it('forwards log entries to configured sinks', () => {
    const sink = { write: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        LoggerService,
        { provide: LOGGER_CONFIG, useValue: config },
        { provide: LOG_SINKS, useValue: sink, multi: true },
      ],
    });
    service = TestBed.inject(LoggerService);

    service.info('sink-event', { source: 'spec' });

    expect(sink.write).toHaveBeenCalledTimes(1);
    expect(sink.write).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'sink-event',
        level: 'info',
      }),
    );
  });
});
