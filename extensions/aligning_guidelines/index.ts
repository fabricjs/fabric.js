import {
  type BasicTransformEvent,
  type Canvas,
  type FabricObject,
  type TPointerEvent,
  type Point,
  util,
} from 'fabric';
import {
  collectHorizontalPoint,
  collectVerticalPoint,
} from './util/collect-point';
import {
  drawHorizontalLine,
  drawLine,
  drawPointList,
  drawVerticalLine,
  drawX,
} from './util/draw';
import { collectLine } from './util/collect-line';
import type { AligningLineConfig, OriginMap } from './typedefs';
import { getObjectsByTarget } from './util/get-objects-by-target';
import { getContraryMap, getPointMap } from './util/basic';

type TransformEvent = BasicTransformEvent<TPointerEvent> & {
  target: FabricObject;
};

export class AligningGuidelines {
  canvas: Canvas;
  horizontalLines = new Set<string>();
  verticalLines = new Set<string>();
  cacheMap = new Map<string, Point[]>();
  /**
   * When we drag to resize using center points like mt, ml, mb, and mr,
   * we do not need to draw line segments; we only need to draw the target points.
   */
  onlyDrawPoint = false;
  /** Alignment method is required when customizing. */
  contraryOriginMap: OriginMap = {
    tl: ['right', 'bottom'],
    tr: ['left', 'bottom'],
    br: ['left', 'top'],
    bl: ['right', 'top'],
    mt: ['center', 'bottom'],
    mr: ['left', 'center'],
    mb: ['center', 'top'],
    ml: ['right', 'center'],
  };
  xSize = 2.4;
  lineDash: number[] | undefined;
  /** At what distance from the shape does alignment begin? */
  margin = 4;
  /** Aligning line dimensions */
  width = 1;
  /** Aligning line color */
  color = 'rgba(255,0,0,0.9)';
  /** Close Vertical line, default false. */
  closeVLine = false;
  /** Close horizontal line, default false. */
  closeHLine = false;

  constructor(canvas: Canvas, options: Partial<AligningLineConfig> = {}) {
    this.canvas = canvas;
    Object.assign(this, options);

    this.mouseUp = this.mouseUp.bind(this);
    this.scalingOrResizing = this.scalingOrResizing.bind(this);
    this.moving = this.moving.bind(this);
    this.beforeRender = this.beforeRender.bind(this);
    this.afterRender = this.afterRender.bind(this);

    this.initBehavior();
  }
  initBehavior() {
    this.canvas.on('mouse:up', this.mouseUp);
    this.canvas.on('object:resizing', this.scalingOrResizing);
    this.canvas.on('object:scaling', this.scalingOrResizing);
    this.canvas.on('object:moving', this.moving);
    this.canvas.on('before:render', this.beforeRender);
    this.canvas.on('after:render', this.afterRender);
  }
  /** Returns shapes that can draw aligning lines, default returns all shapes on the canvas excluding groups. */
  getObjectsByTarget(target: FabricObject) {
    return getObjectsByTarget(target);
  }
  /** When the user customizes the controller, this property is set to enable or disable automatic alignment through point scaling/resizing. */
  getPointMap(target: FabricObject) {
    return getPointMap(target);
  }
  /** When the user customizes the controller, this property is used to enable or disable alignment positioning through points. */
  getContraryMap(target: FabricObject) {
    return getContraryMap(target);
  }
  /** Users can customize. */
  getCaCheMapValue(object: FabricObject) {
    const cacheKey = [
      object.calcTransformMatrix().toString(),
      object.width,
      object.height,
    ].join();
    const cacheValue = this.cacheMap.get(cacheKey);
    if (cacheValue) return cacheValue;
    const value = object.getCoords();
    value.push(object.getCenterPoint());
    this.cacheMap.set(cacheKey, value);
    return value;
  }
  drawLine(origin: Point, target: Point) {
    drawLine.call(this, origin, target);
  }
  drawX(point: Point, dir: number) {
    drawX.call(this, point, dir);
  }
  mouseUp() {
    this.verticalLines.clear();
    this.horizontalLines.clear();
    this.cacheMap.clear();
    this.canvas.requestRenderAll();
  }

