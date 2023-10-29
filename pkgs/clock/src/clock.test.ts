import { expect, test, vi } from 'vitest';

import { ClockError } from './error';
// import { Clock, ClockTimer } from './clock';
import { Clock } from './clock';

// test('can start the clock and get the current relative time in ms', () => {
//   const mockClock = new Clock();
//
//   mockClock.start();
//   expect(mockClock.now()).toEqual(0);
// });
//
// test('can advance and rewind the clock', () => {
//   const mockClock = new Clock();
//   mockClock.start();
//
//   mockClock.tick(1);
//   expect(mockClock.now()).toEqual(1);
//
//   mockClock.tick(-1);
//   expect(mockClock.now()).toEqual(0);
// });
//
// test('raises an error when attempting to rewind before the epoch', () => {
//   const mockClock = new Clock();
//   mockClock.start();
//
//   expect(() => {
//     mockClock.tick(-1);
//   }).toThrowError(new ClockError('cannot rewind clock before epoch'));
// });
//
// test('raises an error when attempting to tick a stopped clock', () => {
//   const mockClock = new Clock();
//
//   expect(() => {
//     mockClock.tick(1);
//   }).toThrowError(new ClockError('cannot tick a stopped clock'));
//
//   mockClock.start();
//   expect(() => {
//     mockClock.tick(1);
//   }).not.toThrowError();
//
//   mockClock.stop();
//   expect(() => {
//     mockClock.tick(1);
//   }).toThrowError(new ClockError('cannot tick a stopped clock'));
// });

test('executes registered timeout callbacks when the schedule elapses', () => {
  var capturedCallback;
  const trigger = () => {
    capturedCallback();
  };
  // const timer = (callback, _ms) => {
  const timer = (callback, _ms) => {
    console.log('CALL setTimeout within mockClock instance');
    // trigger(callback)
    capturedCallback = callback;
  };
  const mockClock = new Clock({ setTimeout: timer });
  console.log('AFTER instantiate mockClock');
  const timerCallback = vi.fn();
  mockClock.setTimeout(timerCallback, 1000);
  console.log('AFTER mockClock.setTimeout');

  mockClock.start();
  console.log('AFTER mockClock.start');
  expect(timerCallback).toHaveBeenCalledTimes(0);

  // mockClock.tick(1000);
  console.log('BEFORE trigger');
  trigger();
  console.log('AFTER trigger');
  expect(timerCallback).toHaveBeenCalledTimes(1);
});

// test('executes registered timeout callbacks when the schedule elapses', () => {
//   // const clockTimer = new ClockTimer();
//   // const mockClock = new Clock(clockTimer);
//   const mockClock = new Clock();
//
//   const timerCallback = vi.fn();
//   mockClock.setTimeout(timerCallback, 1000);
//
//   mockClock.start();
//   expect(timerCallback).toHaveBeenCalledTimes(0);
//
//   mockClock.tick(999);
//   expect(timerCallback).toHaveBeenCalledTimes(0);
//
//   mockClock.tick(1);
//   expect(timerCallback).toHaveBeenCalledTimes(1);
// });

// test('injected timer advances the clock when executed', () => {
//   const clockTimer = new ClockTimer();
//   vi.spyOn(clockTimer, 'setTimeout').mockImplementation((clock, ms) => {
//     clock.tick(ms);
//   });
//   const mockSetTimeout = vi.fn(setTimeout);
//   // const mockClock = new Clock(clockTimer);
//   const mockClock = new Clock();
//
//   const timerCallback = vi.fn();
//   mockClock.setTimeout(timerCallback, 1000);
//
//   mockClock.start();
//   expect(timerCallback).toHaveBeenCalledTimes(0);
//
//   clockTimer.setTimeout(mockClock, 999);
//   expect(timerCallback).toHaveBeenCalledTimes(0);
//
//   clockTimer.setTimeout(mockClock, 1);
//   expect(timerCallback).toHaveBeenCalledTimes(1);
// });
