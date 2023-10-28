import EventEmitter from 'node:events';
import { Logger } from 'pino';

import { logger as defaultLogger } from './logger';
import { EventLoopError, NotImplementedError } from './error';

/**
 * EventLoop options
 */
type EventLoopOptions = {
  emitter: EventEmitter;
  logger: Logger;
};

const LIVE_EVENT_EMITTER = new EventEmitter();

/**
 * Core reactive event loop
 */
class EventLoop {
  private _started: boolean = false;
  private _logger: Logger;
  private _emitter: EventEmitter;
  private _emitterEvents: EmittedEvent[] = [];
  // private _registeredTimers: number[] = [];
  private _timerEvents: ClockEvent[] = [];
  // private _registeredIntervals: number[] = [];
  // private _intervalEvents: number[] = [];
  // private _registeredEmitters: EventEmitter[] = [];

  /**
   * EventLoop constructor
   *
   * @param opts - options
   * @returns an EventLoop instance
   */
  constructor(opts?: Partial<EventLoopOptions>) {
    this._logger = opts?.logger || defaultLogger;
    this._emitter = opts?.emitter || LIVE_EVENT_EMITTER;
  }

  /**
   * Start the event loop
   */
  start(): void {
    this._logger.debug('EventLoop#start');
    this._emitReactorEvent('start:begin');

    this._started = true;

    this._emitReactorEvent('start:end');
  }

  /**
   * Process the event loop
   */
  tick(): void {
    this._logger.debug('EventLoop#tick');
    this._emitReactorEvent('tick:begin');

    if (!this._started) {
      throw new EventLoopError('not started');
    }
    this._timerEvents.forEach((timerEvent) => {
      timerEvent.callback();
    });
    this._emitterEvents.forEach((emittedEvent) => {
      this._emitter.emit(
        `reactor:emit:${emittedEvent.event}`,
        ...[emittedEvent.emitter, ...emittedEvent.args],
      );
      emittedEvent.callback(...emittedEvent.args);
    });

    this._emitReactorEvent('tick:end');
  }

  /**
   * Stop the event loop
   */
  stop(): void {
    this._logger.debug('EventLoop#stop');
    this._emitReactorEvent('stop:begin');

    this._started = false;

    this._emitReactorEvent('stop:end');
  }

  /**
   * Execute a callback every interval milliseconds
   *
   * @param callback - the callback to execute
   * @param ms - the interval in milliseconds
   * @returns the timer id
   */
  setInterval<TArgs extends typeof setInterval>(
    callback: Parameters<TArgs>[0],
    ms: Parameters<TArgs>[1],
  ): ReturnType<typeof setInterval> {
    console.log('EventLoop#setInverval - callback: %o, ms: %o', callback, ms);
    return setInterval(callback, ms);
  }

  /**
   * Execute a callback after a delay of milliseconds
   *
   * @param callback - the callback to execute
   * @param ms - the interval in milliseconds
   * @returns the timer id
   */
  setTimeout<TArgs extends typeof setTimeout>(
    callback: Parameters<TArgs>[0],
    ms: Parameters<TArgs>[1],
  ): ReturnType<typeof setTimeout> {
    const eventLoop = this;
    const timer = setTimeout(() => {
      eventLoop._enqueueTimerEvent({ callback: () => this._emitReactorEvent('timer:begin') });
      eventLoop._enqueueTimerEvent({ callback: callback });
      eventLoop._enqueueTimerEvent({ callback: () => this._emitReactorEvent('timer:end') });
      eventLoop.tick();
    }, ms);

    return timer;
  }

  /**
   * Register a callback for event loop, timer or emitter events
   *
   * @param event - the event to register for, can use * to dynamically match events
   * @param callback - the callback to execute
   * @returns the timer id
   */
  on<TArgs extends typeof EventEmitter.prototype.on>(
    event: Parameters<TArgs>[0],
    callback: Parameters<TArgs>[1],
  ): ReturnType<typeof EventEmitter.prototype.on> {
    return this._emitter.on(event, callback);
  }

  /**
   * Remove a registered callback for an event from an emitter
   *
   * @param event - the event to remove listener for
   * @param callback - the listener to remove
   * @returns the event loop event emitter instance
   */
  removeListener<TArgs extends typeof EventEmitter.prototype.removeListener>(
    event: Parameters<TArgs>[0],
    callback: Parameters<TArgs>[1],
  ): ReturnType<typeof EventEmitter.prototype.removeListener> {
    return this._emitter.removeListener(event, callback);
  }

