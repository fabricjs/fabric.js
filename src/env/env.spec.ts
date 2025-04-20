import { describe, expect, it, afterEach } from 'vitest';

describe('env', () => {
  afterEach(() => {
    delete global.window;
    delete global.document;
  });
  it('import/require of `main` field of package.json throws', async () => {
    expect(import('../..'), 'should not resolve main').rejects.toBe(1);
    expect(() => require('../..'), 'should not resolve main').toThrow();
  });

  it('import/require sets env', async () => {
    global.window = { devicePixelRatio: 1.25 };
    global.document = { foo: 'bar' };
    const imported = await import('../../dist/index.node.cjs');
    const required = require('../../dist/index.node.cjs');
    expect(imported.getEnv().document.foo, 'should be node env').toBe(
      undefined,
    );
    expect(required.getEnv().document.foo, 'should be node env').toBe(
      undefined,
    );
  });

  it('SSR: importing fabric before window/document are defined', async () => {
    const imported = await import('../../dist/index.js');
    const required = require('../../dist/index.js');
    expect(global.window, 'no window').toBeFalsy();
    expect(global.document, 'no document').toBeFalsy();
    const win = { devicePixelRatio: 1.25 };
    const doc = { foo: 'bar' };
    global.window = win;
    global.document = doc;
    [imported, required].forEach((fabric) => {
      expect(fabric.getEnv().window, 'window should match').toBe(win);
      expect(fabric.getEnv().document, 'document should match').toBe(doc);
    });
  });

  // this needs to be reasoned about
  //   (!isNode() ? QUnit.module : QUnit.module.skip)('browser', (hooks) => {
  //     QUnit.test('env', (assert) => {
  //       assert.equal(fabric.getFabricWindow(), window, 'window should be set');
  //       assert.equal(
  //         fabric.getFabricDocument(),
  //         document,
  //         'window should be set',
  //       );
  //     });
  //   });
});
