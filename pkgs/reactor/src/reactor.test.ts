import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';
import EventEmitter from 'node:events';

import { Reactor, logger } from './lib';

let mockLogger: ReturnType<typeof logger>;

beforeEach(() => {
  vi.useFakeTimers();
  mockLogger = logger({ enabled: false, level: 'trace' });
  vi.spyOn(mockLogger, 'info');
  vi.spyOn(mockLogger, 'debug');
});
afterEach(() => {
  vi.clearAllTimers();
});

test('throws an error when it ticks before starting', () => {
  const reactor = new Reactor({ logger: mockLogger });

  expect(() => reactor.tick()).toThrowError('not started');

  reactor.start();
  expect(() => reactor.tick()).not.toThrowError();

  reactor.stop();
  expect(() => reactor.tick()).toThrowError();
});

test('runs and logs a info message on each start/start and a debug message on each tick', () => {
  const reactor = new Reactor({ logger: mockLogger });

  reactor.start();
  expect(mockLogger.info).toHaveBeenCalledTimes(2);
  expect(mockLogger.debug).toHaveBeenCalledTimes(0);
  expect(mockLogger.info).toHaveBeenCalledWith('Reactor#start:begin');
  expect(mockLogger.info).toHaveBeenCalledWith('Reactor#start:end');

  reactor.tick();
  expect(mockLogger.info).toHaveBeenCalledTimes(2);
  expect(mockLogger.debug).toHaveBeenCalledTimes(2);
  expect(mockLogger.debug).toHaveBeenCalledWith('Reactor#tick:begin');
  expect(mockLogger.debug).toHaveBeenCalledWith('Reactor#tick:end');

  reactor.stop();
  expect(mockLogger.info).toHaveBeenCalledTimes(4);
  expect(mockLogger.debug).toHaveBeenCalledTimes(2);
  expect(mockLogger.info).toHaveBeenCalledWith('Reactor#stop:begin');
  expect(mockLogger.info).toHaveBeenCalledWith('Reactor#stop:end');
});

test('exposes the logger on the instance as a read only attribute', () => {
  const reactor = new Reactor({ logger: mockLogger });

  reactor.start();
  expect(reactor.logger.info).toHaveBeenCalledTimes(2);

  expect(() => {
    // @ts-expect-error
    reactor.logger = logger();
  }).toThrowError();
});

describe('#reactor events', () => {
  test('emits start, tick and stop events to registered handlers', () => {
    const reactor = new Reactor({ logger: mockLogger });

    const startBeginCallback = vi.fn();
    reactor.on('reactor:start:begin', startBeginCallback);
    const startEndCallback = vi.fn();
    reactor.on('reactor:start:end', startEndCallback);
    const tickBeginCallback = vi.fn();
    reactor.on('reactor:tick:begin', tickBeginCallback);
    const tickEndCallback = vi.fn();
    reactor.on('reactor:tick:end', tickEndCallback);
    const stopBeginCallback = vi.fn();
    reactor.on('reactor:stop:begin', stopBeginCallback);
    const stopEndCallback = vi.fn();
    reactor.on('reactor:stop:end', stopEndCallback);

    reactor.start();
    expect(startBeginCallback).toHaveBeenCalledOnce();
    expect(startEndCallback).toHaveBeenCalledOnce();

    reactor.tick();
    expect(tickBeginCallback).toHaveBeenCalledOnce();
    expect(tickEndCallback).toHaveBeenCalledOnce();

    reactor.stop();
    expect(stopBeginCallback).toHaveBeenCalledOnce();
    expect(stopEndCallback).toHaveBeenCalledOnce();
  });

  test('can remove a registered event handler', () => {
    const reactor = new Reactor({ logger: mockLogger });

    const tickCallback = vi.fn();
    reactor.on('reactor:tick:begin', tickCallback);

    reactor.start();

    reactor.tick();
    expect(tickCallback).toHaveBeenCalledTimes(1);

    reactor.removeListener('reactor:tick:begin', tickCallback);
    reactor.tick();
    expect(tickCallback).toHaveBeenCalledTimes(1);

    reactor.on('reactor:tick:begin', tickCallback);
    reactor.tick();
    expect(tickCallback).toHaveBeenCalledTimes(2);

    reactor.off('reactor:tick:begin', tickCallback);
    reactor.tick();
    expect(tickCallback).toHaveBeenCalledTimes(2);
  });

  test('can remove all registered event handlers', () => {
    const reactor = new Reactor({ logger: mockLogger });

    const tickCallback1 = vi.fn();
    reactor.on('reactor:tick:begin', tickCallback1);
    const tickCallback2 = vi.fn();
    reactor.on('reactor:tick:begin', tickCallback2);

    reactor.start();

    reactor.tick();
    expect(tickCallback1).toHaveBeenCalledTimes(1);
    expect(tickCallback2).toHaveBeenCalledTimes(1);

    reactor.removeAllListeners('reactor:tick:begin');
    reactor.tick();
    expect(tickCallback1).toHaveBeenCalledTimes(1);
    expect(tickCallback2).toHaveBeenCalledTimes(1);
  });
});

