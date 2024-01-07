import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import { resolveOrigin } from '../../util/misc/resolveOrigin';
import {
  LAYOUT_TYPE_INITIALIZATION,
  LAYOUT_TYPE_IMPERATIVE,
} from '../constants';
import type {
  InitializationLayoutContext,
  LayoutStrategyResult,
  StrictLayoutContext,
} from '../types';
import { getObjectBounds } from './utils';

/**
 * Exposes a main public method {@link calcLayoutResult} that is used by the `LayoutManager` to perform layout.
 * Returning `undefined` signals the `LayoutManager` to skip the layout.
 *
 * In charge of calculating the bounding box of the passed objects.
 */
export abstract class LayoutStrategy {
  /**
   * override by subclass for persistence (TS does not support `static abstract`)
   */
  static type = 'strategy';

  /**
   * Used by the `LayoutManager` to perform layout
   * @returns layout result **OR** `undefined` to skip layout
   */
  public calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutStrategyResult | undefined {
    if (this.shouldPerformLayout(context)) {
      return this.calcBoundingBox(objects, context);
    }
  }

  shouldPerformLayout(context: StrictLayoutContext) {
    return (
      context.type === LAYOUT_TYPE_INITIALIZATION ||
      context.type === LAYOUT_TYPE_IMPERATIVE ||
      (!!context.prevStrategy && context.strategy !== context.prevStrategy)
    );
  }

  shouldLayoutClipPath({ type, target: { clipPath } }: StrictLayoutContext) {
    return (
      type !== LAYOUT_TYPE_INITIALIZATION &&
      clipPath &&
      !clipPath.absolutePositioned
    );
  }

  getInitialSize(
    context: StrictLayoutContext & InitializationLayoutContext,
    result: Pick<LayoutStrategyResult, 'center' | 'size'>
  ) {
    return result.size;
  }

  /**
   * called from the `onAfterLayout` hook
   */
  shouldResetTransform(context: StrictLayoutContext) {
    return context.target.size() === 0;
  }

  /**
   * Override this method to customize layout.
   */
  calcBoundingBox(
    objects: FabricObject[],
    context: StrictLayoutContext
  ): LayoutStrategyResult | undefined {
    if (context.type === LAYOUT_TYPE_IMPERATIVE && context.overrides) {
      return context.overrides;
    }
    if (objects.length === 0) {
      return;
    }
    const { target } = context;
    const { left, top, width, height } = makeBoundingBoxFromPoints(
      objects
        .map((object) => getObjectBounds(target, object))
        .reduce<Point[]>((coords, curr) => coords.concat(curr), [])
    );
    const bboxSize = new Point(width, height);
    const bboxLeftTop = new Point(left, top);
    const bboxCenter = bboxLeftTop.add(bboxSize.scalarDivide(2));

    if (context.type === LAYOUT_TYPE_INITIALIZATION) {
      const actualSize = this.getInitialSize(context, {
        size: bboxSize,
        center: bboxCenter,
      });
      const originFactor = new Point(
        -resolveOrigin(target.originX),
        -resolveOrigin(target.originY)
      );
      const sizeCorrection = actualSize
        .subtract(bboxSize)
        .multiply(originFactor);
      // translate the layout origin from left top to target's origin
      const center = bboxLeftTop.add(bboxSize.multiply(originFactor));
      return {
        // in `initialization` we do not account for target's transformation matrix
        center: center.add(sizeCorrection),
        relativeCorrection: center.subtract(bboxCenter),
        size: actualSize,
      };
    } else {
      //  we send `relativeCenter` up to group's containing plane
      const center = bboxCenter.transform(target.calcOwnMatrix());
      return {
        center,
        size: bboxSize,
      };
    }
  }
}
