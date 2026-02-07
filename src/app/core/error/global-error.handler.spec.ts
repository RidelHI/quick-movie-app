import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LoggerService } from '../logging/logger.service';
import { GlobalErrorHandler } from './global-error.handler';

describe('GlobalErrorHandler', () => {
  it('reports unhandled errors through LoggerService', () => {
    const logger = {
      captureException: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: LoggerService, useValue: logger },
      ],
    });

    const errorHandler = TestBed.inject(ErrorHandler);
    const boom = new Error('boom');

    errorHandler.handleError(boom);

    expect(logger.captureException).toHaveBeenCalledWith(boom, 'Unhandled Angular error');
  });
});
