import { describe, expect, it, afterEach } from 'vitest';

describe('env', () => {
  afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
  });
  it('import/require of `main` field of package.json throws', async () => {
    expect(import('../..'), 'should not resolve main').rejects.toBe(1);
    expect(() => require('../..'), 'should not resolve main').toThrow();
  });

  it('import/require sets env', async () => {
    globalThis.window = { devicePixelRatio: 1.25 };
    globalThis.document = { foo: 'bar' };
    const imported = await import('../../index.node');
    const required = require('../../index.node');
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
    expect(globalThis.window, 'no window').toBeFalsy();
    expect(globalThis.document, 'no document').toBeFalsy();
    const win = { devicePixelRatio: 1.25 };
    const doc = { foo: 'bar' };
    globalThis.window = win;
    globalThis.document = doc;
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
