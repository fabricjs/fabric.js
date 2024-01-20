import { config } from '../config';
import { getEnv } from '../env';
import { createCanvasElement } from '../util/misc/dom';
import { Canvas2dFilterBackend } from './Canvas2dFilterBackend';
import { WebGLFilterBackend } from './WebGLFilterBackend';

export type FilterBackend = WebGLFilterBackend | Canvas2dFilterBackend;

let filterBackend: FilterBackend;

/**
 * Verifies if it is possible to initialize webgl or fallback on a canvas2d filtering backend
 */
export function initFilterBackend(): FilterBackend {
  const { WebGLProbe } = getEnv();
  WebGLProbe.queryWebGL(createCanvasElement());
  if (config.enableGLFiltering && WebGLProbe.isSupported(config.textureSize)) {
    return new WebGLFilterBackend({ tileSize: config.textureSize });
  } else {
    return new Canvas2dFilterBackend();
  }
}

/**
 * Get the current fabricJS filter backend  or initialize one if not available yet
 * @param [strict] pass `true` to create the backend if it wasn't created yet (default behavior),
 * pass `false` to get the backend ref without mutating it
 */
export function getFilterBackend(strict = true): FilterBackend {
  if (!filterBackend && strict) {
    filterBackend = initFilterBackend();
  }
  return filterBackend;
}

export function setFilterBackend(backend: FilterBackend) {
  filterBackend = backend;
}
