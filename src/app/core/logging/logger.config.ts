import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';
import { isLogLevel, LogLevel } from './log-level';

export interface LoggerConfig {
  minimumLevel: LogLevel;
  consoleEnabled: boolean;
  persistenceEnabled: boolean;
  maxEntries: number;
  storageKey: string;
  includeStackTrace: boolean;
}

type PartialLoggerConfig = Partial<LoggerConfig>;

type EnvironmentWithObservability = {
  observability?: {
    logger?: PartialLoggerConfig;
  };
};

const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  minimumLevel: 'info',
  consoleEnabled: true,
  persistenceEnabled: true,
  maxEntries: 250,
  storageKey: 'quick-movie-app.logs',
  includeStackTrace: true,
};

export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('LOGGER_CONFIG', {
  providedIn: 'root',
  factory: resolveLoggerConfig,
});

function resolveLoggerConfig(): LoggerConfig {
  const configured = (environment as EnvironmentWithObservability).observability?.logger;
  if (!configured) {
    return DEFAULT_LOGGER_CONFIG;
  }

  return {
    minimumLevel: resolveMinimumLevel(configured.minimumLevel),
    consoleEnabled: configured.consoleEnabled ?? DEFAULT_LOGGER_CONFIG.consoleEnabled,
    persistenceEnabled: configured.persistenceEnabled ?? DEFAULT_LOGGER_CONFIG.persistenceEnabled,
    maxEntries: resolveMaxEntries(configured.maxEntries),
    storageKey: resolveStorageKey(configured.storageKey),
    includeStackTrace: configured.includeStackTrace ?? DEFAULT_LOGGER_CONFIG.includeStackTrace,
  };
}

function resolveMinimumLevel(value: unknown): LogLevel {
  if (typeof value === 'string' && isLogLevel(value)) {
    return value;
  }
  return DEFAULT_LOGGER_CONFIG.minimumLevel;
}

function resolveMaxEntries(value: unknown): number {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }
  return DEFAULT_LOGGER_CONFIG.maxEntries;
}

function resolveStorageKey(value: unknown): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return DEFAULT_LOGGER_CONFIG.storageKey;
}
