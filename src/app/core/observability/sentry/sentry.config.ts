import { InjectionToken } from '@angular/core';

import { environment } from '../../../../environments/environment';

export interface SentryConfig {
  enabled: boolean;
  dsn: string;
  environment: string;
  release?: string;
  enableLogs: boolean;
  tracesSampleRate: number;
  tracePropagationTargets: readonly string[];
  attachStacktrace: boolean;
  sendDefaultPii: boolean;
}

type PartialSentryConfig = Partial<SentryConfig>;

type EnvironmentWithObservability = {
  production?: boolean;
  observability?: {
    sentry?: PartialSentryConfig;
  };
};

const DEFAULT_CONFIG: SentryConfig = {
  enabled: false,
  dsn: '',
  environment: 'development',
  release: undefined,
  enableLogs: true,
  tracesSampleRate: 0.1,
  tracePropagationTargets: ['localhost', 'http://localhost:4200'],
  attachStacktrace: true,
  sendDefaultPii: false,
};

export const SENTRY_CONFIG = new InjectionToken<SentryConfig>('SENTRY_CONFIG', {
  providedIn: 'root',
  factory: () => resolveSentryConfig(environment as EnvironmentWithObservability),
});

export function resolveSentryConfig(input: EnvironmentWithObservability): SentryConfig {
  const configured = input.observability?.sentry;

  if (!configured) {
    return {
      ...DEFAULT_CONFIG,
      environment: input.production ? 'production' : DEFAULT_CONFIG.environment,
    };
  }

  return {
    enabled: configured.enabled ?? DEFAULT_CONFIG.enabled,
    dsn: typeof configured.dsn === 'string' ? configured.dsn : DEFAULT_CONFIG.dsn,
    environment: resolveEnvironment(configured.environment, input.production),
    release: resolveRelease(configured.release),
    enableLogs: configured.enableLogs ?? DEFAULT_CONFIG.enableLogs,
    tracesSampleRate: resolveSampleRate(configured.tracesSampleRate),
    tracePropagationTargets: resolveTargets(configured.tracePropagationTargets),
    attachStacktrace: configured.attachStacktrace ?? DEFAULT_CONFIG.attachStacktrace,
    sendDefaultPii: configured.sendDefaultPii ?? DEFAULT_CONFIG.sendDefaultPii,
  };
}

function resolveEnvironment(configured: unknown, production: boolean | undefined): string {
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim();
  }
  return production ? 'production' : 'development';
}

function resolveRelease(configured: unknown): string | undefined {
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim();
  }
  return undefined;
}

function resolveSampleRate(configured: unknown): number {
  if (typeof configured === 'number' && configured >= 0 && configured <= 1) {
    return configured;
  }
  return DEFAULT_CONFIG.tracesSampleRate;
}

function resolveTargets(configured: unknown): readonly string[] {
  if (Array.isArray(configured)) {
    const targets = configured.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
    if (targets.length > 0) {
      return targets;
    }
  }
  return DEFAULT_CONFIG.tracePropagationTargets;
}
