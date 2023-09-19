import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { resolveOrigin } from '../../util/misc/resolveOrigin';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';

export class FixedLayout extends LayoutStrategy {
  static readonly type = 'fixed';

  /**
   * @override respect target's initial size
   */
  calcBoundingBox(
    objects: FabricObject[],
    context: StrictLayoutContext
  ): LayoutStrategyResult | undefined {
    const result = super.calcBoundingBox(objects, context);
    if (context.type === 'initialization' && result) {
      const {
        target: { width, height, originX, originY },
      } = context;
      const sizeCorrection = new Point(width, height)
        .multiply(new Point(-resolveOrigin(originX), -resolveOrigin(originY)))
        .transform(context.target.calcOwnMatrix(), true);
      return {
        ...result,
        center: result.center.add(sizeCorrection),
        correction: new Point(result.correction).add(sizeCorrection),
        size: new Point(width || result.size.x, height || result.size.y),
      };
    }
    return result;
  }
}
