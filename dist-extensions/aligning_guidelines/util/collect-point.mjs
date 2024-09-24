import { aligningLineConfig } from '../constant.mjs';
import { getDistance } from './basic.mjs';

const originXArr = ['left', 'center', 'right'];
const originYArr = ['top', 'center', 'bottom'];
function collectVerticalPoint(props) {
  var _activeObject$canvas$, _activeObject$canvas;
  const aligningLineMargin = aligningLineConfig.margin;
  const {
    activeObject,
    isScale,
    index,
    point,
    list
  } = props;
  const {
    dis,
    arr
  } = getDistanceList(point, list, 'x');
  const margin = aligningLineMargin / ((_activeObject$canvas$ = (_activeObject$canvas = activeObject.canvas) === null || _activeObject$canvas === void 0 ? void 0 : _activeObject$canvas.getZoom()) !== null && _activeObject$canvas$ !== void 0 ? _activeObject$canvas$ : 1);
  if (dis > margin) return [];
  let v = arr[arr.length - 1].x - point.x;
  const dir = index == 0 || index == 3 ? -1 : 1;
  v *= dir;
  const {
    width,
    scaleX,
    left
  } = activeObject;
  const dim = activeObject._getTransformedDimensions();
  const sx = (v + dim.x) / dim.x;
  if (isScale) activeObject.set('scaleX', scaleX * sx);else activeObject.set('width', width * sx);
  const dArr = [0, v / 2 * dir, v * dir];
  if (dir < 0) dArr.reverse();
  const d = dArr[originXArr.indexOf(activeObject.originX)];
  activeObject.set('left', left + d);
  activeObject.setCoords();
  return arr.map(item => ({
    x: item.x,
    y1: item.y,
    y2: point.y
  }));
}
function collectHorizontalPoint(props) {
  var _activeObject$canvas$2, _activeObject$canvas2;
  const aligningLineMargin = aligningLineConfig.margin;
  const {
    activeObject,
    isScale,
    index,
    point,
    list
  } = props;
  const {
    dis,
    arr
  } = getDistanceList(point, list, 'y');
  const margin = aligningLineMargin / ((_activeObject$canvas$2 = (_activeObject$canvas2 = activeObject.canvas) === null || _activeObject$canvas2 === void 0 ? void 0 : _activeObject$canvas2.getZoom()) !== null && _activeObject$canvas$2 !== void 0 ? _activeObject$canvas$2 : 1);
  if (dis > margin) return [];
  let v = arr[arr.length - 1].y - point.y;
  const dir = index < 2 ? -1 : 1;
  v *= dir;
  const {
    height,
    scaleY,
    top
  } = activeObject;
  const dim = activeObject._getTransformedDimensions();
  const sy = (v + dim.y) / dim.y;
  if (isScale) activeObject.set('scaleY', scaleY * sy);else activeObject.set('height', height * sy);
  const dArr = [0, v / 2 * dir, v * dir];
  if (dir < 0) dArr.reverse();
  const d = dArr[originYArr.indexOf(activeObject.originY)];
  activeObject.set('top', top + d);
  activeObject.setCoords();
  return arr.map(item => ({
    y: item.y,
    x1: item.x,
    x2: point.x
  }));
}
function getDistanceList(point, list, type) {
  let dis = Infinity;
  let arr = [];
  for (const item of list) {
    const v = getDistance(point[type], item[type]);
    if (dis > v) {
      arr = [];
      dis = v;
    }
    if (dis == v) {
      arr.push(item);
    }
  }
  return {
    dis,
    arr
  };
}

export { collectHorizontalPoint, collectVerticalPoint };
//# sourceMappingURL=collect-point.mjs.map
