import { Point } from './Point';
import { CENTER } from './constants';
import { makeBoundingBoxFromPoints } from './util/misc/boundingBoxFromPoints';
import { cos } from './util/misc/cos';
import { invertTransform } from './util/misc/matrix';
import { degreesToRadians } from './util/misc/radiansDegreesConversion';
import { resolveOrigin } from './util/misc/resolveOrigin';
import { sin } from './util/misc/sin';
import type { Group } from './shapes/Group';
import type { FabricObject } from './shapes/Object/FabricObject';

export type LayoutContextType =
  | 'initialization'
  | 'object_modified'
  | 'added'
  | 'removed'
  | 'layout_change'
  | 'imperative';

export type LayoutContext = {
  layout?: LayoutStrategy;
  type: LayoutContextType;
  /**
   * array of objects starting from the object that triggered the call to the current one
   */
  path?: Group[];
  [key: string]: any;
};

export type PassedLayoutContext = LayoutContext & {
  layout: LayoutStrategy;
};

export type LayoutEvent = {
  context: LayoutContext;
} & LayoutResult;

export type LayoutStrategy =
  | 'fit-content'
  | 'fit-content-lazy'
  | 'fixed'
  | 'clip-path';

/**
 * positioning and layout data **relative** to instance's parent
 */
export type LayoutStrategyResult = {
  /**
   * new centerX as measured by the containing plane (same as `left` with `originX` set to `center`)
   */
  centerX: number;
  /**
   * new centerY as measured by the containing plane (same as `top` with `originY` set to `center`)
   */
  centerY: number;
  /**
   * correctionX to translate objects by, measured as `centerX`
   */
  correctionX?: number;
  /**
   * correctionY to translate objects by, measured as `centerY`
   */
  correctionY?: number;
  width: number;
  height: number;
  prevLayout?: LayoutStrategy;
};

export type LayoutResult = {
  result?: LayoutStrategyResult;
  prevCenter: Point;
  nextCenter: Point;
  offset: Point;
};

export class LayoutManager {
  private _firstLayoutDone = false;

  protected target: Group;

  constructor(protected layout: LayoutStrategy = 'fit-content') {}

  attach(target: Group) {
    this.target = target;
  }

  /**
   * @public
   * @param {Partial<LayoutStrategyResult> & { layout?: string }} [context] pass values to use for layout calculations
   */
  public triggerLayout<T extends LayoutStrategy>(
    context?: Partial<LayoutStrategyResult> &
      ({ layout?: T; once?: never } | { layout: T; once?: boolean })
  ) {
    const prevLayout = this.layout;
    if (context?.layout && context.layout !== prevLayout && !context.once) {
      this.layout = context.layout;
    }
    this.performLayout({
      type: 'imperative',
      context: {
        ...context,
        prevLayout,
      },
    });
  }

  protected getLayoutResult(context: PassedLayoutContext): LayoutResult {
    const prevCenter = this.target.getRelativeCenterPoint();
    const result = this.getLayoutStrategyResult(
      context.layout,
      this.target.getObjects(),
      context
    );
    if (!result) {
      return {
        result,
        prevCenter,
        nextCenter: prevCenter,
        offset: new Point(),
      };
    }
    const nextCenter = new Point(result.centerX, result.centerY);
    const correction = new Point(
      result.correctionX ?? 0,
      result.correctionY ?? 0
    );
    const vector = prevCenter.subtract(nextCenter).add(correction);
    const offset = vector.transform(
      invertTransform(this.target.calcOwnMatrix()),
      true
    );
    return { result, prevCenter, nextCenter, offset };
  }

  performLayout(context: LayoutContext) {
    if (!this._firstLayoutDone && context.type === 'initialization') {
      this.performInitialLayout({ layout: this.layout, ...context });
      return;
    } else if (!this._firstLayoutDone) {
      //  reject layout requests before initialization layout
      return;
    }
    this.performSecondaryLayout({ layout: this.layout, ...context });
  }