describe('#timers', () => {
  test('executes registered timeout callbacks, a reactor event and a tick event', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const reactorTickBeginCallback = vi.fn();
    reactor.on('reactor:tick:begin', reactorTickBeginCallback);
    const reactorTimerBeginCallback = vi.fn();
    reactor.on('reactor:timer:begin', reactorTimerBeginCallback);
    const registeredTimerCallback1 = vi.fn();
    reactor.setTimeout(registeredTimerCallback1, 1000);
    const registeredTimerCallback2 = vi.fn();
    reactor.setTimeout(registeredTimerCallback2, 2000);
    const reactorTimerEndCallback = vi.fn();
    reactor.on('reactor:timer:end', reactorTimerEndCallback);
    const reactorTickEndCallback = vi.fn();
    reactor.on('reactor:tick:end', reactorTickEndCallback);

    reactor.start();
    expect(reactorTickBeginCallback).toHaveBeenCalledTimes(0);
    expect(reactorTimerBeginCallback).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);
    expect(reactorTimerEndCallback).toHaveBeenCalledTimes(0);
    expect(reactorTickEndCallback).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1000);
    expect(reactorTickBeginCallback).toHaveBeenCalledTimes(1);
    expect(reactorTimerBeginCallback).toHaveBeenCalledTimes(1);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(1);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);
    expect(reactorTimerEndCallback).toHaveBeenCalledTimes(1);
    expect(reactorTickEndCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(2000);
    expect(reactorTickBeginCallback).toHaveBeenCalledTimes(2);
    expect(reactorTimerBeginCallback).toHaveBeenCalledTimes(2);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(1);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(1);
    expect(reactorTimerEndCallback).toHaveBeenCalledTimes(2);
    expect(reactorTickEndCallback).toHaveBeenCalledTimes(2);
  });

  test('emits timer events in the order begin->callback->end', () => {
    let orderedCallbacks: string[] = [];
    const reactor = new Reactor({ logger: mockLogger });
    const reactorTimerBeginCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'reactorTimerBeginCallback'];
    });
    reactor.on('reactor:timer:begin', reactorTimerBeginCallback);
    const registeredTimerCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'registeredTimerCallback'];
    });
    reactor.setTimeout(registeredTimerCallback, 1000);
    const reactorTimerEndCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'reactorTimerEndCallback'];
    });
    reactor.on('reactor:timer:end', reactorTimerEndCallback);

    reactor.start();
    vi.advanceTimersByTime(1000);
    expect(reactorTimerBeginCallback).toHaveBeenCalledTimes(1);
    expect(registeredTimerCallback).toHaveBeenCalledTimes(1);
    expect(reactorTimerEndCallback).toHaveBeenCalledTimes(1);
    expect(orderedCallbacks).toEqual([
      'reactorTimerBeginCallback',
      'registeredTimerCallback',
      'reactorTimerEndCallback',
    ]);
  });

  test('drops timer events that elapse before the reactor is started', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const registeredTimerCallback1 = vi.fn();
    reactor.setTimeout(registeredTimerCallback1, 1000);
    const registeredTimerCallback2 = vi.fn();
    reactor.setTimeout(registeredTimerCallback2, 2000);

    vi.advanceTimersByTime(1000);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);

    reactor.start();
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1000);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(1);
  });

  test('can clear timers before they elapse', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const registeredTimerCallback = vi.fn();
    const registeredTimer = reactor.setTimeout(registeredTimerCallback, 1000);

    reactor.start();
    expect(registeredTimerCallback).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(999);
    expect(registeredTimerCallback).toHaveBeenCalledTimes(0);

    reactor.clearTimeout(registeredTimer);
    vi.advanceTimersByTime(1);
    expect(registeredTimerCallback).toHaveBeenCalledTimes(0);
  });

  test('can clear all timers before they elapse', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const registeredTimerCallback1 = vi.fn();
    const registeredTimer1 = reactor.setTimeout(registeredTimerCallback1, 200);
    const registeredTimerCallback2 = vi.fn();
    const registeredTimer2 = reactor.setTimeout(registeredTimerCallback2, 400);

    reactor.start();
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(199);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);

    const clearedTimers = reactor.clearAllTimeouts();
    expect(clearedTimers).toEqual([registeredTimer1, registeredTimer2]);
    vi.advanceTimersByTime(1);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(200);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);
  });

  test('deregisters timers when they elapse or get cleared', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const registeredTimerCallback1 = vi.fn();
    reactor.setTimeout(registeredTimerCallback1, 1000);
    const registeredTimerCallback2 = vi.fn();
    const registeredTimer2 = reactor.setTimeout(registeredTimerCallback2, 2000);
    const registeredTimerCallback3 = vi.fn();
    const registeredTimer3 = reactor.setTimeout(registeredTimerCallback3, 3000);
    const registeredTimerCallback4 = vi.fn();
    const registeredTimer4 = reactor.setTimeout(registeredTimerCallback4, 4000);

    reactor.start();
    reactor.clearTimeout(registeredTimer2);
    vi.advanceTimersByTime(2000);
    expect(registeredTimerCallback1).toHaveBeenCalledTimes(1);
    expect(registeredTimerCallback2).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback3).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback4).toHaveBeenCalledTimes(0);

    const clearedTimers1 = reactor.clearAllTimeouts();
    expect(clearedTimers1).toEqual([registeredTimer3, registeredTimer4]);

    const clearedTimers2 = reactor.clearAllTimeouts();
    expect(clearedTimers2).toEqual([]);
  });
});

