
class TestContext {
    constructor() {
        this.log = {};
    }
    start(name) {
        if (!name) name = 'total';
        else if (Object.keys(this.log).length === 0) {
            this.start();
        }
        else if (this.log[name]) console.warn(`restarting ${name}`);
        this.log[name] = {
            start: new Date()
        };
    }
    end(name) {
        if (name) {
            if (!this.log[name].start) throw new Error(`invalid argument '${name}'`);
            if (this.log[name].end) throw new Error(`invalid argument '${name}'`);
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

async function run(runner) {
    const testContext = new TestContext();
    await runner(testContext);
    return testContext.finish();
}

async function test(raphaelContainer, canvasEl) {
    const raphaelResults = await run((testContext) => runRaphael(raphaelContainer, testContext));
    const fabricResults = await run((testContext) => runFabric(canvasEl, testContext));

    function parseResults(res) {
        return Object.keys(res).map(key => `${key}: ${res[key]} ms`).join('<br>');
    }

    document.getElementById('raphael_result').innerHTML = parseResults(raphaelResults)
    document.getElementById('fabric_result').innerHTML = parseResults(fabricResults);

    window.parent.postMessage({
        type: 'test',
        name: 'image replicas',
        fabric: fabricResults,
        raphael: raphaelResults,
        // maxResults: {
        //     total: 40
        // }
    }, '*');
}

const preloaded = [];

function preload(target) {
    preloaded.push(target);
    const children = document.getElementById('preload').children;
    for (let index = 0; index < children.length; index++) {
        if (!preloaded.includes(children[index])) return;
    }
    start();
}

function start() {
    test(document.getElementById('raphael'), document.getElementById('canvas'));
}

window.addEventListener('load', () => {
    const children = document.getElementById('preload').children;
    if (children.length === 0) start();
});