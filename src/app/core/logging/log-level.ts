export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const LOG_LEVEL_PRIORITIES: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

export function shouldLog(minimumLevel: LogLevel, candidateLevel: LogLevel): boolean {
  return LOG_LEVEL_PRIORITIES[candidateLevel] >= LOG_LEVEL_PRIORITIES[minimumLevel];
}

export function isLogLevel(value: string): value is LogLevel {
  return value in LOG_LEVEL_PRIORITIES;
}
