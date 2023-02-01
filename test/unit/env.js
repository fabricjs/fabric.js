QUnit.module('env', (hooks) => {
    (fabric.getEnv().isLikelyNode ? QUnit.module : QUnit.module.skip)('node', (hooks) => {
        hooks.afterEach(() => {
            delete global.window;
            delete global.document;
        })

        QUnit.test('require sets env', async assert => {
            const done = assert.async();
            global.window = { devicePixelRatio: 1.25 };
            global.document = { foo: 'bar' };
            const fabric = require('../..');
            assert.equal(fabric.getEnv().isLikelyNode, true, 'should be node env');
            done();
        });

        QUnit.test('SSR: importing fabric before window/document are defined', async assert => {
            const done = assert.async();
            const fabric = require('../../dist/fabric.cjs');
            assert.notOk(global.window, 'no window');
            assert.notOk(global.document, 'no document');
            global.window = { devicePixelRatio: 1.25 };
            global.document = { foo: 'bar' };
            assert.deepEqual(fabric.getEnv(), {
                document: { foo: 'bar' },
                window: { devicePixelRatio: 1.25 },
                isTouchSupported: undefined,
                isLikelyNode: false,
                copyPasteData: {}
            }, 'env should match');
            done();
        });

        QUnit.test('tree shaking', async assert => {
            const done = assert.async();
            const { execSync } = await import('child_process');
            const { readFileSync } = await import('fs');
            const external = [
                'jsdom',
                'jsdom/lib/jsdom/living/generated/utils.js',
                'jsdom/lib/jsdom/utils.js',
                'canvas',
            ];
            const output = 'cli_output/test_results/treeShakingOutput.mjs';
            const diffOutput = 'cli_output/test_results/treeShakingDiff.txt';
            execSync(`rollup --format=es --file ${output} --external ${external.join(',')} -- test/fixtures/treeShaking.mjs`, { stdio: 'ignore' });
            try {
                execSync(`git diff --no-index -w -b --output ${diffOutput} -- test/fixtures/treeShakingOutput.mjs ${output}`, { stdio: 'ignore' });
            } catch (error) { }
            assert.equal(readFileSync(diffOutput).toString(), '', 'bundle should match, diff should be empty');
            done();
        });
    });
});