  protected performInitialLayout(context: PassedLayoutContext) {
    const { target } = this;
    const layoutResult = this.getLayoutResult(context);
    let bubblingContext: LayoutResult;

    if (layoutResult.result) {
      bubblingContext = layoutResult;
      const {
        result: { width, height },
        offset,
        prevCenter,
        nextCenter,
      } = layoutResult;
      // set dimensions
      target.set({ width, height });
      //  adjust objects to account for new center
      !context.objectsRelativeToGroup &&
        target.forEachObject((object) => {
          object.group === target && this.adjustObjectPosition(object, offset);
        });
      //  set position
      if (!nextCenter.eq(prevCenter)) {
        target.setPositionByOrigin(nextCenter, CENTER, CENTER);
        target.setCoords();
      }
    } else {
      const {
        prevCenter: { x: centerX, y: centerY },
      } = layoutResult;
      bubblingContext = {
        ...layoutResult,
        result: {
          centerX,
          centerY,
          width: target.width,
          height: target.height,
        },
      };
    }

    //  flag for next layouts
    this._firstLayoutDone = true;

    this.bubble(context, bubblingContext);
  }

  /**
   * initial layout logic:
   * calculate bbox of objects (if necessary) and translate it according to options received from the constructor (left, top, width, height)
   * so it is placed in the center of the bbox received from the constructor
   *
   * @param {LayoutContext} context
   */
  protected performSecondaryLayout(context: PassedLayoutContext) {
    const { target } = this;
    const { result, offset, prevCenter, nextCenter } =
      this.getLayoutResult(context);

    if (!result) {
      return;
    }

    // set dimensions
    target.set({ width: result.width, height: result.height });
    //  adjust objects to account for new center
    target.forEachObject((object) => {
      object.group === target && this.adjustObjectPosition(object, offset);
    });
    // adjust clip path to account for new center
    context.layout !== 'clip-path' &&
      target.clipPath &&
      !target.clipPath.absolutePositioned &&
      this.adjustObjectPosition(target.clipPath as FabricObject, offset);
    //  set position
    if (!nextCenter.eq(prevCenter)) {
      target.setPositionByOrigin(nextCenter, CENTER, CENTER);
      target.setCoords();
    }
    this.bubble(context, { result, offset, prevCenter, nextCenter });
  }

  /**
   * @param {FabricObject} object
   * @param {Point} offset
   */
  protected adjustObjectPosition(object: FabricObject, offset: Point) {
    object.setRelativeXY(object.getRelativeXY().add(offset));
  }

  protected bubble(context: LayoutContext, layoutData: LayoutResult) {
    const { target } = this;

    //  fire layout hook and event (event will fire only for layouts after initialization layout)
    this.onLayout({
      context,
      ...layoutData,
    });
    this.target.fire('layout', {
      context,
      ...layoutData,
    });

    //  recursive up
    if (target.group?.layoutManager) {
      //  append the path recursion to context
      if (!context.path) {
        context.path = [];
      }
      context.path.push(target);
      //  all parents should invalidate their layout
      target.group.layoutManager.performLayout(context);
    }
  }

