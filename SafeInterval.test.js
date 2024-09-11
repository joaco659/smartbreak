
// archivo de testeo
// no funcionaba el metodo .stop()

class SafeInterval {
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

let i = 0;
const timer = new SafeInterval(() => {
  i++;
  i > 5 ? timer.stop() : console.log(`i ${i}`);
}, 1000);

timer.start();