describe('intervals', () => {
  test('executes registered interval callbacks, a reactor event and a tick event', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const reactorTickBeginCallback = vi.fn();
    reactor.on('reactor:tick:begin', reactorTickBeginCallback);
    const reactorIntervalBeginCallback = vi.fn();
    reactor.on('reactor:interval:begin', reactorIntervalBeginCallback);
    const registeredIntervalCallback = vi.fn();
    reactor.setInterval(registeredIntervalCallback, 200);
    const reactorIntervalEndCallback = vi.fn();
    reactor.on('reactor:interval:end', reactorIntervalEndCallback);
    const reactorTickEndCallback = vi.fn();
    reactor.on('reactor:tick:end', reactorTickEndCallback);

    reactor.start();
    expect(reactorTickBeginCallback).toHaveBeenCalledTimes(0);
    expect(reactorIntervalBeginCallback).toHaveBeenCalledTimes(0);
    expect(registeredIntervalCallback).toHaveBeenCalledTimes(0);
    expect(reactorIntervalEndCallback).toHaveBeenCalledTimes(0);
    expect(reactorTickEndCallback).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(200);
    expect(reactorTickBeginCallback).toHaveBeenCalledTimes(1);
    expect(reactorIntervalBeginCallback).toHaveBeenCalledTimes(1);
    expect(registeredIntervalCallback).toHaveBeenCalledTimes(1);
    expect(reactorIntervalEndCallback).toHaveBeenCalledTimes(1);
    expect(reactorTickEndCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);
    expect(reactorTickBeginCallback).toHaveBeenCalledTimes(2);
    expect(reactorIntervalBeginCallback).toHaveBeenCalledTimes(2);
    expect(registeredIntervalCallback).toHaveBeenCalledTimes(2);
    expect(reactorIntervalEndCallback).toHaveBeenCalledTimes(2);
    expect(reactorTickEndCallback).toHaveBeenCalledTimes(2);
  });

  test('emits interval events in the order begin->callback->end', () => {
    let orderedCallbacks: string[] = [];
    const reactor = new Reactor({ logger: mockLogger });
    const reactorIntervalBeginCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'reactorIntervalBeginCallback'];
    });
    reactor.on('reactor:interval:begin', reactorIntervalBeginCallback);
    const registeredIntervalCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'registeredIntervalCallback'];
    });
    reactor.setInterval(registeredIntervalCallback, 200);
    const reactorIntervalEndCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'reactorIntervalEndCallback'];
    });
    reactor.on('reactor:interval:end', reactorIntervalEndCallback);

    reactor.start();
    vi.advanceTimersByTime(200);
    expect(reactorIntervalBeginCallback).toHaveBeenCalledTimes(1);
    expect(registeredIntervalCallback).toHaveBeenCalledTimes(1);
    expect(reactorIntervalEndCallback).toHaveBeenCalledTimes(1);
    expect(orderedCallbacks).toEqual([
      'reactorIntervalBeginCallback',
      'registeredIntervalCallback',
      'reactorIntervalEndCallback',
    ]);
  });

  test('drops interval events that elapse before the reactor is started', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const registeredIntervalCallback1 = vi.fn();
    reactor.setInterval(registeredIntervalCallback1, 100);
    const registeredIntervalCallback2 = vi.fn();
    reactor.setInterval(registeredIntervalCallback2, 200);

    vi.advanceTimersByTime(100);
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(0);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(0);

    reactor.start();
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(0);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(1);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(2);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(1);
  });

  test('can clear intervals before they elapse', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const registeredIntervalCallback = vi.fn();
    const registeredInterval = reactor.setInterval(
      registeredIntervalCallback,
      200,
    );

    reactor.start();
    expect(registeredIntervalCallback).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(199);
    expect(registeredIntervalCallback).toHaveBeenCalledTimes(0);

    reactor.clearInterval(registeredInterval);
    vi.advanceTimersByTime(1);
    expect(registeredIntervalCallback).toHaveBeenCalledTimes(0);
  });

  test('can clear all intervals before they elapse', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const registeredIntervalCallback1 = vi.fn();
    const registeredInterval1 = reactor.setInterval(
      registeredIntervalCallback1,
      200,
    );
    const registeredIntervalCallback2 = vi.fn();
    const registeredInterval2 = reactor.setInterval(
      registeredIntervalCallback2,
      400,
    );

    reactor.start();
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(0);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(199);
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(0);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(0);

    const clearedIntervals = reactor.clearAllIntervals();
    expect(clearedIntervals).toEqual([
      registeredInterval1,
      registeredInterval2,
    ]);
    vi.advanceTimersByTime(1);
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(0);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(200);
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(0);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(0);
  });

  test('deregisters intervals when they get cleared', () => {
    const reactor = new Reactor({ logger: mockLogger });
    const registeredIntervalCallback1 = vi.fn();
    const registeredInterval1 = reactor.setInterval(
      registeredIntervalCallback1,
      1000,
    );
    const registeredIntervalCallback2 = vi.fn();
    const registeredInterval2 = reactor.setInterval(
      registeredIntervalCallback2,
      2000,
    );

    reactor.start();
    reactor.clearInterval(registeredInterval2);
    vi.advanceTimersByTime(2000);
    expect(registeredIntervalCallback1).toHaveBeenCalledTimes(2);
    expect(registeredIntervalCallback2).toHaveBeenCalledTimes(0);

    const clearedIntervals1 = reactor.clearAllIntervals();
    expect(clearedIntervals1).toEqual([registeredInterval1]);

    const clearedIntervals2 = reactor.clearAllIntervals();
    expect(clearedIntervals2).toEqual([]);
  });
});

