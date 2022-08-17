
const url = '/pug';
const numObjects = 20,
    width = 500,
    height = 500,
    opacity = 0.75;

function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

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
    const testContext = new TestContext()
    await runner(testContext);
    return testContext.finish();
}

function runRaphael(container, testContext) {
    testContext.start('initialization');
    const paper = Raphael(container, width, height);
    testContext.end('initialization');
    testContext.start('rendering');
    for (let i = numObjects, img; i--;) {
        img = paper.image(url, getRandomNum(-25, width), getRandomNum(-25, height), 100, 100);
        img.rotate(getRandomNum(0, 90));
        img.attr('opacity', opacity);
    }
    testContext.end();
}

async function runFabric(canvasEl, testContext) {
    testContext.start('initialization');
    const canvas = new fabric.Canvas(canvasEl, {
        renderOnAddRemove: false,
        stateful: false
    });
    testContext.end('initialization');
    testContext.start('rendering');
    const tasks = [];
    for (let i = numObjects; i--;) {
        tasks.push(fabric.Image.fromURL(url)
            .then((img) => {
                img.set({
                    left: getRandomNum(-25, width),
                    top: getRandomNum(-25, height),
                    opacity,
                    transparentCorners: true
                });
                img.scale(0.2);
                img.rotate(getRandomNum(0, 90));
                img.setCoords();
                canvas.add(img);
            }));
    }

    await Promise.all(tasks);
    canvas.calcOffset();
    canvas.renderAll();
    testContext.end('rendering');
    testContext.end();
}


async function test(raphaelContainer, canvasEl) {
    const raphaelResult = await run((testContext) => runRaphael(raphaelContainer, testContext));
    const fabricResult = await run((testContext) => runFabric(canvasEl, testContext));

    document.getElementById('raphael_result').innerHTML = raphaelResult;
    document.getElementById('fabric_result').innerHTML = fabricResult;

    window.parent.postMessage({
        type: 'test',
        name: 'image replicas',
        fabric: fabricResult,
        raphael: raphaelResult,
        maxResults: {
            total: 40
        }
    }, '*');
}

function start() {
    test(document.getElementById('raphael'), document.getElementById('canvas'));
}