  /**
   * Override this method to customize layout.
   * If you need to run logic once layout completes use `onLayout`
   * @public
   * @param {string} layoutDirective
   * @param {FabricObject[]} objects
   * @param {LayoutContext} context
   * @returns {LayoutStrategyResult | undefined}
   */
  public getLayoutStrategyResult<T extends LayoutStrategy>(
    layoutDirective: T,
    objects: FabricObject[],
    context: LayoutContext
  ): LayoutStrategyResult | undefined {
    if (
      layoutDirective === 'fit-content-lazy' &&
      context.type === 'added' &&
      objects.length > context.targets.length
    ) {
      //  calculate added objects' bbox with existing bbox
      const addedObjects = context.targets.concat(this.target);
      return this.prepareBoundingBox(layoutDirective, addedObjects, context);
    } else if (
      layoutDirective === 'fit-content' ||
      layoutDirective === 'fit-content-lazy' ||
      (layoutDirective === 'fixed' &&
        (context.type === 'initialization' || context.type === 'imperative'))
    ) {
      return this.prepareBoundingBox(layoutDirective, objects, context);
    } else if (layoutDirective === 'clip-path' && this.target.clipPath) {
      const clipPath = this.target.clipPath;
      const clipPathSizeAfter = clipPath._getTransformedDimensions();
      if (
        clipPath.absolutePositioned &&
        (context.type === 'initialization' || context.type === 'layout_change')
      ) {
        //  we want the center point to exist in group's containing plane
        let clipPathCenter = clipPath.getCenterPoint();
        if (this.target.group) {
          //  send point from canvas plane to group's containing plane
          const inv = invertTransform(this.target.group.calcTransformMatrix());
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
            this.target.calcOwnMatrix(),
            true
          );
        if (
          context.type === 'initialization' ||
          context.type === 'layout_change'
        ) {
          const bbox =
            this.prepareBoundingBox(layoutDirective, objects, context) || {};
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
          center = this.target.getRelativeCenterPoint();
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

  /**
   * Calculates center taking into account originX, originY while not being sure that width/height are initialized
   *
   * @param {string} layoutDirective
   * @param {FabricObject[]} objects
   * @param {LayoutContext} context
   * @returns {LayoutStrategyResult | undefined}
   */
  protected prepareInitialBoundingBox<T extends LayoutStrategy>(
    layoutDirective: T,
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
      this.getObjectsBoundingBox(objects) || ({} as LayoutStrategyResult);
    const { centerX = 0, centerY = 0, width: w = 0, height: h = 0 } = bbox;
    const {
      left: x,
      top: y,
      width: initialWidth,
      height: initialHeight,
      originX,
      originY,
    } = this.target;
    const width = hasWidth ? initialWidth : w,
      height = hasHeight ? initialHeight : h,
      calculatedCenter = new Point(centerX, centerY),
      origin = new Point(resolveOrigin(originX), resolveOrigin(originY)),
      size = new Point(width, height),
      strokeWidthVector = this.target._getTransformedDimensions({
        width: 0,
        height: 0,
      }),
      sizeAfter = this.target._getTransformedDimensions({
        width: width,
        height: height,
        strokeWidth: 0,
      }),
      bboxSizeAfter = this.target._getTransformedDimensions({
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
   * Override this method to customize layout.
   * A wrapper around {@link getObjectsBoundingBox}
   *
   * @param {string} layoutDirective
   * @param {FabricObject[]} objects
   * @param {LayoutContext} context
   * @returns {LayoutStrategyResult | undefined}
   */
  protected prepareBoundingBox<T extends LayoutStrategy>(
    layoutDirective: T,
    objects: FabricObject[],
    context: LayoutContext
  ) {
    if (context.type === 'initialization') {
      return this.prepareInitialBoundingBox(layoutDirective, objects, context);
    } else if (context.type === 'imperative' && context.context) {
      return {
        ...(this.getObjectsBoundingBox(objects) || {}),
        ...context.context,
      };
    } else {
      return this.getObjectsBoundingBox(objects);
    }
  }

  /**
   * Calculate the bbox of objects relative to instance's containing plane
   *
   * @param {FabricObject[]} objects
   * @returns {LayoutStrategyResult | undefined} bounding box
   */
  getObjectsBoundingBox(
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
      center = relativeCenter.transform(this.target.calcOwnMatrix());

    return {
      centerX: center.x,
      centerY: center.y,
      width: size.x,
      height: size.y,
    };
  }

  /**
   * Hook that is called once layout has completed.
   * Provided for layout customization, override if necessary.
   * Complements `getLayoutStrategyResult`, which is called at the beginning of layout.
   *
   */
  onLayout(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: {
      context: LayoutContext;
    } & LayoutResult
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  toJSON() {
    return { layout: this.layout };
  }
}
