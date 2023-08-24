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
      return this.getLazyBoundingBox(context.target, context.targets);
    }

    return this.calcBoundingBox(objects, context);
  }

  getLazyBoundingBox(
    target: Group,
    objects: FabricObject[],
    ignoreOffset?: boolean
  ): LayoutStrategyResult | undefined {
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
