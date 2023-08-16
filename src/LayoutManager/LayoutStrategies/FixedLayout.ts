import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';

export class FixedLayout extends LayoutStrategy {
  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutStrategyResult | undefined {
    if (context.type === 'initialization' || context.type === 'imperative') {
      return this.calcBoundingBox(objects, context);
    }
  }
}
