import { IPoint, Point } from "./point.class";
import { TSize } from "./typedefs";
import { TObject } from "./__types__";

export type FillerBBox = IPoint & Partial<TSize>;

export type FillerRenderingOptions = { object?: TObject, size?: TSize, offset?: Point };

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

    protected abstract transform(ctx: CanvasRenderingContext2D, live: T, bbox: FillerBBox): void;

    static buildPath(ctx: CanvasRenderingContext2D, { width, height }: TSize) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
    }

    /**
     * 
     * @param action 
     * @param ctx 
     * @param size 
     * @returns calculated offset
     */
    protected prepare(action: 'stroke' | 'fill', ctx: CanvasRenderingContext2D, { object, size, offset }: FillerRenderingOptions = {}) {
        offset = (offset || new Point()).add(new Point(this.offsetX, this.offsetY));
        const live = this.toLive(ctx, { object, size, offset });
        live && this.transform(ctx, live, {
            ...size,
            ...offset
        });
        ctx[`${action}Style`] = live || '';
        return offset;
    }

    // protected render(action: 'stroke' | 'fill', ctx: CanvasRenderingContext2D, options: FillerRenderingOptions = {}) {
    //     ctx.save();
    //     const offset = this.prepare(action, ctx, options);
    //     ctx[action]();
    //     ctx.restore();
    //     return offset;
    // }

    // fill(ctx: CanvasRenderingContext2D, options?: FillerRenderingOptions) {
    //     return this.render('fill', ctx, options);
    // }

    // stroke(ctx: CanvasRenderingContext2D, options?: FillerRenderingOptions) {
    //     return this.render('stroke', ctx, options);
    // }

    static prepare(action: 'stroke' | 'fill', ctx: CanvasRenderingContext2D, object: TObject) {
        const filler = object[action];
        if (filler instanceof Filler) {
            const { width, height } = object;
            return filler.prepare(action, ctx, {
                object,
                size: {
                    width,
                    height
                },
                offset: new Point(width, height).scalarDivide(-2)
            });
        }
        else if (filler) {
            // is a color
            ctx[`${action}Style`] = filler;
            return new Point();
        }
    }

    static prepareFill(ctx: CanvasRenderingContext2D, object: TObject) {
        return Filler.prepare('fill', ctx, object);
    }

    static prepareStroke(ctx: CanvasRenderingContext2D, object: TObject) {
        return Filler.prepare('stroke', ctx, object);
    }

    static prepareCanvasFill<T extends TCanvasFiller>(ctx: CanvasRenderingContext2D, filler: Filler<T> | string, size: TSize) {
        // mark area for fill
        Filler.buildPath(ctx, size);
        if (filler instanceof Filler) {
            filler.prepare('fill', ctx, { size, offset: new Point() });
        }
        else if (filler) {
            // is a color
            ctx.fillStyle = filler;
        }
    }
}