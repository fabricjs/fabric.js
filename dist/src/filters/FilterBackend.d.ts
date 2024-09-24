import { Canvas2dFilterBackend } from './Canvas2dFilterBackend';
import { WebGLFilterBackend } from './WebGLFilterBackend';
export type FilterBackend = WebGLFilterBackend | Canvas2dFilterBackend;
/**
 * Verifies if it is possible to initialize webgl or fallback on a canvas2d filtering backend
 */
export declare function initFilterBackend(): FilterBackend;
/**
 * Get the current fabricJS filter backend  or initialize one if not available yet
 * @param [strict] pass `true` to create the backend if it wasn't created yet (default behavior),
 * pass `false` to get the backend ref without mutating it
 */
export declare function getFilterBackend(strict?: boolean): FilterBackend;
export declare function setFilterBackend(backend: FilterBackend): void;
//# sourceMappingURL=FilterBackend.d.ts.map