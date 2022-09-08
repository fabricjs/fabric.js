import { IPoint, Point } from "./point.class";
import { TSize } from "./typedefs";

export type FillerBBox = IPoint & Partial<TSize>;

export type TFillerAction = 'stroke' | 'fill';

export type FillerRenderingOptions = {
    action: TFillerAction,
    size: TSize,
    offset: Point
};

export type TCanvasFiller = CanvasPattern | CanvasGradient;

export abstract class Filler<T extends TCanvasFiller> {

    /**
     * horizontal offset from object's left/top corner
     * @type Number
     * @default
     */
    offsetX = 0

    /**
     * vertical offset from object's left/top corner
     * @type Number
     * @default
     */
    offsetY = 0

    protected abstract toLive(ctx: CanvasRenderingContext2D, options: FillerRenderingOptions): T | null;

    static buildPath(ctx: CanvasRenderingContext2D, { width, height }: TSize) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
    }

    static prepare<T extends TCanvasFiller>(
        ctx: CanvasRenderingContext2D,
        { action, filler, size }: { action: TFillerAction, filler: Filler<T> | string, size: TSize }
    ) {
        let live: T | string | null = null;
        if (filler instanceof Filler) {
            live = filler.toLive(ctx, {
                action,
                size,
                offset: new Point(size.width, size.height)
                    .scalarDivide(-2)
                    .add(new Point(filler.offsetX, filler.offsetY))
            });
        }
        else if (filler) {
            // is a color
            live = filler;
        }
        ctx[`${action}Style`] = live || '';
    }

    static prepareCanvasFill<T extends TCanvasFiller>(
        ctx: CanvasRenderingContext2D,
        { filler, size }: { filler: Filler<T> | string, size: TSize }
    ) {
        let live: T | string | null = null;
        // mark area for fill
        Filler.buildPath(ctx, size);
        if (filler instanceof Filler) {
            live = filler.toLive(ctx, {
                action: 'fill',
                size,
                offset: new Point(filler.offsetX, filler.offsetY)
            });
        }
        else if (filler) {
            // is a color
            live = filler;
        }
        ctx.fillStyle = live || '';
    }
}