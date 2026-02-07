import * as Sentry from '@sentry/angular';

import { environment } from '../../../../environments/environment';
import { resolveSentryConfig } from './sentry.config';

let initialized = false;

export function initSentry(): void {
  if (initialized) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  const config = resolveSentryConfig(environment);
  const dsn = config.dsn.trim();
  const isEnabled = config.enabled && dsn.length > 0;

  if (!isEnabled) {
    return;
  }

  Sentry.init({
    enabled: true,
    dsn,
    environment: config.environment,
    release: config.release,
    enableLogs: config.enableLogs,
    tracesSampleRate: config.tracesSampleRate,
    tracePropagationTargets: [...config.tracePropagationTargets],
    attachStacktrace: config.attachStacktrace,
    sendDefaultPii: config.sendDefaultPii,
    integrations: [Sentry.browserTracingIntegration()],
  });

  initialized = true;
}
