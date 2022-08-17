
QUnit.config.autostart = false;

const cb = e => {
    if (e.data.type === 'test') {
        QUnit.start();
        const { fabric: fabricResult, raphael: raphaelResult, maxResults } = e.data;
        for (const key in fabricResult) {
            const f = fabricResult[key];
            const r = raphaelResult[key];
            if (f && r) {
                QUnit[f < r ? 'test' : 'todo'](key, assert => {
                    assert.ok(f <= r, `fabric (${f} ms) vs. Raphael (${r} ms) => Raphael won`);
                });
            }
            if (maxResults && maxResults[key]) {
                QUnit.test(`${key} limit`, assert => {
                    assert.ok(f <= maxResults[key], `fabric took too long to complete (${f} ms, should be less than ${maxResults[key]} ms)`)
                });
            }
        }
        window.removeEventListener('message', cb);
    }
}

window.addEventListener('message', cb);