  /**
   * Alias for removeListener
   *
   * @param event - the event to remove listener for
   * @param callback - the listener to remove
   * @returns the event loop event emitter instance
   */
  off<TArgs extends typeof EventEmitter.prototype.removeListener>(
    event: Parameters<TArgs>[0],
    callback: Parameters<TArgs>[1],
  ): ReturnType<typeof EventEmitter.prototype.removeListener> {
    return this.removeListener(event, callback);
  }

  /**
   * Remove all registered callbacks for an event from an emitter
   *
   * @param event - the event to remove all listeners for
   * @param callback - the listener to remove
   * @returns the event loop event emitter instance
   */
  removeAllListeners<
    TArgs extends typeof EventEmitter.prototype.removeAllListeners,
  >(
    event: Parameters<TArgs>[0],
  ): ReturnType<typeof EventEmitter.prototype.removeAllListeners> {
    return this._emitter.removeAllListeners(event);
  }

  /**
   * Register a callback for an event on an emitter, can use * to dynamically match events
   *
   * @param emitter - the emitter to register for
   * @param event - the event to register listener for
   * @param callback - the listener to remove
   * @returns the event emitter instance
   */
  onEmitter<TArgs extends typeof EventEmitter.prototype.on>(
    emitter: EventEmitter,
    event: Parameters<TArgs>[0],
    callback: Parameters<TArgs>[1],
  ): ReturnType<typeof EventEmitter.prototype.on> {
    const eventLoop = this;
    return emitter.on(event, (...args) => {
      if (typeof event == 'string') {
        eventLoop._enqueueEmittedEvent({ emitter, event, args, callback });
      } else {
        throw new NotImplementedError('TODO: support symbols');
      }
      eventLoop.tick();
    });
  }

  /**
   * Remove a registered callback for an event from an emitter
   *
   * @param emitter - the emitter to remove listener for
   * @param event - the event to remove listeners for
   * @param callback - the listener to remove
   * @returns the event emitter instance
   */
  removeEmitterListener<
    TArgs extends typeof EventEmitter.prototype.removeListener,
  >(
    emitter: EventEmitter,
    event: Parameters<TArgs>[0],
    callback: Parameters<TArgs>[1],
  ): ReturnType<typeof EventEmitter.prototype.removeListener> {
    console.log(
      'EventLoop#removeEmitterListener - emitter: %o, event: %o, callback: %o',
      emitter,
      event,
      callback,
    );
    return emitter.removeListener(event, callback);
  }

  /**
   * Alias for removeEmitterListener
   *
   * @param emitter - the emitter to remove listener for
   * @param event - the event to remove listener for
   * @param callback - the listener to remove
   * @returns the event emitter instance
   */
  offEmitter<TArgs extends typeof EventEmitter.prototype.off>(
    emitter: EventEmitter,
    event: Parameters<TArgs>[0],
    callback: Parameters<TArgs>[1],
  ): ReturnType<typeof EventEmitter.prototype.off> {
    return this.removeEmitterListener(emitter, event, callback);
  }

  /**
   * Remove all registered callbacks for an event from an emitter
   *
   * @param emitter - the emitter to remove listener for
   * @param event - the event to remove all listeners for
   * @returns the event emitter instance
   */
  removeAllEmitterlListeners<
    TArgs extends typeof EventEmitter.prototype.removeAllListeners,
  >(
    emitter: EventEmitter,
    callback: Parameters<TArgs>[0],
  ): ReturnType<typeof EventEmitter.prototype.removeAllListeners> {
    console.log(
      'EventLoop#removeAllEmitterListeners - emitter: %o, callback: %o',
      emitter,
      callback,
    );
    return emitter.removeAllListeners(callback);
  }

  private _enqueueEmittedEvent(
    emitted: EmittedEvent,
  ): ReturnType<typeof Array.prototype.push> {
    return this._emitterEvents.push(emitted);
  }

  private _emitReactorEvent(eventSuffix: string, ...args: any[]) {
    this._emitter.emit(`reactor:${eventSuffix}`, ...args);
  }

  private _enqueueTimerEvent(
    timerEvent: ClockEvent,
  ): ReturnType<typeof Array.prototype.push> {
    return this._timerEvents.push(timerEvent);
  }
}

/**
 * Clock event
 */
type ClockEvent = {
  // registeredAt: number;
  // scheduleAfter: number;
  callback: Function;
};

/**
 * Emitted event
 */
type EmittedEvent = {
  emitter: EventEmitter;
  // TODO:
  // - support symbols
  // - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
  event: string;
  args: any[];
  callback: Function;
};

export {
  EventLoop,
  EmittedEvent,
  EventLoopOptions,
};
