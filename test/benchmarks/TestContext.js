class TestContext {
    constructor() {
        this.log = {};
    }
    start(name) {
        if (!name)
            name = 'total';
        else if (Object.keys(this.log).length === 0) {
            this.start();
        }
        else if (this.log[name])
            console.warn(`restarting ${name}`);
        this.log[name] = {
            start: new Date()
        };
    }
    end(name) {
        if (name) {
            if (!this.log[name].start)
                throw new Error(`invalid argument '${name}'`);
            if (this.log[name].end)
                throw new Error(`invalid argument '${name}'`);
            const now = new Date();
            this.log[name].end = now;
            this.log[name].duration = now - this.log[name].start;
        }
        else {
            for (const key in this.log) {
                if (!this.log[key].end) {
                    this.end(key);
                }
            }
        }
    }
    getDurations() {
        const out = {};
        for (const key in this.log) {
            const log = this.log[key];
            if (log.end) {
                out[key] = log.duration;
            }
        }
        return out;
    }
    finish() {
        this.end();
        return this.getDurations();
    }
}