describe('#emitter events', () => {
  test('executes emitter callbacks in addition to emitting separate reactor events and a tick event', () => {
    const otherEmitter = new EventEmitter();
    const reactor = new Reactor({ logger: mockLogger });
    const tickBeginCallback = vi.fn();
    reactor.on('reactor:tick:begin', tickBeginCallback);
    const helloReactorCallback = vi.fn();
    reactor.on('reactor:emit:hello', helloReactorCallback);
    const helloEmitterCallback = vi.fn();
    reactor.onEmitter(otherEmitter, 'hello', helloEmitterCallback);
    const tickEndCallback = vi.fn();
    reactor.on('reactor:tick:end', tickEndCallback);

    reactor.start();

    otherEmitter.emit('hello', 'world');
    expect(tickBeginCallback).toHaveBeenCalledTimes(1);
    expect(helloReactorCallback).toHaveBeenCalledTimes(1);
    expect(helloReactorCallback).toHaveBeenCalledWith(otherEmitter, 'world');
    expect(helloEmitterCallback).toHaveBeenCalledTimes(1);
    expect(helloEmitterCallback).toHaveBeenCalledWith('world');
    expect(tickEndCallback).toHaveBeenCalledTimes(1);
  });

  test('drops emitter events before the reactor is started', () => {
    const otherEmitter = new EventEmitter();
    const reactor = new Reactor({ logger: mockLogger });
    const helloEmitterCallback = vi.fn();
    reactor.onEmitter(otherEmitter, 'hello', helloEmitterCallback);

    otherEmitter.emit('hello', 'joe');
    expect(helloEmitterCallback).toHaveBeenCalledTimes(0);

    reactor.start();

    otherEmitter.emit('hello', 'joe');
    expect(helloEmitterCallback).toHaveBeenCalledTimes(1);
  });

  test('can remove a registered emitter event handler', () => {
    const otherEmitter = new EventEmitter();
    const reactor = new Reactor({ logger: mockLogger });
    const helloEmitterCallback1 = vi.fn().mockImplementation(() => {});
    reactor.onEmitter(otherEmitter, 'hello1', helloEmitterCallback1);
    const helloEmitterCallback2 = vi.fn().mockImplementation(() => {});
    reactor.onEmitter(otherEmitter, 'hello2', helloEmitterCallback2);

    reactor.start();

    otherEmitter.emit('hello1', 'world');
    expect(helloEmitterCallback1).toHaveBeenCalledTimes(1);
    expect(helloEmitterCallback2).toHaveBeenCalledTimes(0);
    otherEmitter.emit('hello2', 'world');
    expect(helloEmitterCallback1).toHaveBeenCalledTimes(1);
    expect(helloEmitterCallback2).toHaveBeenCalledTimes(1);

    reactor.removeEmitterListener(
      otherEmitter,
      'hello1',
      helloEmitterCallback1,
    );
    otherEmitter.emit('hello1', 'world');
    expect(helloEmitterCallback1).toHaveBeenCalledTimes(1);
    expect(helloEmitterCallback2).toHaveBeenCalledTimes(1);
    otherEmitter.emit('hello2', 'world');
    expect(helloEmitterCallback1).toHaveBeenCalledTimes(1);
    expect(helloEmitterCallback2).toHaveBeenCalledTimes(2);

    reactor.offEmitter(otherEmitter, 'hello2', helloEmitterCallback2);
    otherEmitter.emit('hello1', 'world');
    expect(helloEmitterCallback1).toHaveBeenCalledTimes(1);
    expect(helloEmitterCallback2).toHaveBeenCalledTimes(2);
    otherEmitter.emit('hello2', 'world');
    expect(helloEmitterCallback1).toHaveBeenCalledTimes(1);
    expect(helloEmitterCallback2).toHaveBeenCalledTimes(2);
  });
});
