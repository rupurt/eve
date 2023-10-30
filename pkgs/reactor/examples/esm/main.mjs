import { Reactor, logger } from '@evereactor/reactor/esm';
import EventEmitter from 'node:events';

/**
 * Example usage of a reactor
 *
 * - emitter events
 * - setTimeout
 * - setInterval
 */
const reactor = new Reactor({ logger: logger({ level: 'trace' }) });
const externalEmitter = new EventEmitter();
const MAX_INTERVALS = 2;
let emissionCounter = 0;
let timeoutCounter = 0;
let intervalCounter = 0;

function example(
  resolve,
  reject
) {
  const interval = reactor.setInterval(() => {
    intervalCounter += 1;
    reactor.logger.info(
      `reactor setInterval elapsed counter=${intervalCounter}`,
    );
    if (intervalCounter >= MAX_INTERVALS) {
      reactor.clearInterval(interval);
      checkExample(resolve, reject);
    }
  }, 200);

  reactor.setTimeout(() => {
    timeoutCounter += 1;
    reactor.logger.info(
      `reactor setTimeout elapsed timeout=200ms, counter=${timeoutCounter}`,
    );
  }, 100);

  reactor.onEmitter(externalEmitter, 'hello:world', (...args) => {
    emissionCounter += 1;
    reactor.logger.info(
      `reactor emit event="hello:world", args=${JSON.stringify(
        args,
      )}, counter=${emissionCounter}`,
    );
  });

  reactor.start();
  externalEmitter.emit('hello:world', 'Lebron');
  externalEmitter.emit('hello:world', 'David');
  externalEmitter.emit('hello:world', 'Taylor');
}

/**
 * Validate that the example executed correctly. There should be:
 *
 * - 3 emitted events
 * - 1 timeout counter
 * - 2 interval counters
 */
function checkExample(
  resolve,
  reject
) {
  let errors = [];

  if (emissionCounter !== 3) {
    errors.push('emissionCounter !== 3');
  }
  if (timeoutCounter !== 1) {
    errors.push('timeoutCounter !== 1');
  }
  if (intervalCounter !== MAX_INTERVALS) {
    errors.push(`timeoutCounter !== ${MAX_INTERVALS}`);
  }

  if (errors.length > 0) {
    reject(new Error(errors.join('\n')));
  }
  resolve(0);
}

/**
 * Run the example and log output
 */
(async () => {
  reactor.logger.info('example starting');
  try {
    await new Promise(example);
    reactor.stop();
    reactor.logger.info('example completed successfully');
    process.exit(0);
  } catch (err) {
    reactor.stop();
    reactor.logger.error(err);
    reactor.logger.error('example did not complete successfully');
    process.exit(1);
  }
})();
