// @flow

import { delay } from './helper_funcs';

import {LinkedQueue} from './LinkedQueue';

/* This builds on LinkedQueue, automatically calling a callback function
 * with inputted elements with a 'cooldown' between each call.
 *
 * I am using this because Twitch chat has a rate limit; if messages are sent too often,
 * then the program will be blocked from Twitch's servers. */

export class IntervalQueue {
  intervalDuration: number;
  onProcess: any => void;
  queue: LinkedQueue;
  ready: boolean;

  constructor(onProcess: any => void = () => {}, intervalDuration: number = 1000) {
    this.intervalDuration = intervalDuration;
    this.onProcess = onProcess;
    this.queue = new LinkedQueue('');
    this.ready = true;
  }

  put(item) {
    this.queue.put(item);
    this.check();
  }

  check() {
    if (this.ready && !this.queue.isEmpty()) this.process(this.queue.pop());
  }

  process(item) {
    this.ready = false;
    this.onProcess(item);
    delay(this.intervalDuration).then(() => {
      this.ready = true;
      this.check();
    });
  }
}
