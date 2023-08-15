import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { LayoutResolverResult, StrictLayoutContext } from '../types';
import { LayoutResolver } from './LayoutResolver';

export class FitContentLayoutResolver extends LayoutResolver {
  lazy = true;

  calcLayoutResult(
    target: Group,
    objects: FabricObject[],
    context: StrictLayoutContext
  ): LayoutResolverResult | undefined {
    const targetsToMeasure =
      this.lazy &&
      context.type === 'added' &&
      objects.length > context.targets.length
        ? [...context.targets, target]
        : objects;
    return this.calcBoundingBox(target, targetsToMeasure, context);
  }
}
