import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LogContext, LogEntry } from './log-entry.model';
import { LOGGER_CONFIG } from './logger.config';
import { LogLevel, shouldLog } from './log-level';
import { LOG_SINKS } from './log-sink';

const SESSION_ID_KEY = 'quick-movie-app.logger.session-id';
const MAX_SERIALIZATION_DEPTH = 4;

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly config = inject(LOGGER_CONFIG);
  private readonly router = inject(Router, { optional: true });
  private readonly sinks = inject(LOG_SINKS);
  private readonly sessionId = this.readOrCreateSessionId();
  private entries: LogEntry[] = this.readPersistedEntries();

  debug(message: string, context: LogContext = {}): void {
    this.log('debug', message, context);
  }

  info(message: string, context: LogContext = {}): void {
    this.log('info', message, context);
  }

  warn(message: string, context: LogContext = {}): void {
    this.log('warn', message, context);
  }

  error(message: string, context: LogContext = {}): void {
    this.log('error', message, context);
  }

  fatal(message: string, context: LogContext = {}): void {
    this.log('fatal', message, context);
  }

  captureException(
    error: unknown,
    message = 'Unexpected exception',
    context: LogContext = {},
  ): void {
    this.error(message, {
      ...context,
      error,
    });
  }

  getEntries(): readonly LogEntry[] {
    return [...this.entries];
  }

  exportEntries(pretty = false): string {
    return JSON.stringify(this.entries, null, pretty ? 2 : 0);
  }

  clear(): void {
    this.entries = [];
    this.persistEntries();
  }

  private log(level: LogLevel, message: string, context: LogContext): void {
    if (!shouldLog(this.config.minimumLevel, level)) {
      return;
    }

    const entry = this.buildEntry(level, message, context);
    this.entries = [...this.entries, entry].slice(-this.config.maxEntries);
    this.persistEntries();
    this.writeToConsole(entry);
    this.writeToSinks(entry);
  }

  private buildEntry(level: LogLevel, message: string, context: LogContext): LogEntry {
    return {
      id: createId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.serializeContext(context),
      route: this.router?.url ?? null,
      sessionId: this.sessionId,
      userAgent: readUserAgent(),
    };
  }

  private serializeContext(context: LogContext): LogContext {
    const serialized = toSerializableValue(context, this.config.includeStackTrace);
    if (isRecord(serialized)) {
      return serialized;
    }
    return { value: serialized };
  }

  private persistEntries(): void {
    if (!this.config.persistenceEnabled) {
      return;
    }

    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.entries));
    } catch {
      // Ignore persistence failures (storage full, unsupported context, or privacy restrictions).
    }
  }

  private readPersistedEntries(): LogEntry[] {
    if (!this.config.persistenceEnabled) {
      return [];
    }

    try {
      const raw = localStorage.getItem(this.config.storageKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(isLogEntry).slice(-this.config.maxEntries);
    } catch {
      return [];
    }
  }

  private readOrCreateSessionId(): string {
    try {
      const existing = sessionStorage.getItem(SESSION_ID_KEY);
      if (existing) {
        return existing;
      }

      const newSessionId = createId();
      sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
      return newSessionId;
    } catch {
      return createId();
    }
  }

  private writeToConsole(entry: LogEntry): void {
    if (!this.config.consoleEnabled) {
      return;
    }

    const payload = {
      id: entry.id,
      route: entry.route,
      sessionId: entry.sessionId,
      ...entry.context,
    };

    switch (entry.level) {
      case 'debug':
      case 'info':
        console.info(`[${entry.level}] ${entry.message}`, payload);
        return;
      case 'warn':
        console.warn(`[${entry.level}] ${entry.message}`, payload);
        return;
      case 'error':
      case 'fatal':
        console.error(`[${entry.level}] ${entry.message}`, payload);
        return;
    }
  }

  private writeToSinks(entry: LogEntry): void {
    for (const sink of this.sinks) {
      try {
        sink.write(entry);
      } catch {
        // Log sinks must never break application flow.
      }
    }
  }
}

function toSerializableValue(
  value: unknown,
  includeStackTrace: boolean,
  seen = new WeakSet<object>(),
  depth = 0,
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: includeStackTrace ? value.stack : undefined,
    };
  }

  if (depth >= MAX_SERIALIZATION_DEPTH) {
    return '[MaxDepthReached]';
  }

  if (Array.isArray(value)) {
    return value.map((item) => toSerializableValue(item, includeStackTrace, seen, depth + 1));
  }

  if (isRecord(value)) {
    if (seen.has(value)) {
      return '[Circular]';
    }

    seen.add(value);
    const serialized: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      serialized[key] = toSerializableValue(item, includeStackTrace, seen, depth + 1);
    }
    return serialized;
  }

  return String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLogEntry(value: unknown): value is LogEntry {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value['id'] === 'string' &&
    typeof value['timestamp'] === 'string' &&
    typeof value['level'] === 'string' &&
    typeof value['message'] === 'string' &&
    isRecord(value['context']) &&
    typeof value['sessionId'] === 'string' &&
    typeof value['userAgent'] === 'string'
  );
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readUserAgent(): string {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }
  return navigator.userAgent;
}
