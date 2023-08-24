import type { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';
import { getObjectBounds, getObjectSizeVector } from './utils';

export class FitContentLayout extends LayoutStrategy {
  /**
   * optimize layout when possible
   */
  optimized = true;

  /**
   * skip `object_modifying` triggers
   */
  lazy = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldPerformLayout(context: StrictLayoutContext) {
    return true;
  }

  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutStrategyResult | undefined {
    if (!this.shouldPerformLayout(context)) {
      return;
    }
    if (
      this.optimized &&
      context.type === 'added' &&
      objects.length > context.targets.length
    ) {
      const sizeVector = getObjectSizeVector(context.target);
      return this.getLazyBoundingBox(context.target, context.targets, [
        sizeVector,
        sizeVector.scalarMultiply(-1),
      ]);
    } else if (this.lazy && context.type === 'object_modifying') {
      return;
    }
    return this.calcBoundingBox(objects, context);
  }

  getLazyBoundingBox(
    target: Group,
    objects: FabricObject[],
    caches: Point[],
    ignoreOffset?: boolean
  ): LayoutStrategyResult | undefined {
    if (objects.length === 0) {
      return;
    }
    const bbox = makeBoundingBoxFromPoints(
      objects.reduce(
        (bounds, object) => {
          bounds.push(...getObjectBounds(object));
          return bounds;
        },
        [...caches]
      )
    );
    return this.getBoundingBoxResult(target, bbox, ignoreOffset);
  }
}
