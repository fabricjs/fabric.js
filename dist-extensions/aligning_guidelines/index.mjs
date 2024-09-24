import { Point, util } from 'fabric';
import { collectVerticalPoint, collectHorizontalPoint } from './util/collect-point.mjs';
import { drawPointList, drawVerticalLine, drawHorizontalLine } from './util/draw.mjs';
import { getObjectsByTarget } from './util/get-objects-by-target.mjs';
import { collectLine } from './util/collect-line.mjs';
import { aligningLineConfig } from './constant.mjs';

function initAligningGuidelines(canvas) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Object.assign(aligningLineConfig, options);
  const horizontalLines = new Set();
  const verticalLines = new Set();
  let onlyDrawPoint = false;
  const cacheMap = new Map();
  const getCaCheMapValue = object => {
    const cacheKey = [object.calcTransformMatrix().toString(), object.width, object.height].join();
    const cacheValue = cacheMap.get(cacheKey);
    if (cacheValue) return cacheValue;
    const coords = object.getCoords();
    const rect = util.makeBoundingBoxFromPoints(coords);
    const value = [rect, coords];
    cacheMap.set(cacheKey, value);
    return value;
  };
  function moving(e) {
    const activeObject = e.target;
    activeObject.setCoords();
    onlyDrawPoint = false;
    verticalLines.clear();
    horizontalLines.clear();
    const objects = getObjectsByTarget(activeObject);
    const activeObjectRect = activeObject.getBoundingRect();
    for (const object of objects) {
      const objectRect = getCaCheMapValue(object)[0];
      const {
        vLines,
        hLines
      } = collectLine({
        activeObject,
        activeObjectRect,
        objectRect
      });
      vLines.forEach(o => {
        verticalLines.add(JSON.stringify(o));
      });
      hLines.forEach(o => {
        horizontalLines.add(JSON.stringify(o));
      });
    }
  }
  function scalingOrResizing(e) {
    // br bl tr tl mb ml mt mr
    const activeObject = e.target;
    activeObject.setCoords();
    const isScale = String(e.transform.action).startsWith('scale');
    verticalLines.clear();
    horizontalLines.clear();
    const objects = getObjectsByTarget(activeObject);
    let corner = e.transform.corner;
    if (activeObject.flipX) corner = corner.replace('l', 'r').replace('r', 'l');
    if (activeObject.flipY) corner = corner.replace('t', 'b').replace('b', 't');
    let index = ['tl', 'tr', 'br', 'bl', 'mt', 'mr', 'mb', 'ml'].indexOf(corner);
    if (index == -1) return;
    onlyDrawPoint = index > 3;
    if (onlyDrawPoint) {
      const angle = activeObject.getTotalAngle();
      if (angle % 90 != 0) return;
      index -= 4;
    }
    let point = activeObject.getCoords()[index];
    for (const object of objects) {
      const [rect, coords] = getCaCheMapValue(object);
      const center = new Point(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const list = [...coords, center];
      const props = {
        activeObject,
        point,
        list,
        isScale,
        index
      };
      const vLines = collectVerticalPoint(props);
      const hLines = collectHorizontalPoint(props);
      vLines.forEach(o => {
        verticalLines.add(JSON.stringify(o));
      });
      hLines.forEach(o => {
        horizontalLines.add(JSON.stringify(o));
      });
      if (vLines.length || hLines.length) point = activeObject.getCoords()[index];
    }
  }
  function beforeRender() {
    canvas.clearContext(canvas.contextTop);
  }
  function afterRender() {
    if (onlyDrawPoint) {
      const list = [];
      for (const v of verticalLines) list.push(JSON.parse(v));
      for (const h of horizontalLines) list.push(JSON.parse(h));
      drawPointList(canvas, list);
    } else {
      for (const v of verticalLines) drawVerticalLine(canvas, JSON.parse(v));
      for (const h of horizontalLines) drawHorizontalLine(canvas, JSON.parse(h));
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

export { initAligningGuidelines };
//# sourceMappingURL=index.mjs.map
