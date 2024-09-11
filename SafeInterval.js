/**
 * Self-adjusting interval to account for drifting
 *
 * @param {function} callback  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds)
 */
export default class SafeInterval {
  constructor(callback, interval) {
    const that = this;
    let expected, timeout, finished;
    this.interval = interval;

    this.start = function () {
      finished = false;
      expected = Date.now() + this.interval;
      timeout = setTimeout(step, this.interval);
    };

    this.stop = function () {
      finished = true;
      clearTimeout(timeout);
    };

    function step() {
      const drift = Date.now() - expected;
      if (drift > that.interval) {
        // Do stuff if the time drifts
      }
      callback();
      if (finished) return;
      expected += that.interval;
      timeout = setTimeout(step, Math.max(0, that.interval - drift));
    }
  }
}
