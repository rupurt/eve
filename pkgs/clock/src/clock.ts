import { ClockError } from './error';

// /**
//  * Clock timer options
//  */
// type ClockTimerOptions = {
//   setTimeout: typeof setTimeout;
//   clearTimeout: typeof clearTimeout;
//   setInterval: typeof setInterval;
//   clearInterval: typeof clearInterval;
// };
//
// /**
//  * Clock timer
//  */
// class ClockTimer {
//   private _setTimeout: typeof setTimeout;
//   private _clearTimeout: typeof clearTimeout;
//   private _setInterval: typeof setInterval;
//   private _clearInterval: typeof clearInterval;
//
//   constructor(opts?: ClockTimerOptions) {
//     this._setTimeout = opts?.setTimeout || setTimeout;
//     this._clearTimeout = opts?.clearTimeout || clearTimeout;
//     this._setInterval = opts?.setInterval || setInterval;
//     this._clearInterval = opts?.clearInterval || clearInterval;
//   }
//
//   setTimeout(clock: Clock, ms: number) { }
// }

function clockSetTimeout<T extends typeof setTimeout>(
  clock: Clock,
  ms: Parameters<T>[1],
  set: T,
): ReturnType<typeof setTimeout> {
  const relativeMs = ms || 0;
  return set(() => {
    clock.tick(relativeMs);
  }, relativeMs);
}

/**
 * Clock options
 */
type ClockOptions = {
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;
};

/**
 * Deterministic relative time clock
 */
class Clock {
  private _setTimeout: ClockOptions['setTimeout'];
  private _clearTimeout: ClockOptions['clearTimeout'];
  // private _setInterval: ClockOptions['setInterval'];
  // private _clearInterval: ClockOptions['clearInterval'];
  private _startedAt?: number;
  private _stoppedAt?: number;
  private _now: number = 0;
  private _timerEvents: ClockEvent[] = [];

  /**
   * Create a new clock
   *
   * @param opts - clock options
   */
  constructor(opts?: Partial<ClockOptions>) {
    this._setTimeout = opts?.setTimeout || setTimeout;
    this._clearTimeout = opts?.clearTimeout || clearTimeout;
    // this._setInterval = opts?.setInterval || setInterval;
    // this._clearInterval = opts?.clearInterval || clearInterval;
  }

  /**
   * Start the clock
   */
  start() {
    if (this._stoppedAt) {
      throw new Error('clock is running');
    }
    this._startedAt = Date.now();
    this._stoppedAt = undefined;
  }

  /**
   * Relative ms since the last tick
   */
  now(): number {
    return this._now;
  }

  /**
   * Stop the clock
   */
  stop() {
    if (!this._startedAt) {
      throw new Error('clock not started');
    }
    this._stoppedAt = Date.now();
  }

  /**
   * Set a timeout to execute when the clock advances
   *
   * @param callback - the callback to execute
   * @param ms - the timeout in milliseconds
   * @returns the timer id
   */
  setTimeout<TArgs extends typeof setTimeout>(
    callback: Parameters<TArgs>[0],
    ms: Parameters<TArgs>[1],
    // ): ReturnType<typeof setTimeout> {
  ): void {
    const clock = this;

    clock.scheduleTimerEvent({
      registeredAt: this._now,
      scheduleAfter: this._now + (ms || 0),
      callback,
    });
    // if (!this._clockTimer) {
    //   this._clockTimer = this._timers.setTimeout(() => {
    //     // console.log('Clock#setTimeout triggered - ENQUEUE A NEW TIMER EVENT!');
    //     // clock.tick(Date.now() - registerNow);
    //   }, ms);
    // }
    this._setTimeout(() => {
      console.log(
        'TRIGGER Clock#setTimeout - ENQUEUE A NEW TIMER EVENT! - now: %o',
        Date.now(),
      );
      // const elapsed = 0;
      // clock.tick(elapsed);
    }, ms);

    // return this._clockTimer;
  }

  /**
   * Advance the clock by ms milliseconds and execute any scheduled timer events
   *
   * @param ms - the number of milliseconds to advance the clock
   * @returns the advanced time of the clock in milliseconds
   */
  tick(ms: number): number {
    if (this._stoppedAt || this._startedAt === undefined) {
      throw new ClockError('cannot tick a stopped clock');
    }
    const tickNow = this._now + ms;
    if (tickNow < 0) {
      throw new ClockError('cannot rewind clock before epoch');
    }

    this._now = tickNow;
    this._timerEvents = this._timerEvents.filter((timerEvent) => {
      if (this._now < timerEvent.scheduleAfter) {
        return true;
      }

      timerEvent.callback();
      return false;
    });
    return this._now;
  }

  private scheduleTimerEvent(clockEvent: ClockEvent) {
    this._timerEvents.push(clockEvent);
  }
}

/**
 * Clock event
 */
type ClockEvent = {
  registeredAt: number;
  scheduleAfter: number;
  callback: Function;
};

// export { Clock, ClockEvent, ClockTimerOptions, ClockTimer };
export { Clock, ClockEvent };
