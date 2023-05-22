import { config } from '../config';
import type { Point } from '../Point';
import type { TSize } from '../typedefs';
import { pick } from '../util/misc/pick';
import { toFixed } from '../util/misc/toFixed';

export type TFillerAction = 'stroke' | 'fill';

export type TFillerRenderingOptions = {
  action: TFillerAction;
  size: TSize;
  offset: Point;
  noTransform?: boolean;
};

export abstract class Filler<T extends CanvasPattern | CanvasGradient> {
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

  toObject<T extends keyof this>(propertiesToInclude?: T[]) {
    return {
      ...pick(this, propertiesToInclude),
      offsetX: toFixed(this.offsetX, config.NUM_FRACTION_DIGITS),
      offsetY: toFixed(this.offsetY, config.NUM_FRACTION_DIGITS),
    };
  }

  toJSON() {
    return this.toObject();
  }
}
