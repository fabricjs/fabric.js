/**
 * Runs from the BROWSER context
 */

import type { Object as FabricObject } from 'fabric';
import { Canvas } from 'fabric';

type Targets = Record<string, FabricObject>;

/**
 * Call this method **once**
 */
export async function beforeAll(
  cb: (canvas: Canvas) => Targets | Promise<Targets> | void,
  options?
) {
  const canvas = new Canvas(document.getElementById('canvas'), options);
  window.canvas = canvas;
  window.targets = (await cb(canvas)) || {};
  window.dispatchEvent(new CustomEvent('setup:completed'));
}

/**
 * Call this method **once**
 */
export async function afterAll(cb: (canvas: Canvas) => void | Promise<void>) {
  window.__teardown = async () => {
    await cb(window.canvas);
    window.dispatchEvent(new CustomEvent('teardown:completed'));
  };
}
