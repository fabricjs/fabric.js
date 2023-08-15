import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { sendPointToPlane } from '../../util/misc/planeChange';
import type { LayoutResolverResult, StrictLayoutContext } from '../types';
import { LayoutResolver } from './LayoutResolver';

export class ClipPathLayoutResolver extends LayoutResolver {
  calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[]
  ): LayoutResolverResult | undefined {
    const { target } = context;
    const clipPath = target.clipPath;
    if (!clipPath) {
      return;
    }
    const isLayoutChange =
      context.prevResolver && context.resolver !== context.prevResolver;
    const clipPathSizeAfter = clipPath._getTransformedDimensions();
    if (
      clipPath.absolutePositioned &&
      (context.type === 'initialization' || isLayoutChange)
    ) {
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
      if (context.type === 'initialization' || isLayoutChange) {
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
}
