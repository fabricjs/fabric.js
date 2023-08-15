import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { LayoutResolverResult, StrictLayoutContext } from '../types';
import { LayoutResolver } from './LayoutResolver';

export class FixedLayoutResolver extends LayoutResolver {
  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutResolverResult | undefined {
    if (context.type === 'initialization' || context.type === 'imperative') {
      return this.calcBoundingBox(objects, context);
    }
  }
}
