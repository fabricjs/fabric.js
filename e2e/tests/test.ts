/**
 * Runs from the BROWSER
 */

import type { Object as FabricObject } from 'fabric';
import { Canvas } from 'fabric';

const canvasMap = (window.canvasMap = new Map<HTMLCanvasElement, Canvas>());
const objectMap = (window.objectMap = new Map<string, FabricObject>());

const setupTasks: Promise<void>[] = [];
const teardownTasks: Awaited<VoidFunction>[] = [];

window.__setupFabricHook = () => Promise.all(setupTasks);
window.__teardownFabricHook = () =>
  Promise.all(teardownTasks.map((cb) => cb()));

/**
 *
 * @param selector canvas selector
 * @param cb **IMPORTANT** return a map of objects for playwright to access during tests
 * @param options canvas options
 */
export function before(
  selector: string,
  /**
   * @returns a map of objects for playwright to access during tests
   */
  cb: Awaited<(canvas: Canvas) => Record<string, FabricObject>>,
  options?
) {
  const task = Promise.resolve().then(async () => {
    const el = document.querySelector<HTMLCanvasElement>(selector);
    const canvas = new Canvas(el, options);
    canvasMap.set(el, canvas);
    Object.entries((await cb(canvas)) || {}).forEach(([key, value]) => {
      if (objectMap.has(key)) {
        throw new Error(
          `Object identifiers must be unique: ${key} is already defined`
        );
      }
      objectMap.set(key, value);
    });
  });
  setupTasks.push(task);
}

/**
 * Call this method **once** to initialize the default canvas
 *
 * @param cb **IMPORTANT** return a map of objects for playwright to access during tests
 * @param options canvas options
 */
export function beforeAll(
  cb: Awaited<(canvas: Canvas) => Record<string, FabricObject>>,
  options?
) {
  before('#canvas', cb, options);
}

export function after(selector: string, cb: Awaited<(canvas: Canvas) => void>) {
  teardownTasks.push(() => {
    const el = document.querySelector<HTMLCanvasElement>(selector);
    const canvas = canvasMap.get(el);
    return cb(canvas);
  });
}

export function afterAll(cb: Awaited<(canvas: Canvas) => void>) {
  after('#canvas', cb);
}
