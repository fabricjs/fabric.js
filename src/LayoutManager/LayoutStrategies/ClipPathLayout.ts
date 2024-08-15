import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import { sendPointToPlane } from '../../util/misc/planeChange';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';
import { getObjectBounds } from './utils';
import { classRegistry } from '../../ClassRegistry';

/**
 * Layout will adjust the bounding box to match the clip path bounding box.
 */
export class ClipPathLayout extends LayoutStrategy {
  static readonly type = 'clip-path';

  shouldPerformLayout(context: StrictLayoutContext): boolean {
    return !!context.target.clipPath && super.shouldPerformLayout(context);
  }

  shouldLayoutClipPath() {
    return false;
  }

  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[],
  ): LayoutStrategyResult | undefined {
    const { target } = context;
    const { clipPath, group } = target;
    if (!clipPath || !this.shouldPerformLayout(context)) {
      return;
    }
    // TODO: remove stroke calculation from this case
    const { width, height } = makeBoundingBoxFromPoints(
      getObjectBounds(target, clipPath as FabricObject),
    );
    const size = new Point(width, height);
    if (clipPath.absolutePositioned) {
      //  we want the center point to exist in group's containing plane
      const clipPathCenter = sendPointToPlane(
        clipPath.getRelativeCenterPoint(),
        undefined,
        group ? group.calcTransformMatrix() : undefined,
      );
      return {
        center: clipPathCenter,
        size,
      };
    } else {
      //  we want the center point to exist in group's containing plane, so we send it upwards
      const clipPathCenter = clipPath
        .getRelativeCenterPoint()
        .transform(target.calcOwnMatrix(), true);
      if (this.shouldPerformLayout(context)) {
        // the clip path is positioned relative to the group's center which is affected by the bbox
        // so we first calculate the bbox
        const { center = new Point(), correction = new Point() } =
          this.calcBoundingBox(objects, context) || {};
        return {
          center: center.add(clipPathCenter),
          correction: correction.subtract(clipPathCenter),
          size,
        };
      } else {
        return {
          center: target.getRelativeCenterPoint().add(clipPathCenter),
          size,
        };
      }
    }
  }
}

classRegistry.setClass(ClipPathLayout);
