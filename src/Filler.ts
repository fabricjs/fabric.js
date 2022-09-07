import { IPoint, Point } from "./point.class";
import { TSize } from "./typedefs";
import { TObject } from "./__types__";

export type FillerBBox = IPoint & Partial<TSize>;

export type FillerRenderingOptions = { object?: TObject, size?: TSize, dryRun?: boolean };

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

    protected abstract toLive(ctx: CanvasRenderingContext2D, object: TObject): T | null;

    protected abstract transform(ctx: CanvasRenderingContext2D, live: T, bbox: FillerBBox): void;

    protected calcOffset(size?: TSize) {
        return new Point(size?.width, size?.height).scalarDivide(-2)
            .add(new Point(this.offsetX, this.offsetY));
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

    /**
     * 
     * @param action 
     * @param ctx 
     * @param size 
     * @returns calculated offset
     */
    protected render(action: 'stroke' | 'fill', ctx: CanvasRenderingContext2D, { object, size, dryRun }: FillerRenderingOptions) {
        if (!dryRun) {
            ctx.save();
        }
        const offset = this.calcOffset(size);
        const live = this.toLive(ctx, object);
        live && this.transform(ctx, live, {
            ...size,
            ...offset
        });
        ctx[`${action}Style`] = live || '';
        if (!dryRun) {
            ctx[action]();
            ctx.restore();
        }
        return offset;
    }

    fill(ctx: CanvasRenderingContext2D, options: FillerRenderingOptions) {
        return this.render('fill', ctx, options);
    }

    stroke(ctx: CanvasRenderingContext2D, options: FillerRenderingOptions) {
        return this.render('stroke', ctx, options);
    }

    static prepare(action: 'stroke' | 'fill', ctx: CanvasRenderingContext2D, object: TObject) {
        const filler = object[action];
        if (filler instanceof Filler) {
            return filler.render(action, ctx, {
                object,
                size: {
                    width: object.width,
                    height: object.height
                },
                dryRun: true
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

    static prepareCanvasFill<T extends TCanvasFiller>(ctx: CanvasRenderingContext2D, filler: Filler<T> | string) {
        if (filler instanceof Filler) {
            filler.fill(ctx, {
                dryRun: true
            });
        }
        else if (filler) {
            // is a color
            ctx.fillStyle = filler;
        }
    }
}