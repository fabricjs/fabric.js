import { Canvas2dFilterBackend } from './2d_backend.class';
import { WebGLFilterBackend } from './webgl_backend.class';
export type FilterBackend = WebGLFilterBackend | Canvas2dFilterBackend;
export declare function initFilterBackend(): FilterBackend;
/**
 * @todo refactor to a module w/o assigning to fabric
 */
export declare function getFilterBackend(): FilterBackend;
//# sourceMappingURL=FilterBackend.d.ts.map