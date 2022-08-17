window.addEventListener('message', e => {
    if (e.data.type === 'test') {
        const { name, fabric: fabricResult, raphael: raphaelResult, maxResult } = e.data;
        QUnit.module('fabric vs. Raphael benchmarks');
        console.log(fabricResult, raphaelResult)
        QUnit[fabricResult < raphaelResult ? 'test' : 'todo'](name, assert => {
            assert.ok(fabricResult <= raphaelResult, `fabric (${fabricResult} ms) vs. Raphael (${raphaelResult} ms) => Raphael won`);
        });
        QUnit.test(`${name} time`, assert => {
            assert.ok(fabricResult <= maxResult, `fabric took too long to complete (${fabricResult} ms, should be less than ${maxResult} ms)`)
        })
    }
})