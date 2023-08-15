import { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { invertTransform } from '../../util';
import type { LayoutContext, LayoutStrategyResult } from '../types';
import { LayoutResolver } from './LayoutResolver';

export class ClipPathLayoutResolver extends LayoutResolver {
  calcLayoutResult(
    target: Group,
    objects: FabricObject[],
    context: LayoutContext
  ): LayoutStrategyResult | undefined {
    const clipPath = target.clipPath;
    if (!clipPath) {
      return;
    }
    const clipPathSizeAfter = clipPath._getTransformedDimensions();
    if (
      clipPath.absolutePositioned &&
      (context.type === 'initialization' || context.type === 'layout_change')
    ) {
      //  we want the center point to exist in group's containing plane
      let clipPathCenter = clipPath.getCenterPoint();
      if (target.group) {
        //  send point from canvas plane to group's containing plane
        const inv = invertTransform(target.group.calcTransformMatrix());
        clipPathCenter = clipPathCenter.transform(inv);
      }
      return {
        centerX: clipPathCenter.x,
        centerY: clipPathCenter.y,
        width: clipPathSizeAfter.x,
        height: clipPathSizeAfter.y,
      };
    } else if (!clipPath.absolutePositioned) {
      let center;
      const clipPathRelativeCenter = clipPath.getRelativeCenterPoint(),
        //  we want the center point to exist in group's containing plane, so we send it upwards
        clipPathCenter = clipPathRelativeCenter.transform(
          target.calcOwnMatrix(),
          true
        );
      if (
        context.type === 'initialization' ||
        context.type === 'layout_change'
      ) {
        const bbox = this.calcBoundingBox(target, objects, context) || {};
        center = new Point(bbox.centerX || 0, bbox.centerY || 0);
        return {
          centerX: center.x + clipPathCenter.x,
          centerY: center.y + clipPathCenter.y,
          correctionX: bbox.correctionX - clipPathCenter.x,
          correctionY: bbox.correctionY - clipPathCenter.y,
          width: clipPath.width,
          height: clipPath.height,
        };
      } else {
        center = target.getRelativeCenterPoint();
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
