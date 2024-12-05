import type { JpegConfig, PngConfig } from 'canvas';
import { Canvas as CanvasBase, StaticCanvas as StaticCanvasBase } from './fabric';
export * from './fabric';
export declare class StaticCanvas extends StaticCanvasBase {
    getNodeCanvas(): NodeCanvas;
    createPNGStream(opts?: PngConfig): any;
    createJPEGStream(opts?: JpegConfig): any;
}
/**
 * **NOTICE**:
 * {@link Canvas} is designed for interactivity.
 * Therefore, using it in node has no benefit.
 * Use {@link StaticCanvas} instead.
 */
export declare class Canvas extends CanvasBase {
    getNodeCanvas(): NodeCanvas;
    createPNGStream(opts?: PngConfig): any;
    createJPEGStream(opts?: JpegConfig): any;
}
//# sourceMappingURL=index.node.d.ts.map