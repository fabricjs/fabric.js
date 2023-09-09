import { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { TBBox } from '../../typedefs';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import { resolveOrigin } from '../../util/misc/resolveOrigin';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { getObjectBounds } from './utils';

export abstract class LayoutStrategy {
  shouldPerformLayout(context: StrictLayoutContext) {
    return context.type === 'imperative' || context.strategyChange;
  }

  shouldLayoutClipPath(context: StrictLayoutContext) {
    return context.type !== 'initialization';
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
   * A wrapper around {@link getObjectsBoundingBox}
   */
  calcBoundingBox(
    objects: FabricObject[],
    context: StrictLayoutContext
  ): LayoutStrategyResult | undefined {
    if (context.type === 'initialization') {
      const result = this.getObjectsBoundingBox(context.target, objects);
      if (result) {
        // fix layout origin from left top to given origin
        const {
          target: { originX, originY },
        } = context;
        const size = new Point(result.width, result.height);
        const layoutCenter = new Point(result.centerX, result.centerY);
        const origin = layoutCenter.add(
          new Point(result.width, result.height).scalarMultiply(-0.5)
        );
        const center = origin.add(
          size.multiply(
            new Point(-resolveOrigin(originX), -resolveOrigin(originY))
          )
        );
        const correction = center.subtract(layoutCenter);
        return {
          ...result,
          centerX: center.x,
          centerY: center.y,
          relativeCorrectionX: correction.x,
          relativeCorrectionY: correction.y,
        };
      }
    } else if (context.type === 'imperative' && context.overrides) {
      return context.overrides;
    } else {
      return this.getObjectsBoundingBox(context.target, objects);
    }
  }

  /**
   * Calculate the bbox of objects relative to instance's containing plane
   *
   * @param {FabricObject[]} objects
   * @returns {LayoutStrategyResult | undefined} bounding box
   */
  getObjectsBoundingBox(
    target: Group,
    objects: FabricObject[],
    ignoreOffset?: boolean
  ): LayoutStrategyResult | undefined {
    if (objects.length === 0) {
      return;
    }
    const bbox = makeBoundingBoxFromPoints(
      objects.map((object) => getObjectBounds(target, object)).flat()
    );
    return this.getBoundingBoxResult(target, bbox, ignoreOffset);
  }

  protected getBoundingBoxResult(
    target: Group,
    { left, top, width, height }: TBBox,
    ignoreOffset?: boolean
  ): LayoutStrategyResult {
    const size = new Point(width, height),
      relativeCenter = (!ignoreOffset ? new Point(left, top) : new Point()).add(
        size.scalarDivide(2)
      );
    //  we send `relativeCenter` up to group's containing plane
    const center = relativeCenter.transform(target.calcOwnMatrix());

    return {
      centerX: center.x,
      centerY: center.y,
      width: size.x,
      height: size.y,
    };
  }
}
