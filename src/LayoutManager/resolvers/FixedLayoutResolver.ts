import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { LayoutContext, LayoutStrategyResult } from '../types';
import { LayoutResolver } from './LayoutResolver';

export class FixedLayoutResolver extends LayoutResolver {
  public calcLayoutResult(
    target: Group,
    objects: FabricObject[],
    context: LayoutContext
  ): LayoutStrategyResult | undefined {
    if (context.type === 'initialization' || context.type === 'imperative') {
      return this.calcBoundingBox(target, objects, context);
    }
  }
}
