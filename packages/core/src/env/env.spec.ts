import { afterEach, describe, expect, it } from 'vitest';
import { config } from '../config';
import { getDevicePixelRatio, getEnv, setEnv } from '.';
import type { TFabricWindow } from './types';

describe('env', () => {
  afterEach(() => {
    config.restoreDefaults();
  });

  const setDevicePixelRatioEnv = (devicePixelRatio?: number) => {
    const env = getEnv();
    const fabricWindow = Object.create(env.window, {
      devicePixelRatio: {
        configurable: true,
        value: devicePixelRatio,
      },
    }) as TFabricWindow;
    setEnv({ ...env, window: fabricWindow });
    return env;
  };

  it('uses configured device pixel ratio', () => {
    const env = setDevicePixelRatioEnv(2);
    try {
      config.configure({ devicePixelRatio: 3 });

      expect(getDevicePixelRatio()).toBe(3);
    } finally {
      setEnv(env);
    }
  });

  it('falls back to the environment device pixel ratio', () => {
    const env = setDevicePixelRatioEnv(2.5);
    try {
      expect(getDevicePixelRatio()).toBe(2.5);
    } finally {
      setEnv(env);
    }
  });

  it('falls back to 1 without a configured or environment device pixel ratio', () => {
    const env = setDevicePixelRatioEnv();
    try {
      expect(getDevicePixelRatio()).toBe(1);
    } finally {
      setEnv(env);
    }
  });
  // afterEach(() => {
  //   delete globalThis.window;
  //   delete globalThis.document;
  // });
  // it('import/require of `main` field of package.json throws', async () => {
  //   expect(import('../..'), 'should not resolve main').rejects.toBe(1);
  //   expect(() => require('../..'), 'should not resolve main').toThrow();
  // });
  // it('import/require sets env', async () => {
  //   globalThis.window = { devicePixelRatio: 1.25 };
  //   globalThis.document = { foo: 'bar' };
  //   const imported = await import('../../../../index.node');
  //   const required = require('../../../../index.node');
  //   expect(imported.getEnv().document.foo, 'should be node env').toBe(
  //     undefined,
  //   );
  //   expect(required.getEnv().document.foo, 'should be node env').toBe(
  //     undefined,
  //   );
  // });
  // it('SSR: importing fabric before window/document are defined', async () => {
  //   const imported = await import('../../dist/index.js');
  //   const required = require('../../dist/index.js');
  //   expect(globalThis.window, 'no window').toBeFalsy();
  //   expect(globalThis.document, 'no document').toBeFalsy();
  //   const win = { devicePixelRatio: 1.25 };
  //   const doc = { foo: 'bar' };
  //   globalThis.window = win;
  //   globalThis.document = doc;
  //   [imported, required].forEach((fabric) => {
  //     expect(fabric.getEnv().window, 'window should match').toBe(win);
  //     expect(fabric.getEnv().document, 'document should match').toBe(doc);
  //   });
  // });
  // describe('browser', () => {
  //   it('browser env', () => {
  //     expect(fabric.getFabricWindow(), 'window should be set').toBe(window);
  //     expect(fabric.getFabricDocument(), 'document should be set').toBe(document);
  //   });
  // });
});
