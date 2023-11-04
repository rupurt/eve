import pino from 'pino';

/**
 * Logger
 */
function Logger(opts?: pino.LoggerOptions): ReturnType<typeof pino> {
  return pino(opts);
}

export { Logger };
