import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';
import EventEmitter from 'node:events';

import { EventLoop, logger as defaultLogger } from './lib';

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.restoreAllMocks()
})

test('throws an error when it ticks before starting', () => {
  const eventLoop = new EventLoop();

  expect(() => eventLoop.tick()).toThrowError('not started');

  eventLoop.start();
  expect(() => eventLoop.tick()).not.toThrowError();

  eventLoop.stop();
  expect(() => eventLoop.tick()).toThrowError();
});

test('runs and logs a debug message on each start, tick and stop', () => {
  vi.spyOn(defaultLogger, 'debug');
  const eventLoop = new EventLoop({ logger: defaultLogger });

  eventLoop.start();
  expect(defaultLogger.debug).toHaveBeenCalledTimes(1);
  expect(defaultLogger.debug).toHaveBeenCalledWith('EventLoop#start');

  eventLoop.tick();
  expect(defaultLogger.debug).toHaveBeenCalledTimes(2);
  expect(defaultLogger.debug).toHaveBeenCalledWith('EventLoop#tick');

  eventLoop.stop();
  expect(defaultLogger.debug).toHaveBeenCalledTimes(3);
  expect(defaultLogger.debug).toHaveBeenCalledWith('EventLoop#stop');
});

describe('#events', () => {
  test('emits start, tick and stop events to registered handlers', () => {
    const eventLoop = new EventLoop();

    const startBeginCallback = vi.fn();
    eventLoop.on('reactor:start:begin', startBeginCallback);
    const startEndCallback = vi.fn();
    eventLoop.on('reactor:start:end', startEndCallback);
    const tickBeginCallback = vi.fn();
    eventLoop.on('reactor:tick:begin', tickBeginCallback);
    const tickEndCallback = vi.fn();
    eventLoop.on('reactor:tick:end', tickEndCallback);
    const stopBeginCallback = vi.fn();
    eventLoop.on('reactor:stop:begin', stopBeginCallback);
    const stopEndCallback = vi.fn();
    eventLoop.on('reactor:stop:end', stopEndCallback);

    eventLoop.start();
    expect(startBeginCallback).toHaveBeenCalledOnce();
    expect(startEndCallback).toHaveBeenCalledOnce();

    eventLoop.tick();
    expect(tickBeginCallback).toHaveBeenCalledOnce();
    expect(tickEndCallback).toHaveBeenCalledOnce();

    eventLoop.stop();
    expect(stopBeginCallback).toHaveBeenCalledOnce();
    expect(stopEndCallback).toHaveBeenCalledOnce();
  });

  test('can remove a registered event handler', () => {
    const eventLoop = new EventLoop();

    const tickCallback = vi.fn();
    eventLoop.on('reactor:tick:begin', tickCallback);

    eventLoop.start();

    eventLoop.tick();
    expect(tickCallback).toHaveBeenCalledTimes(1);

    eventLoop.removeListener('reactor:tick:begin', tickCallback);
    eventLoop.tick();
    expect(tickCallback).toHaveBeenCalledTimes(1);

    eventLoop.on('reactor:tick:begin', tickCallback);
    eventLoop.tick();
    expect(tickCallback).toHaveBeenCalledTimes(2);

    eventLoop.off('reactor:tick:begin', tickCallback);
    eventLoop.tick();
    expect(tickCallback).toHaveBeenCalledTimes(2);
  });

  test('can remove all registered event handlers', () => {
    const eventLoop = new EventLoop();

    const tickCallback1 = vi.fn();
    eventLoop.on('reactor:tick:begin', tickCallback1);
    const tickCallback2 = vi.fn();
    eventLoop.on('reactor:tick:begin', tickCallback2);

    eventLoop.start();

    eventLoop.tick();
    expect(tickCallback1).toHaveBeenCalledTimes(1);
    expect(tickCallback2).toHaveBeenCalledTimes(1);

    eventLoop.removeAllListeners('reactor:tick:begin');
    eventLoop.tick();
    expect(tickCallback1).toHaveBeenCalledTimes(1);
    expect(tickCallback2).toHaveBeenCalledTimes(1);
  });

  test('executes emitter callbacks in addition to emitting separate reactor events and a tick event', () => {
    const otherEmitter = new EventEmitter();
    const eventLoop = new EventLoop({ emitter: otherEmitter });
    const tickBeginCallback = vi.fn();
    eventLoop.on('reactor:tick:begin', tickBeginCallback);
    const tickEndCallback = vi.fn();
    eventLoop.on('reactor:tick:end', tickEndCallback);
    const helloReactorCallback = vi.fn();
    eventLoop.on('reactor:emit:hello', helloReactorCallback);
    const helloEmitterCallback = vi.fn();
    eventLoop.onEmitter(otherEmitter, 'hello', helloEmitterCallback);

    eventLoop.start();

    otherEmitter.emit('hello', 'world');
    expect(tickBeginCallback).toHaveBeenCalledTimes(1);
    expect(helloReactorCallback).toHaveBeenCalledTimes(1);
    expect(helloReactorCallback).toHaveBeenCalledWith(otherEmitter, 'world');
    expect(helloEmitterCallback).toHaveBeenCalledTimes(1);
    expect(helloEmitterCallback).toHaveBeenCalledWith('world');
    expect(tickEndCallback).toHaveBeenCalledTimes(1);
  });
});

