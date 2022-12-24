import EventEmitter from 'node:events';
import { Logger } from 'pino';

import { logger } from './logger.js';
import { ReactorError, NotImplementedError } from './error.js';

/**
 * Reactor options
 */
type ReactorOptions = {
  emitter: EventEmitter;
  logger: ReturnType<typeof logger>;
};

/**
 * Core reactive reactor
 */
class Reactor {
  private _running: boolean = false;
  private _logger: ReturnType<typeof logger>;
  private _emitter: EventEmitter;
  private _emitterEvents: EmittedEvent[] = [];
  private _registeredTimers: ReturnType<typeof setTimeout>[] = [];
  private _timerEvents: ClockEvent[] = [];
  private _registeredIntervals: ReturnType<typeof setInterval>[] = [];
  private _intervalEvents: ClockEvent[] = [];
  private _externalEmitterListeners: ExternalEmitterListener[] = [];

  /**
   * Reactor constructor
   *
   * @param opts - options
   * @returns an Reactor instance
   */
  constructor(opts?: Partial<ReactorOptions>) {
    this._logger = opts?.logger || logger();
    this._emitter = opts?.emitter || new EventEmitter();
  }

  /**
   * Get the reactor logger
   *
   * @return the reactor logger
   */
  get logger(): Logger {
    return this._logger;
  }

  /**
   * Start the reactor
   */
  start(): void {
    this._logInfo('start:begin');
    this._emitReactorEvent('start:begin');

    this._running = true;

    this._emitReactorEvent('start:end');
    this._logInfo('start:end');
  }

  /**
   * Process the reactor
   */
  tick(): void {
    this._logDebug('tick:begin');
    this._emitReactorEvent('tick:begin');

    if (!this._running) {
      throw new ReactorError('not started');
    }
    this._timerEvents.forEach((e) => e.callback());
    this._timerEvents = [];
    this._intervalEvents.forEach((e) => e.callback());
    this._intervalEvents = [];
    this._emitterEvents.forEach((emittedEvent) => {
      this._emitReactorEvent(
        `emit:${emittedEvent.event}`,
        ...[emittedEvent.emitter, ...emittedEvent.args],
      );
      emittedEvent.callback(...emittedEvent.args);
    });
    this._emitterEvents = [];

    this._emitReactorEvent('tick:end');
    this._logDebug('tick:end');
  }

  /**
   * Stop the reactor
   */
  stop(): void {
    this._logInfo('stop:begin');
    this._emitReactorEvent('stop:begin');

    this._running = false;

    this._emitReactorEvent('stop:end');
    this._logInfo('stop:end');
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
    const timer = setTimeout(() => {
      this._registeredTimers = this._registeredTimers.filter((t) => t != timer);
      if (this._running) {
        this._enqueueTimerEvent({
          callback: () => this._emitReactorEvent('timer:begin'),
        });
        this._enqueueTimerEvent({ callback: callback });
        this._enqueueTimerEvent({
          callback: () => this._emitReactorEvent('timer:end'),
        });
        this.tick();
      }
    }, ms);
    this._registeredTimers.push(timer);

    return timer;
  }

  /**
   * Clear a timer
   *
   * @param timer - the timer to clear
   * @returns the timer id
   */
  clearTimeout<TArgs extends typeof clearTimeout>(
    timer: Parameters<TArgs>[0],
  ): ReturnType<typeof clearTimeout> {
    this._registeredTimers = this._registeredTimers.filter((t) => {
      if (t != timer) {
        return true;
      }

      clearTimeout(t);
      return false;
    });
  }

  /**
   * Clear all timers
   *
   * @returns an array of cleared timers
   */
  clearAllTimeouts(): ReturnType<typeof setTimeout>[] {
    const clearedTimers = this._registeredTimers.map((t) => {
      clearTimeout(t);
      return t;
    });
    this._registeredTimers = [];

    return clearedTimers;
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
    const interval = setInterval(() => {
      if (this._running) {
        this._enqueueIntervalEvent({
          callback: () => this._emitReactorEvent('interval:begin'),
        });
        this._enqueueIntervalEvent({ callback: callback });
        this._enqueueIntervalEvent({
          callback: () => this._emitReactorEvent('interval:end'),
        });
        this.tick();
      }
    }, ms);
    this._registeredIntervals.push(interval);

    return interval;
  }

  /**
   * Clear an interval
   *
   * @param interval - the interval to clear
   * @returns the timer id
   */
  clearInterval<TArgs extends typeof clearInterval>(
    interval: Parameters<TArgs>[0],
  ): ReturnType<typeof clearInterval> {
    this._registeredIntervals = this._registeredIntervals.filter((i) => {
      if (i != interval) {
        return true;
      }

      clearInterval(i);
      return false;
    });
  }

  /**
   * Clear all intervals
   *
   * @returns an array of cleared intervals
   */
  clearAllIntervals(): ReturnType<typeof setInterval>[] {
    const clearedIntervals = this._registeredIntervals.map((i) => {
      clearInterval(i);
      return i;
    });
    this._registeredIntervals = [];

    return clearedIntervals;
  }

  /**
   * Register a callback for reactor, timer or emitter events
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
   * @returns the reactor event emitter instance
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
   * @returns the reactor event emitter instance
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
   * @returns the reactor event emitter instance
   */
  removeAllListeners<
    TArgs extends typeof EventEmitter.prototype.removeAllListeners,
  >(
    event: Parameters<TArgs>[0],
  ): ReturnType<typeof EventEmitter.prototype.removeAllListeners> {
    return this._emitter.removeAllListeners(event);
  }

  /**
   * Register a callback for an event on an emitter
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
    const reactor = this;
    function listener(...args: any[]): void {
      if (reactor._running) {
        if (typeof event == 'string') {
          reactor._enqueueEmittedEvent({ emitter, event, args, callback });
        } else {
          throw new NotImplementedError('TODO: support symbols');
        }
        reactor.tick();
      }
    }

    this._externalEmitterListeners.push([callback, listener]);
    return emitter.on(event, listener);
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
    this._externalEmitterListeners.find(
      ([delegatedCallback, reactorCallback]) => {
        if (delegatedCallback == callback) {
          emitter.removeListener(event, reactorCallback);
          return true;
        }
      },
    );

    return emitter;
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
    event: Parameters<TArgs>[0],
  ): ReturnType<typeof EventEmitter.prototype.removeAllListeners> {
    emitter.removeAllListeners(event);
    return emitter;
  }

  private _logDebug(
    msg: string,
  ): ReturnType<ReturnType<typeof logger>['debug']> {
    return this._logger.debug(`Reactor#${msg}`);
  }

  private _logInfo(msg: string): ReturnType<ReturnType<typeof logger>['info']> {
    return this._logger.info(`Reactor#${msg}`);
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

  private _enqueueIntervalEvent(
    intervalEvent: ClockEvent,
  ): ReturnType<typeof Array.prototype.push> {
    return this._intervalEvents.push(intervalEvent);
  }
}

/**
 * External emitter listeners
 */
type OnEmitterDelegatedListener = Parameters<
  typeof EventEmitter.prototype.on
>[1];
type OnEmitterReactorListener = (...args: any[]) => void;
type ExternalEmitterListener = [
  OnEmitterDelegatedListener,
  OnEmitterReactorListener,
];

/**
 * Clock event
 */
type ClockEvent = {
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

export { Reactor as Reactor, EmittedEvent, ReactorOptions };
