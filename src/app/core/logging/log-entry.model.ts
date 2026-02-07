import { LogLevel } from './log-level';

export type LogContext = Readonly<Record<string, unknown>>;

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  route: string | null;
  sessionId: string;
  userAgent: string;
}
