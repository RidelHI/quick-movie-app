import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';
import type { Scope } from '@sentry/angular';

import { LogEntry } from '../../logging/log-entry.model';

@Injectable({ providedIn: 'root' })
export class SentryClient {
  addBreadcrumb(breadcrumb: Parameters<typeof Sentry.addBreadcrumb>[0]): void {
    Sentry.addBreadcrumb(breadcrumb);
  }

  withScope(callback: (scope: Scope) => void): void {
    Sentry.withScope(callback);
  }

  captureException(exception: unknown): string {
    return Sentry.captureException(exception);
  }

  captureMessage(message: string, level?: Parameters<typeof Sentry.captureMessage>[1]): string {
    return Sentry.captureMessage(message, level);
  }

  log(level: LogEntry['level'], message: string, attributes: Record<string, unknown>): void {
    switch (level) {
      case 'debug':
        Sentry.logger.debug(message, attributes);
        return;
      case 'info':
        Sentry.logger.info(message, attributes);
        return;
      case 'warn':
        Sentry.logger.warn(message, attributes);
        return;
      case 'error':
        Sentry.logger.error(message, attributes);
        return;
      case 'fatal':
        Sentry.logger.fatal(message, attributes);
        return;
    }
  }
}