describe('#timers', () => {
  test('executes registered timeout callbacks, a reactor event and a tick event', () => {
    const eventLoop = new EventLoop();
    const reactorTickBeginCallback = vi.fn();
    eventLoop.on('reactor:tick:begin', reactorTickBeginCallback);
    const reactorTickEndCallback = vi.fn();
    eventLoop.on('reactor:tick:end', reactorTickEndCallback);
    const reactorTimerBeginCallback = vi.fn();
    eventLoop.on('reactor:timer:begin', reactorTimerBeginCallback);
    const registeredTimerCallback = vi.fn();
    eventLoop.setTimeout(registeredTimerCallback, 1000);
    const reactorTimerEndCallback = vi.fn();
    eventLoop.on('reactor:timer:end', reactorTimerEndCallback);

    eventLoop.start();
    expect(reactorTickBeginCallback).toHaveBeenCalledTimes(0);
    expect(reactorTimerBeginCallback).toHaveBeenCalledTimes(0);
    expect(registeredTimerCallback).toHaveBeenCalledTimes(0);
    expect(reactorTimerEndCallback).toHaveBeenCalledTimes(0);
    expect(reactorTickEndCallback).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1000)
    expect(reactorTickBeginCallback).toHaveBeenCalledTimes(1);
    expect(reactorTimerBeginCallback).toHaveBeenCalledTimes(1);
    expect(registeredTimerCallback).toHaveBeenCalledTimes(1);
    expect(reactorTimerEndCallback).toHaveBeenCalledTimes(1);
    expect(reactorTickEndCallback).toHaveBeenCalledTimes(1);
  });

  test('emits timer events in the order begin->callback->end', () => {
    let orderedCallbacks: string[] = [];
    const eventLoop = new EventLoop();
    const reactorTimerBeginCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'reactorTimerBeginCallback'];
    });
    eventLoop.on('reactor:timer:begin', reactorTimerBeginCallback);
    const registeredTimerCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'registeredTimerCallback'];
    });
    eventLoop.setTimeout(registeredTimerCallback, 1000);
    const reactorTimerEndCallback = vi.fn().mockImplementation(() => {
      orderedCallbacks = [...orderedCallbacks, 'reactorTimerEndCallback'];
    });
    eventLoop.on('reactor:timer:end', reactorTimerEndCallback);

    eventLoop.start();
    vi.advanceTimersByTime(1000)
    expect(reactorTimerBeginCallback).toHaveBeenCalledTimes(1);
    expect(registeredTimerCallback).toHaveBeenCalledTimes(1);
    expect(reactorTimerEndCallback).toHaveBeenCalledTimes(1);
    expect(orderedCallbacks).toEqual([
      'reactorTimerBeginCallback',
      'registeredTimerCallback',
      'reactorTimerEndCallback',
    ]);
  });
})
