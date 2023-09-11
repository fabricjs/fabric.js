import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import { resolveOrigin } from '../../util/misc/resolveOrigin';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { getObjectBounds } from './utils';

export abstract class LayoutStrategy {
  /**
   * override by subclass for persistence (TS does not support `static abstract`)
   */
  static type = 'strategy';

  shouldPerformLayout(context: StrictLayoutContext) {
    return (
      context.type === 'initialization' ||
      context.type === 'imperative' ||
      context.strategyChange
    );
  }

  shouldLayoutClipPath(context: StrictLayoutContext) {
    return context.type !== 'initialization';
  }

  /**
   * called from the `onAfterLayout` hook
   */
  shouldResetTransform(context: StrictLayoutContext) {
    return context.target.size() === 0;
  }

  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutStrategyResult | undefined {
    if (this.shouldPerformLayout(context)) {
      return this.calcBoundingBox(objects, context);
    }
  }

  /**
   * Override this method to customize layout.
   */
  calcBoundingBox(
    objects: FabricObject[],
    context: StrictLayoutContext
  ): LayoutStrategyResult | undefined {
    if (context.type === 'imperative' && context.overrides) {
      return context.overrides;
    }
    if (objects.length === 0) {
      return;
    }
    const { target } = context;
    const { left, top, width, height } = makeBoundingBoxFromPoints(
      objects.map((object) => getObjectBounds(target, object)).flat()
    );
    const size = new Point(width, height);
    const bboxCenter = new Point(left, top).add(size.scalarDivide(2));
    if (context.type === 'initialization') {
      // translate the layout origin from left top to target's origin
      const origin = bboxCenter.add(size.scalarMultiply(-0.5));
      const center = origin.add(
        size.multiply(
          new Point(
            -resolveOrigin(target.originX),
            -resolveOrigin(target.originY)
          )
        )
      );
      const correction = center.subtract(bboxCenter);
      return {
        // in `initialization` we do not account for target's transformation matrix
        centerX: center.x,
        centerY: center.y,
        relativeCorrectionX: correction.x,
        relativeCorrectionY: correction.y,
        width,
        height,
      };
    } else {
      //  we send `relativeCenter` up to group's containing plane
      const center = bboxCenter.transform(target.calcOwnMatrix());
      return {
        centerX: center.x,
        centerY: center.y,
        width,
        height,
      };
    }
  }
}
