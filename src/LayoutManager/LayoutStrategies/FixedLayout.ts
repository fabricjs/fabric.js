import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';

export class FixedLayout extends LayoutStrategy {
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
        width: width || result.width,
        height: height || result.height,
      };
    }
    return result;
  }
}
