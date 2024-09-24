import { defineProperty as _defineProperty } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Point } from '../../Point.mjs';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints.mjs';
import { sendPointToPlane } from '../../util/misc/planeChange.mjs';
import { LayoutStrategy } from './LayoutStrategy.mjs';
import { getObjectBounds } from './utils.mjs';
import { classRegistry } from '../../ClassRegistry.mjs';

/**
 * Layout will adjust the bounding box to match the clip path bounding box.
 */
class ClipPathLayout extends LayoutStrategy {
  shouldPerformLayout(context) {
    return !!context.target.clipPath && super.shouldPerformLayout(context);
  }
  shouldLayoutClipPath() {
    return false;
  }
  calcLayoutResult(context, objects) {
    const {
      target
    } = context;
    const {
      clipPath,
      group
    } = target;
    if (!clipPath || !this.shouldPerformLayout(context)) {
      return;
    }
    // TODO: remove stroke calculation from this case
    const {
      width,
      height
    } = makeBoundingBoxFromPoints(getObjectBounds(target, clipPath));
    const size = new Point(width, height);
    if (clipPath.absolutePositioned) {
      //  we want the center point to exist in group's containing plane
      const clipPathCenter = sendPointToPlane(clipPath.getRelativeCenterPoint(), undefined, group ? group.calcTransformMatrix() : undefined);
      return {
        center: clipPathCenter,
        size
      };
    } else {
      //  we want the center point to exist in group's containing plane, so we send it upwards
      const clipPathCenter = clipPath.getRelativeCenterPoint().transform(target.calcOwnMatrix(), true);
      if (this.shouldPerformLayout(context)) {
        // the clip path is positioned relative to the group's center which is affected by the bbox
        // so we first calculate the bbox
        const {
          center = new Point(),
          correction = new Point()
        } = this.calcBoundingBox(objects, context) || {};
        return {
          center: center.add(clipPathCenter),
          correction: correction.subtract(clipPathCenter),
          size
        };
      } else {
        return {
          center: target.getRelativeCenterPoint().add(clipPathCenter),
          size
        };
      }
    }
  }
}
_defineProperty(ClipPathLayout, "type", 'clip-path');
classRegistry.setClass(ClipPathLayout);

export { ClipPathLayout };
//# sourceMappingURL=ClipPathLayout.mjs.map
