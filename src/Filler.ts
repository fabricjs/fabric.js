import { config } from './config';
import { Point } from './point.class';
import { TMat2D, TSize } from './typedefs';
import { pick } from './util/misc/pick';
import { toFixed } from './util/misc/toFixed';

export type TFillerAction = 'stroke' | 'fill';

export type TFillerRenderingOptions = {
  action: TFillerAction;
  size: TSize;
  offset: Point;
  noTransform?: boolean;
};

export type TCanvasFiller = CanvasPattern | CanvasGradient;

export type TFillerExportedKeys = 'offsetX' | 'offsetY';

export type TFillerOptions = {
  action: TFillerAction;
  filler: Filler<TCanvasFiller> | string;
  size: TSize;
};

export type TCanvasFillerOptions = Omit<TFillerOptions, 'action'> & {
  preTransform?: TMat2D;
};

export abstract class Filler<T extends TCanvasFiller> {
  /**
   * horizontal offset from object's left/top corner
   * @type Number
   * @default
   */
  offsetX = 0;

  /**
   * vertical offset from object's left/top corner
   * @type Number
   * @default
   */
  offsetY = 0;

  protected abstract toLive(
    ctx: CanvasRenderingContext2D,
    options: TFillerRenderingOptions
  ): T | null;

  protected prepare(
    ctx: CanvasRenderingContext2D,
    options: TFillerRenderingOptions
  ): Point | void {
    ctx[`${options.action}Style`] = this.toLive(ctx, options) || '';
  }

  toObject(propertiesToInclude?: (keyof this)[]): object {
    return {
      ...pick(this, propertiesToInclude),
      offsetX: toFixed(this.offsetX, config.NUM_FRACTION_DIGITS),
      offsetY: toFixed(this.offsetY, config.NUM_FRACTION_DIGITS),
    };
  }

  toJSON() {
    return this.toObject();
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

  static prepare(
    ctx: CanvasRenderingContext2D,
    { action, filler, size }: TFillerOptions
  ) {
    if (filler instanceof Filler) {
      return filler.prepare(ctx, {
        action,
        size,
        offset: new Point(size.width, size.height)
          .scalarDivide(-2)
          .add(new Point(filler.offsetX, filler.offsetY)),
      });
    } else if (filler) {
      // is a color
      ctx[`${action}Style`] = filler;
    }
  }

  static prepareCanvasFill(
    ctx: CanvasRenderingContext2D,
    { filler, size, preTransform }: TCanvasFillerOptions
  ) {
    // mark area for fill
    Filler.buildPath(ctx, size);
    if (filler instanceof Filler) {
      preTransform && ctx.transform(...preTransform);
      return filler.prepare(ctx, {
        action: 'fill',
        size,
        offset: new Point(filler.offsetX, filler.offsetY),
      });
    } else if (filler) {
      // is a color
      ctx.fillStyle = filler;
    }
  }
}
