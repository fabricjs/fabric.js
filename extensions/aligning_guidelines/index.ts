import type {
  BasicTransformEvent,
  Canvas,
  FabricObject,
  TPointerEvent,
} from 'fabric';
import { Point } from 'fabric';
import {
  collectHorizontalPoint,
  collectVerticalPoint,
} from './util/collect-point';
import {
  drawHorizontalLine,
  drawPointList,
  drawVerticalLine,
} from './util/draw';
import { getObjectsByTarget } from './util/get-objects-by-target';
import { collectLine } from './util/collect-line';
import type { AligningLineConfig, LineProps } from './typedefs';
import { aligningLineConfig } from './constant';

type TransformEvent = BasicTransformEvent<TPointerEvent> & {
  target: FabricObject;
};
type PointMap = { [props: string]: Point };

export type { AligningLineConfig } from './typedefs';

export function initAligningGuidelines(
  canvas: Canvas,
  options: Partial<AligningLineConfig> = {}
) {
  Object.assign(aligningLineConfig, options);

  const horizontalLines = new Set<string>();
  const verticalLines = new Set<string>();
  // When we drag to resize using center points like mt, ml, mb, and mr,
  // we do not need to draw line segments; we only need to draw the target points.
  let onlyDrawPoint = false;
  const cacheMap = new Map<string, Point[]>();

  const getCaCheMapValue = (object: FabricObject) => {
    // If there is an ID and the ID is unique, we can cache using the ID for acceleration.
    // However, since Fabric does not have a built-in ID, we use the position information as the key for caching.
    // const cacheKey = object.id;
    const cacheKey = [
      object.calcTransformMatrix().toString(),
      object.width,
      object.height,
    ].join();
    const cacheValue = cacheMap.get(cacheKey);
    if (cacheValue) return cacheValue;
    const value = object.getCoords();
    value.push(object.getCenterPoint());
    cacheMap.set(cacheKey, value);
    return value;
  };

  function moving(e: TransformEvent) {
    const target = e.target;
    // We need to obtain the real-time coordinates of the current object, so we need to update them in real-time
    target.setCoords();
    onlyDrawPoint = false;
    verticalLines.clear();
    horizontalLines.clear();

    // Find the shapes associated with the current graphic to draw reference lines for it.
    const objects = getObjectsByTarget(target);
    const points: Point[] = [];
    // Collect all the points to draw reference lines.
    for (const object of objects) points.push(...getCaCheMapValue(object));

    // Obtain horizontal and vertical reference lines.
    const { vLines, hLines } = collectLine(target, points);
    vLines.forEach((o) => {
      // Objects cannot be deduplicated; convert them to strings for deduplication.
      verticalLines.add(JSON.stringify(o));
    });
    hLines.forEach((o) => {
      // Objects cannot be deduplicated; convert them to strings for deduplication.
      horizontalLines.add(JSON.stringify(o));
    });
  }

  function scalingOrResizing(e: TransformEvent) {
    const target = e.target;
    // We need to obtain the real-time coordinates of the current object, so we need to update them in real-time
    target.setCoords();
    // The value of action can be scaleX, scaleY, scale, resize, etc.
    // If it does not start with "scale," it is considered a modification of size.
    const isScale = String(e.transform.action).startsWith('scale');
    verticalLines.clear();
    horizontalLines.clear();

    const objects = getObjectsByTarget(target);
    let corner = e.transform.corner;
    // When the shape is flipped, the tl obtained through getCoords is actually tr,
    // and tl is actually tr. We need to make correction adjustments.
    // tr <-> tl、 bl <-> br、  mb <-> mt、 ml <-> mr
    if (target.flipX) corner = corner.replace('l', 'r').replace('r', 'l');
    if (target.flipY) corner = corner.replace('t', 'b').replace('b', 't');
    const coords = target.getCoords();
    // Obtain the coordinates of the current operation point through the value of corner.
    // In the future, users can be allowed to customize and pass in custom corners.
    const pointMap: PointMap = {
      tl: coords[0],
      tr: coords[1],
      br: coords[2],
      bl: coords[3],
      mt: coords[0].add(coords[1]).scalarDivide(2),
      mr: coords[1].add(coords[2]).scalarDivide(2),
      mb: coords[2].add(coords[3]).scalarDivide(2),
      ml: coords[3].add(coords[0]).scalarDivide(2),
    };
    if (!(corner in pointMap)) return;
    onlyDrawPoint = corner.includes('m');
    if (onlyDrawPoint) {
      const angle = target.getTotalAngle();
      // When the shape is rotated, it is meaningless to draw points using the center point.
      if (angle % 90 != 0) return;
    }
    // If manipulating tl, then when the shape changes size, it should be positioned by br,
    // and the same applies to others.
    // In the future, users can be allowed to customize and pass in custom corners.
    const contraryMap: PointMap = {
      tl: target.aCoords.br,
      tr: target.aCoords.bl,
      br: target.aCoords.tl,
      bl: target.aCoords.tr,
      mt: target.aCoords.br.add(target.aCoords.bl).scalarDivide(2),
      mr: target.aCoords.bl.add(target.aCoords.tl).scalarDivide(2),
      mb: target.aCoords.tl.add(target.aCoords.tr).scalarDivide(2),
      ml: target.aCoords.tr.add(target.aCoords.br).scalarDivide(2),
    };

    const point = pointMap[corner];
    const diagonalPoint = contraryMap[corner];
    const uniformIsToggled = e.e[canvas.uniScaleKey!];
    let isUniform =
      (canvas.uniformScaling && !uniformIsToggled) ||
      (!canvas.uniformScaling && uniformIsToggled);
    // When controlling through the center point,
    // if isUniform is true, it actually changes the skew, so it is meaningless.
    if (onlyDrawPoint) isUniform = false;

    const list: Point[] = [];
    for (const object of objects) list.push(...getCaCheMapValue(object));

    const props = {
      target,
      point,
      diagonalPoint,
      corner,
      list,
      isScale,
      isUniform,
    };
    // Obtain horizontal and vertical reference lines.
    const vLines = collectVerticalPoint(props);
    const hLines = collectHorizontalPoint(props);
    vLines.forEach((o) => {
      // Objects cannot be deduplicated; convert them to strings for deduplication.
      verticalLines.add(JSON.stringify(o));
    });
    hLines.forEach((o) => {
      // Objects cannot be deduplicated; convert them to strings for deduplication.
      horizontalLines.add(JSON.stringify(o));
    });
  }

  function beforeRender() {
    canvas.clearContext(canvas.contextTop);
  }
  function afterRender() {
    if (onlyDrawPoint) {
      const list: LineProps[] = [];
      for (const v of verticalLines) list.push(JSON.parse(v));
      for (const h of horizontalLines) list.push(JSON.parse(h));
      drawPointList(canvas, list);
    } else {
      for (const v of verticalLines) drawVerticalLine(canvas, JSON.parse(v));
      for (const h of horizontalLines)
        drawHorizontalLine(canvas, JSON.parse(h));
    }
  }
  function mouseUp() {
    verticalLines.clear();
    horizontalLines.clear();
    cacheMap.clear();
    canvas.requestRenderAll();
  }

  canvas.on('object:resizing', scalingOrResizing);
  canvas.on('object:scaling', scalingOrResizing);
  canvas.on('object:moving', moving);
  canvas.on('before:render', beforeRender);
  canvas.on('after:render', afterRender);
  canvas.on('mouse:up', mouseUp);

  return () => {
    canvas.off('object:resizing', scalingOrResizing);
    canvas.off('object:scaling', scalingOrResizing);
    canvas.off('object:moving', moving);
    canvas.off('before:render', beforeRender);
    canvas.off('after:render', afterRender);
    canvas.off('mouse:up', mouseUp);
  };
}
