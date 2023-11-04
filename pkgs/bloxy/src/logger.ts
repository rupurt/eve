import pino, { Logger, LoggerOptions } from 'pino';

function logger(opts?: LoggerOptions): Logger {
  return pino(opts || {});
}

export { logger };
