import { InjectionToken } from '@angular/core';

import { LogEntry } from './log-entry.model';

export interface LogSink {
  write(entry: LogEntry): void;
}

export const LOG_SINKS = new InjectionToken<readonly LogSink[]>('LOG_SINKS', {
  providedIn: 'root',
  factory: () => [],
});
