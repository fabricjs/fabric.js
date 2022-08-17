
const UPPER = 100;

QUnit.module(`benchmarks / Quantity`);
QUnit.test('benchmark', assert => {
    const done = assert.async();
    window.addEventListener('message', e => {
        if (e.data.type === 'test') {
            const { results: { total } } = e.data;
            assert.ok(total < UPPER, `${total} ms is above upper boundary (${UPPER} ms)`);
            done();
        }
    }, { once: true });
})

