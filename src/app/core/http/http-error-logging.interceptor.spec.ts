import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoggerService } from '../logging/logger.service';
import { httpErrorLoggingInterceptor } from './http-error-logging.interceptor';

describe('httpErrorLoggingInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let logger: { error: ReturnType<typeof vi.fn>; captureException: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    logger = {
      error: vi.fn(),
      captureException: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorLoggingInterceptor])),
        provideHttpClientTesting(),
        { provide: LoggerService, useValue: logger },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('logs failed HTTP responses with metadata', () => {
    http.get('/api/failing').subscribe({ error: () => undefined });

    const req = httpTesting.expectOne('/api/failing');
    req.flush({ message: 'fail' }, { status: 500, statusText: 'Server Error' });

    expect(logger.error).toHaveBeenCalledWith(
      'HTTP request failed',
      expect.objectContaining({
        method: 'GET',
        url: '/api/failing',
        status: 500,
        statusText: 'Server Error',
      }),
    );
    expect(logger.captureException).not.toHaveBeenCalled();
  });

  it('does not log anything for successful responses', () => {
    http.get('/api/ok').subscribe();

    const req = httpTesting.expectOne('/api/ok');
    req.flush({ ok: true });

    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.captureException).not.toHaveBeenCalled();
  });
});
