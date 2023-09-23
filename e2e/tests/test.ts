/**
 * Runs from the BROWSER
 */

import type { Object as FabricObject } from 'fabric';
import { Canvas } from 'fabric';
import * as fabric from 'fabric';

const canvasMap = (window.canvasMap = new Map<HTMLCanvasElement, Canvas>());
const objectMap = (window.objectMap = new Map<string, FabricObject>());

type AsyncReturnValue<T> = T | Promise<T>;

const setupTasks: Promise<void>[] = [];
const teardownTasks: Awaited<VoidFunction>[] = [];

// makes possible call things in browser context.
window.fabric = fabric;

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
  cb: (canvas: HTMLCanvasElement) => AsyncReturnValue<{
    canvas: Canvas;
    objects?: Record<string, FabricObject>;
  }>
) {
  const task = Promise.resolve().then(async () => {
    const el = document.querySelector<HTMLCanvasElement>(selector);
    const { canvas, objects = {} } = await cb(el);
    canvasMap.set(el, canvas);
    Object.entries(objects).forEach(([key, value]) => {
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
  cb: (canvas: Canvas) => AsyncReturnValue<Record<string, FabricObject> | void>,
  options?
) {
  before('#canvas', async (el) => {
    const canvas = new Canvas(el, options);
    const objects = (await cb(canvas)) || {};
    return { canvas, objects };
  });
}

export function after(
  selector: string,
  cb: (canvas: Canvas) => AsyncReturnValue<void>
) {
  teardownTasks.push(() => {
    const el = document.querySelector<HTMLCanvasElement>(selector);
    const canvas = canvasMap.get(el);
    return cb(canvas);
  });
}

export function afterAll(cb: (canvas: Canvas) => AsyncReturnValue<void>) {
  after('#canvas', cb);
}