  scalingOrResizing(e: TransformEvent) {
    const target = e.target;
    // We need to obtain the real-time coordinates of the current object, so we need to update them in real-time
    target.setCoords();
    // The value of action can be scaleX, scaleY, scale, resize, etc.
    // If it does not start with "scale," it is considered a modification of size.
    const isScale = String(e.transform.action).startsWith('scale');
    this.verticalLines.clear();
    this.horizontalLines.clear();

    const objects = this.getObjectsByTarget(target);
    // When the shape is flipped, the tl obtained through getCoords is actually tr,
    // and tl is actually tr. We need to make correction adjustments.
    // tr <-> tl、 bl <-> br、  mb <-> mt、 ml <-> mr
    let corner = e.transform.corner;
    if (target.flipX) {
      if (corner.includes('l')) corner = corner.replace('l', 'r');
      else if (corner.includes('r')) corner = corner.replace('r', 'l');
    }
    if (target.flipY) {
      if (corner.includes('t')) corner = corner.replace('t', 'b');
      else if (corner.includes('b')) corner = corner.replace('b', 't');
    }

    // Obtain the coordinates of the current operation point through the value of corner.
    // users can be allowed to customize and pass in custom corners.
    const pointMap = this.getPointMap(target);
    if (!(corner in pointMap)) return;
    this.onlyDrawPoint = corner.includes('m');
    if (this.onlyDrawPoint) {
      const angle = target.getTotalAngle();
      // When the shape is rotated, it is meaningless to draw points using the center point.
      if (angle % 90 != 0) return;
    }
    // If manipulating tl, then when the shape changes size, it should be positioned by br,
    // and the same applies to others.
    // users can be allowed to customize and pass in custom corners.
    const contraryMap = this.getContraryMap(target);
    const point = pointMap[corner];
    let diagonalPoint = contraryMap[corner];
    // When holding the centerKey (default is altKey), the shape will scale based on the center point, with the reference point being the center.
    const isCenter =
      e.transform.original.originX == 'center' &&
      e.transform.original.originY == 'center';
    if (isCenter) {
      const p = target.group
        ? point.transform(
            util.invertTransform(target.group.calcTransformMatrix()),
          )
        : point;
      diagonalPoint = diagonalPoint.add(p).scalarDivide(2);
    }
    const uniformIsToggled = e.e[this.canvas.uniScaleKey!];
    let isUniform =
      (this.canvas.uniformScaling && !uniformIsToggled) ||
      (!this.canvas.uniformScaling && uniformIsToggled);
    // When controlling through the center point,
    // if isUniform is true, it actually changes the skew, so it is meaningless.
    if (this.onlyDrawPoint) isUniform = false;

    const list: Point[] = [];
    for (const object of objects) {
      const d = this.getCaCheMapValue(object);
      list.push(...d);
    }

    const props = {
      target,
      point,
      diagonalPoint,
      corner,
      list,
      isScale,
      isUniform,
      isCenter,
    };

    // Obtain horizontal and vertical reference lines.
    const noNeedToCollectV =
      this.onlyDrawPoint && (corner.includes('t') || corner.includes('b'));
    const noNeedToCollectH =
      this.onlyDrawPoint && (corner.includes('l') || corner.includes('r'));
    const vList = noNeedToCollectV
      ? []
      : collectVerticalPoint.call(this, props);
    const hList = noNeedToCollectH
      ? []
      : collectHorizontalPoint.call(this, props);
    vList.forEach((o) => {
      // Objects cannot be deduplicated; convert them to strings for deduplication.
      this.verticalLines.add(JSON.stringify(o));
    });
    hList.forEach((o) => {
      // Objects cannot be deduplicated; convert them to strings for deduplication.
      this.horizontalLines.add(JSON.stringify(o));
    });
  }
  moving(e: TransformEvent) {
    const target = e.target;
    // We need to obtain the real-time coordinates of the current object, so we need to update them in real-time
    target.setCoords();
    this.onlyDrawPoint = false;
    this.verticalLines.clear();
    this.horizontalLines.clear();

    // Find the shapes associated with the current graphic to draw reference lines for it.
    const objects = this.getObjectsByTarget(target);
    const points: Point[] = [];
    // Collect all the points to draw reference lines.
    for (const object of objects) points.push(...this.getCaCheMapValue(object));

    // Obtain horizontal and vertical reference lines.
    const { vLines, hLines } = collectLine.call(this, target, points);
    vLines.forEach((o) => {
      // Objects cannot be deduplicated; convert them to strings for deduplication.
      this.verticalLines.add(JSON.stringify(o));
    });
    hLines.forEach((o) => {
      // Objects cannot be deduplicated; convert them to strings for deduplication.
      this.horizontalLines.add(JSON.stringify(o));
    });
  }
  beforeRender() {
    this.canvas.clearContext(this.canvas.contextTop);
  }
  afterRender() {
    if (this.onlyDrawPoint) {
      drawPointList.call(this);
    } else {
      drawVerticalLine.call(this);
      drawHorizontalLine.call(this);
    }
  }

  dispose() {
    this.canvas.off('mouse:up', this.mouseUp);
    this.canvas.off('object:resizing', this.scalingOrResizing);
    this.canvas.off('object:scaling', this.scalingOrResizing);
    this.canvas.off('object:moving', this.moving);
    this.canvas.off('before:render', this.beforeRender);
    this.canvas.off('after:render', this.afterRender);
  }
}
