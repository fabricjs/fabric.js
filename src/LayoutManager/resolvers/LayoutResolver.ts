import { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import { cos } from '../../util/misc/cos';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { resolveOrigin } from '../../util/misc/resolveOrigin';
import { sin } from '../../util/misc/sin';
import type { LayoutContext, LayoutStrategyResult } from '../types';

export abstract class LayoutResolver {
  abstract calcLayoutResult(
    target: Group,
    objects: FabricObject[],
    context: LayoutContext
  ): LayoutStrategyResult | undefined;

  /**
   * Override this method to customize layout.
   * A wrapper around {@link getObjectsBoundingBox}
   *
   * @param {string} layoutDirective
   * @param {FabricObject[]} objects
   * @param {LayoutContext} context
   * @returns {LayoutStrategyResult | undefined}
   */
  calcBoundingBox(
    target: Group,
    objects: FabricObject[],
    context: LayoutContext
  ) {
    if (context.type === 'initialization') {
      return this.calcInitialBoundingBox(target, objects, context);
    } else if (context.type === 'imperative' && context.context) {
      return {
        ...(this.getObjectsBoundingBox(target, objects) || {}),
        ...context.context,
      };
    } else {
      return this.getObjectsBoundingBox(target, objects);
    }
  }

  /**
   * Calculates center taking into account originX, originY while not being sure that width/height are initialized
   *
   */
  protected calcInitialBoundingBox(
    target: Group,
    objects: FabricObject[],
    context: LayoutContext
  ) {
    const options = context.options || {},
      hasX = typeof options.left === 'number',
      hasY = typeof options.top === 'number',
      hasWidth = typeof options.width === 'number',
      hasHeight = typeof options.height === 'number';

    //  performance enhancement
    //  skip layout calculation if bbox is defined
    if (
      (hasX &&
        hasY &&
        hasWidth &&
        hasHeight &&
        context.objectsRelativeToGroup) ||
      objects.length === 0
    ) {
      //  return nothing to skip layout
      return;
    }

    const bbox =
      this.getObjectsBoundingBox(target, objects) ||
      ({} as LayoutStrategyResult);
    const { centerX = 0, centerY = 0, width: w = 0, height: h = 0 } = bbox;
    const {
      left: x,
      top: y,
      width: initialWidth,
      height: initialHeight,
      originX,
      originY,
    } = target;
    const width = hasWidth ? initialWidth : w,
      height = hasHeight ? initialHeight : h,
      calculatedCenter = new Point(centerX, centerY),
      origin = new Point(resolveOrigin(originX), resolveOrigin(originY)),
      size = new Point(width, height),
      strokeWidthVector = target._getTransformedDimensions({
        width: 0,
        height: 0,
      }),
      sizeAfter = target._getTransformedDimensions({
        width: width,
        height: height,
        strokeWidth: 0,
      }),
      bboxSizeAfter = target._getTransformedDimensions({
        width: bbox.width,
        height: bbox.height,
        strokeWidth: 0,
      }),
      rotationCorrection = new Point(0, 0);

    //  calculate center and correction
    const originT = origin.scalarAdd(0.5);
    const originCorrection = sizeAfter.multiply(originT);
    const centerCorrection = new Point(
      hasWidth ? bboxSizeAfter.x / 2 : originCorrection.x,
      hasHeight ? bboxSizeAfter.y / 2 : originCorrection.y
    );
    const center = new Point(
      hasX
        ? x - (sizeAfter.x + strokeWidthVector.x) * origin.x
        : calculatedCenter.x - centerCorrection.x,
      hasY
        ? y - (sizeAfter.y + strokeWidthVector.y) * origin.y
        : calculatedCenter.y - centerCorrection.y
    );
    const offsetCorrection = new Point(
      hasX
        ? center.x - calculatedCenter.x + bboxSizeAfter.x * (hasWidth ? 0.5 : 0)
        : -(hasWidth
            ? (sizeAfter.x - strokeWidthVector.x) * 0.5
            : sizeAfter.x * originT.x),
      hasY
        ? center.y -
          calculatedCenter.y +
          bboxSizeAfter.y * (hasHeight ? 0.5 : 0)
        : -(hasHeight
            ? (sizeAfter.y - strokeWidthVector.y) * 0.5
            : sizeAfter.y * originT.y)
    ).add(rotationCorrection);
    const correction = new Point(
      hasWidth ? -sizeAfter.x / 2 : 0,
      hasHeight ? -sizeAfter.y / 2 : 0
    ).add(offsetCorrection);

    return {
      centerX: center.x,
      centerY: center.y,
      correctionX: correction.x,
      correctionY: correction.y,
      width: size.x,
      height: size.y,
    };
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
    const objectBounds: Point[] = [];
    objects.forEach((object) => {
      const objCenter = object.getRelativeCenterPoint();
      let sizeVector = object._getTransformedDimensions().scalarDivide(2);
      if (object.angle) {
        const rad = degreesToRadians(object.angle),
          sine = Math.abs(sin(rad)),
          cosine = Math.abs(cos(rad)),
          rx = sizeVector.x * cosine + sizeVector.y * sine,
          ry = sizeVector.x * sine + sizeVector.y * cosine;
        sizeVector = new Point(rx, ry);
      }
      objectBounds.push(
        objCenter.subtract(sizeVector),
        objCenter.add(sizeVector)
      );
    });
    const { left, top, width, height } =
      makeBoundingBoxFromPoints(objectBounds);

    const size = new Point(width, height),
      relativeCenter = (!ignoreOffset ? new Point(left, top) : new Point()).add(
        size.scalarDivide(2)
      ),
      //  we send `relativeCenter` up to group's containing plane
      center = relativeCenter.transform(target.calcOwnMatrix());

    return {
      centerX: center.x,
      centerY: center.y,
      width: size.x,
      height: size.y,
    };
  }
}
