import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
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
        target: { width, height },
      } = context;

      return {
        ...result,
        center: result.center.add(
          new Point(width, height).subtract(result.size).scalarDivide(2)
        ),
        size: new Point(width || result.size.x, height || result.size.y),
      };
    }
    return result;
  }
}
