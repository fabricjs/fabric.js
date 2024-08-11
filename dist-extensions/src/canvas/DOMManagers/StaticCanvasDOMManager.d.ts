import type { TSize } from '../../typedefs';
import type { CSSDimensions } from './util';
export type CanvasItem = {
    el: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
};
export declare class StaticCanvasDOMManager {
    /**
     * Keeps a copy of the canvas style before setting retina scaling and other potions
     * in order to return it to original state on dispose
     * @type string
     */
    private _originalCanvasStyle?;
    lower: CanvasItem;
    constructor(arg0?: string | HTMLCanvasElement);
    protected createLowerCanvas(arg0?: HTMLCanvasElement | string): HTMLCanvasElement;
    cleanupDOM({ width, height }: TSize): void;
    setDimensions(size: TSize, retinaScaling: number): void;
    setCSSDimensions(size: Partial<CSSDimensions>): void;
    /**
     * Calculates canvas element offset relative to the document
     */
    calcOffset(): {
        left: number;
        top: number;
    };
    dispose(): void;
}
//# sourceMappingURL=StaticCanvasDOMManager.d.ts.map