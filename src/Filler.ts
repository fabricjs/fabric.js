import { Point } from "./point.class";
import { TSize } from "./typedefs";

export type TFillerAction = 'stroke' | 'fill';

export type TFillerRenderingOptions = {
    action: TFillerAction,
    size: TSize,
    offset: Point,
    noTransform?: boolean
};

export type TCanvasFiller = CanvasPattern | CanvasGradient;

export type TFillerOptions<T extends TCanvasFiller> = {
    action: TFillerAction,
    filler: Filler<T> | string,
    size: TSize
}


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

    protected abstract toLive(ctx: CanvasRenderingContext2D, options: TFillerRenderingOptions): T | null;

    protected prepare(ctx: CanvasRenderingContext2D, options: TFillerRenderingOptions): Point | void {
        ctx[`${options.action}Style`] = this.toLive(ctx, options) || '';
    }

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
        { action, filler, size }: TFillerOptions<T>
    ) {
        if (filler instanceof Filler) {
            return filler.prepare(ctx, {
                action,
                size,
                offset: new Point(size.width, size.height)
                    .scalarDivide(-2)
                    .add(new Point(filler.offsetX, filler.offsetY))
            });
        }
        else if (filler) {
            // is a color
            ctx[`${action}Style`] = filler;
        }        
    }

    static prepareCanvasFill<T extends TCanvasFiller>(
        ctx: CanvasRenderingContext2D,
        { filler, size }: Omit<TFillerOptions<T>, 'action'>
    ) {
        // mark area for fill
        Filler.buildPath(ctx, size);
        if (filler instanceof Filler) {
            return filler.prepare(ctx, {
                action: 'fill',
                size,
                offset: new Point(filler.offsetX, filler.offsetY),
                noTransform: true
            });
        }
        else if (filler) {
            // is a color
            ctx.fillStyle = filler;
        }
    }
}