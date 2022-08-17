
const SAMPLE_NUM = 10;
const MIN_FPS = 55;
const samples = [];

QUnit.module(`benchmarks / Animation`);
QUnit.test('animation fps', assert => {
    const done = assert.async();
    const cb = e => {
        if (e.data.type === 'test') {
            const { value: fps } = e.data;
            assert.ok(fps > MIN_FPS, `fps (${fps}) is below lower boundary (${MIN_FPS})`);
            samples.push(fps);
            if (samples.length === SAMPLE_NUM) {
                window.removeEventListener('message', cb);
                done();
            }
        }
    }
    window.addEventListener('message', cb);
})

