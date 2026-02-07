import { Injectable, inject } from '@angular/core';
import type { SeverityLevel } from '@sentry/angular';
import type { Scope } from '@sentry/angular';

import { SentryClient } from '../../observability/sentry/sentry.client';
import { SENTRY_CONFIG } from '../../observability/sentry/sentry.config';
import { LogEntry } from '../log-entry.model';
import { LogSink } from '../log-sink';

@Injectable()
export class SentryLogSink implements LogSink {
  private readonly config = inject(SENTRY_CONFIG);
  private readonly sentry = inject(SentryClient);

  write(entry: LogEntry): void {
    if (!this.config.enabled || !this.config.dsn.trim()) {
      return;
    }

    const attributes: Record<string, unknown> = {
      route: entry.route,
      sessionId: entry.sessionId,
      ...entry.context,
    };

    if (this.config.enableLogs) {
      this.sentry.log(entry.level, entry.message, attributes);
    }

    this.sentry.addBreadcrumb({
      category: 'app.log',
      level: toSentryLevel(entry.level),
      message: entry.message,
      data: attributes,
      timestamp: new Date(entry.timestamp).getTime() / 1000,
    });

    if (entry.level === 'error' || entry.level === 'fatal') {
      this.captureErrorEvent(entry);
    }
  }

  private captureErrorEvent(entry: LogEntry): void {
    const errorContext = entry.context['error'];
    const contextWithoutError = { ...entry.context };
    delete contextWithoutError['error'];

    this.sentry.withScope((scope: Scope) => {
      scope.setLevel(toSentryLevel(entry.level));
      scope.setTag('logger_level', entry.level);
      scope.setTag('session_id', entry.sessionId);

      if (entry.route) {
        scope.setTag('route', entry.route);
      }

      scope.setContext('logger_context', contextWithoutError);
      scope.setContext('logger_entry', {
        id: entry.id,
        route: entry.route,
        userAgent: entry.userAgent,
      });

      if (isErrorLike(errorContext)) {
        this.sentry.captureException(toError(errorContext));
        return;
      }

      this.sentry.captureMessage(entry.message, toSentryLevel(entry.level));
    });
  }
}

function toSentryLevel(level: LogEntry['level']): SeverityLevel {
  switch (level) {
    case 'debug':
      return 'debug';
    case 'info':
      return 'info';
    case 'warn':
      return 'warning';
    case 'error':
      return 'error';
    case 'fatal':
      return 'fatal';
  }
}

function isErrorLike(
  value: unknown,
): value is { message?: unknown; name?: unknown; stack?: unknown } {
  return typeof value === 'object' && value !== null;
}

function toError(value: { message?: unknown; name?: unknown; stack?: unknown }): Error {
  if (value instanceof Error) {
    return value;
  }

  const message = typeof value.message === 'string' ? value.message : 'Unknown error';
  const error = new Error(message);
  error.name = typeof value.name === 'string' ? value.name : 'Error';

  if (typeof value.stack === 'string') {
    error.stack = value.stack;
  }

  return error;
}
