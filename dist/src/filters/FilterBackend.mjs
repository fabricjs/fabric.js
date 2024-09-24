import { config } from '../config.mjs';
import { getEnv } from '../env/index.mjs';
import { createCanvasElement } from '../util/misc/dom.mjs';
import { Canvas2dFilterBackend } from './Canvas2dFilterBackend.mjs';
import { WebGLFilterBackend } from './WebGLFilterBackend.mjs';

let filterBackend;

/**
 * Verifies if it is possible to initialize webgl or fallback on a canvas2d filtering backend
 */
function initFilterBackend() {
  const {
    WebGLProbe
  } = getEnv();
  WebGLProbe.queryWebGL(createCanvasElement());
  if (config.enableGLFiltering && WebGLProbe.isSupported(config.textureSize)) {
    return new WebGLFilterBackend({
      tileSize: config.textureSize
    });
  } else {
    return new Canvas2dFilterBackend();
  }
}

/**
 * Get the current fabricJS filter backend  or initialize one if not available yet
 * @param [strict] pass `true` to create the backend if it wasn't created yet (default behavior),
 * pass `false` to get the backend ref without mutating it
 */
function getFilterBackend() {
  let strict = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  if (!filterBackend && strict) {
    filterBackend = initFilterBackend();
  }
  return filterBackend;
}
function setFilterBackend(backend) {
  filterBackend = backend;
}

export { getFilterBackend, initFilterBackend, setFilterBackend };
//# sourceMappingURL=FilterBackend.mjs.map
