export default class Timer {
    constructor(time = 0, timeout = 1000) {
        this._isRunning = false;
        this._timer = null;
        this._time = time;
        this._duration = time;
        this._timeout = timeout;
    }

    get time() {
        return this._time;
    }

    get isRunning() {
        return this._isRunning
    }

    set time(newTime) {
        this._time = newTime;
        this._duration = newTime;
    }

    start() {
        this._isRunning = true;
        if (!this._timer) {
            this._timer = setInterval(() => {
                if (this._time > 0) {
                    this._time--;
                } else {
                    this.stop();
                }
            }, this._timeout);
        }
    }

    stop() {
        this._isRunning = false;
        clearInterval(this._timer);
        this._timer = null;
    }

    reset() {
        this.stop();
        this.time = this._duration;
    }
}
