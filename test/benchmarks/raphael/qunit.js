window.addEventListener('message', e => {
    if (e.data.type === 'test') {
        const { name, fabric: fabricResult, raphael: raphaelResult, maxResults } = e.data;
        QUnit.module(`benchmarks / fabric vs. Raphael / ${name}`);
        for (const key in fabricResult) {
            const f = fabricResult[key];
            const r = raphaelResult[key];
            if (f && r) {
                QUnit[f < r ? 'test' : 'todo'](key, assert => {
                    assert.ok(f <= r, `fabric (${f} ms) vs. Raphael (${r} ms) => Raphael won`);
                });
            }
            if (maxResults && maxResults[key]) {
                QUnit.test(`${name} ${key} limit`, assert => {
                    assert.ok(f <= maxResults[key], `fabric took too long to complete (${f} ms, should be less than ${maxResults[key]} ms)`)
                });
            }
        }

    }
})