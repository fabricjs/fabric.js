import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy, shouldPerformLayout } from './LayoutStrategy';

export class FixedLayout extends LayoutStrategy {
  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutStrategyResult | undefined {
    if (shouldPerformLayout(context)) {
      return this.calcBoundingBox(objects, context);
    }
  }
}
