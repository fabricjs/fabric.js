import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { sendPointToPlane } from '../../util/misc/planeChange';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';
import { shouldPerformLayout } from './utils';

export class ClipPathLayout extends LayoutStrategy {
  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutStrategyResult | undefined {
    const { target } = context;
    const { clipPath } = target;
    if (!clipPath) {
      return;
    }
    const clipPathSizeAfter = clipPath._getTransformedDimensions();
    if (clipPath.absolutePositioned && shouldPerformLayout(context)) {
      //  we want the center point to exist in group's containing plane
      const clipPathCenter = sendPointToPlane(
        clipPath.getCenterPoint(),
        undefined,
        target.group?.calcTransformMatrix()
      );
      return {
        centerX: clipPathCenter.x,
        centerY: clipPathCenter.y,
        width: clipPathSizeAfter.x,
        height: clipPathSizeAfter.y,
      };
    } else if (!clipPath.absolutePositioned) {
      const clipPathRelativeCenter = clipPath.getRelativeCenterPoint(),
        //  we want the center point to exist in group's containing plane, so we send it upwards
        clipPathCenter = clipPathRelativeCenter.transform(
          target.calcOwnMatrix(),
          true
        );
      if (shouldPerformLayout(context)) {
        const {
          centerX = 0,
          centerY = 0,
          correctionX = 0,
          correctionY = 0,
        } = this.calcBoundingBox(objects, context) || {};
        const center = new Point(centerX, centerY);
        return {
          centerX: center.x + clipPathCenter.x,
          centerY: center.y + clipPathCenter.y,
          correctionX: correctionX - clipPathCenter.x,
          correctionY: correctionY - clipPathCenter.y,
          width: clipPath.width,
          height: clipPath.height,
        };
      } else {
        const center = target.getRelativeCenterPoint();
        return {
          centerX: center.x + clipPathCenter.x,
          centerY: center.y + clipPathCenter.y,
          width: clipPathSizeAfter.x,
          height: clipPathSizeAfter.y,
        };
      }
    }
  }

  shouldAdjustClipPath() {
    return false;
  }
}
