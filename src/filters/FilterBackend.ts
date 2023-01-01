import { config } from '../config';
import { Canvas2dFilterBackend } from './2d_backend.class';
import { WebGLFilterBackend } from './webgl_backend.class';
import { webGLProbe } from './WebGLProbe';

export type FilterBackend = WebGLFilterBackend | Canvas2dFilterBackend;

export function initFilterBackend(): FilterBackend {
  webGLProbe.queryWebGL();
  if (config.enableGLFiltering && webGLProbe.isSupported(config.textureSize)) {
    return new WebGLFilterBackend({ tileSize: config.textureSize });
  } else {
    return new Canvas2dFilterBackend();
  }
}

let filterBackend: FilterBackend;

export function getFilterBackend(): FilterBackend {
  if (!filterBackend) {
    filterBackend = initFilterBackend();
  }
  return filterBackend;
}
