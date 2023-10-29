import { Reactor, logger } from '@evereactor/reactor';
import EventEmitter from 'node:events';

const reactor = new Reactor({ logger: logger({ level: 'trace' }) });
reactor.start();

const emitter = new EventEmitter();
let emissionCounter = 0;
reactor.onEmitter(emitter, 'hello:world', (...args: any[]) => {
  emissionCounter += 1;
  reactor.logger.info(
    `reactor emit event="hello:world", args=${JSON.stringify(args)}, counter=${emissionCounter}`,
  );
});
emitter.emit('hello:world', 'Lebron');
emitter.emit('hello:world', 'David');

let timeoutCounter = 0;
reactor.setTimeout(() => {
  timeoutCounter += 1;
  reactor.logger.info(`reactor setTimeout elapsed timeout=200ms, counter=${timeoutCounter}`);
}, 100);

const MAX_INTERVALS = 3;
let intervalCounter = 0;
const interval = reactor.setInterval(() => {
  intervalCounter += 1;
  reactor.logger.info(
    `reactor setInterval elapsed counter=${intervalCounter}`,
  );
  if (intervalCounter >= MAX_INTERVALS) {
    reactor.clearInterval(interval);
  }
}, 200);

// TODO:
// - [ ] test that the reactor is stopped when the process exits
// - [ ] await a promise to make it async
// if (emissionCounter !== 2) {
//   throw new Error('emissionCounter !== 2');
// }
// if (timeoutCounter !== 1) {
//   throw new Error('timeoutCounter !== 1');
// }
// if (intervalCounter !== MAX_INTERVALS) {
//   throw new Error(`timeoutCounter !== ${MAX_INTERVALS}`);
// }
// console.log('SUCCESS');
