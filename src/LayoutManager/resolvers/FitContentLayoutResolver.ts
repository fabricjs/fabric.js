import type { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { makeBoundingBoxFromPoints } from '../../util';
import type { LayoutResolverResult, StrictLayoutContext } from '../types';
import {
  LayoutResolver,
  getObjectBounds,
  getObjectSizeVector,
} from './LayoutResolver';

export class FitContentLayoutResolver extends LayoutResolver {
  /**
   * optimize layout when possible
   */
  lazy = true;

  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutResolverResult | undefined {
    if (
      this.lazy &&
      context.type === 'added' &&
      objects.length > context.targets.length
    ) {
      return this.getLazyBoundingBox(context.target, context.targets);
    }

    return this.calcBoundingBox(objects, context);
  }

  getLazyBoundingBox(
    target: Group,
    objects: FabricObject[],
    ignoreOffset?: boolean
  ): LayoutResolverResult | undefined {
    if (objects.length === 0) {
      return;
    }
    const sizeVector = getObjectSizeVector(target);
    const bbox = makeBoundingBoxFromPoints(
      objects.reduce(
        (bounds, object) => {
          bounds.push(...getObjectBounds(object));
          return bounds;
        },
        [sizeVector, sizeVector.scalarMultiply(-1)] as Point[]
      )
    );
    return this.getBoundingBoxResult(target, bbox, ignoreOffset);
  }
}
