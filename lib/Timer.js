class Timer
{
    constructor(callback, interval_ms, resolution_ms=1000)
    {
        this.callback = callback;
        this.interval_ms = interval_ms;

        this.running = true;
        this.last_update = Date.now()-1000000000000000;

        setTimeout(() => {
            this._update();
        }, resolution_ms);

        this._update();

    }

    _update()
    {
        if (!this.running)
            return;

        let now = Date.now();

        if (now - this.last_update >= this.interval_ms)
        {
            this.callback();
            this.last_update = now;
        }

        setTimeout(() => {
            this._update();
        }, 1000);
    }

    get time_remaining()
    {
        return this.interval_ms - (Date.now() - this.last_update);
    }
}

module.exports = Timer;