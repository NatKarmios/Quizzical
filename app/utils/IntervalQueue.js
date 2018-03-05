// @flow

import { delay } from './helperFuncs';

import LinkedQueue from './LinkedQueue';

/* This builds on LinkedQueue, automatically calling a callback function
 * with inputted elements with a 'cooldown' between each call.
 *
 * I am using this because Twitch chat has a rate limit; if messages are sent too often,
 * then the program will be blocked from Twitch's servers. */

export default class IntervalQueue {
  intervalDuration: number;
  onProcess: string => void;
  queue: LinkedQueue<string>;
  ready: boolean;

  constructor(onProcess: string => void = () => {}, intervalDuration: number = 1000) {
    this.intervalDuration = intervalDuration;
    this.onProcess = onProcess;
    this.queue = new LinkedQueue('');
    this.ready = true;
  }

  put(item: string) {
    this.queue.put(item);
    this.check();
  }

  check() {
    if (this.ready && !this.queue.isEmpty()) this.process(this.queue.pop());
  }

  async process(item: string) {
    this.ready = false;
    this.onProcess(item);
    await delay(this.intervalDuration);
    this.ready = true;
    this.check();
  }
}
