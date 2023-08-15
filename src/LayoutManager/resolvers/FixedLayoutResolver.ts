import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { LayoutResolverResult, StrictLayoutContext } from '../types';
import { LayoutResolver } from './LayoutResolver';

export class FixedLayoutResolver extends LayoutResolver {
  public calcLayoutResult(
    target: Group,
    objects: FabricObject[],
    context: StrictLayoutContext
  ): LayoutResolverResult | undefined {
    if (context.type === 'initialization' || context.type === 'imperative') {
      return this.calcBoundingBox(target, objects, context);
    }
  }
}
