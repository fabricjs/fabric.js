import type { FabricObject } from '../../shapes/Object/FabricObject';
import { sendPointToPlane } from '../../util/misc/planeChange';
import type { LayoutStrategyResult, StrictLayoutContext } from '../types';
import { LayoutStrategy } from './LayoutStrategy';

export class ClipPathLayout extends LayoutStrategy {
  shouldPerformLayout(context: StrictLayoutContext): boolean {
    return (
      !!context.target.clipPath &&
      (context.type === 'initialization' || super.shouldPerformLayout(context))
    );
  }

  shouldLayoutClipPath() {
    return false;
  }

  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutStrategyResult | undefined {
    const { target } = context;
    const { clipPath } = target;
    if (!clipPath || !this.shouldPerformLayout(context)) {
      return;
    }
    const bbox = this.calcBoundingBox([clipPath], context)!;
    if (clipPath.absolutePositioned) {
      //  we want the center point to exist in group's containing plane
      const clipPathCenter = sendPointToPlane(
        clipPath.getRelativeCenterPoint(),
        undefined,
        target.group?.calcTransformMatrix()
      );
      return {
        centerX: clipPathCenter.x,
        centerY: clipPathCenter.y,
        width: bbox.width,
        height: bbox.height,
      };
    } else {
      //  we want the center point to exist in group's containing plane, so we send it upwards
      const clipPathCenter = clipPath
        .getRelativeCenterPoint()
        .transform(target.calcOwnMatrix(), true);
      if (this.shouldPerformLayout(context)) {
        // the clip path is positioned relative to the group's center which is affected by the bbox
        // so we first calculate the bbox
        const {
          centerX = 0,
          centerY = 0,
          correctionX = 0,
          correctionY = 0,
        } = this.calcBoundingBox(objects, context) || {};
        return {
          centerX: centerX + clipPathCenter.x,
          centerY: centerY + clipPathCenter.y,
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
          width: bbox.width,
          height: bbox.height,
        };
      }
    }
  }
}
