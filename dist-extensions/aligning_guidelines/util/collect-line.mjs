import { Point } from 'fabric';
import { aligningLineConfig } from '../constant.mjs';
import { getDistance, setPositionDir } from './basic.mjs';

function collectLine(props) {
  var _activeObject$canvas$, _activeObject$canvas;
  const aligningLineMargin = aligningLineConfig.margin;
  const {
    activeObject,
    activeObjectRect,
    objectRect
  } = props;
  const list = makeLineByRect(objectRect);
  const aList = makeLineByRect(activeObjectRect);
  const margin = aligningLineMargin / ((_activeObject$canvas$ = (_activeObject$canvas = activeObject.canvas) === null || _activeObject$canvas === void 0 ? void 0 : _activeObject$canvas.getZoom()) !== null && _activeObject$canvas$ !== void 0 ? _activeObject$canvas$ : 1);
  const opts = {
    target: activeObject,
    list,
    aList,
    margin
  };
  const vLines = collectVerticalLine(opts);
  const hLines = collectHorizontalLine(opts);
  return {
    vLines,
    hLines
  };
}
function collectVerticalLine(props) {
  const {
    target,
    list,
    aList,
    margin
  } = props;
  const arr = aList.map(x => getDistanceLine(x, list, 'x'));
  const min = Math.min(...arr.map(x => x.dis));
  if (min > margin) return [];
  const lines = [];
  const width = aList[0].x2 - aList[0].x;
  const height = aList[0].y2 - aList[0].y;
  let b = false;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (min == item.dis) {
      const line = list[item.index];
      const aLine = aList[item.index];
      const x = line.x;
      const y = aLine.y;
      const y1 = Math.min(line.y, line.y2, y, aLine.y2);
      const y2 = Math.max(line.y, line.y2, y, aLine.y2);
      // 参考线可画多条
      lines.push({
        x,
        y1,
        y2
      });
      if (b) continue;
      b = true;
      // 对齐只进行一次
      setPos({
        target,
        x,
        y,
        centerX: i - 1,
        centerY: item.index - 1,
        width,
        height,
        dir: 'x'
      });
      const dis = min * item.dir;
      aList.forEach(x => x.x -= dis);
    }
  }
  return lines;
}
function collectHorizontalLine(props) {
  const {
    target,
    list,
    aList,
    margin
  } = props;
  const arr = aList.map(x => getDistanceLine(x, list, 'y'));
  const min = Math.min(...arr.map(x => x.dis));
  if (min > margin) return [];
  const lines = [];
  const width = aList[0].x2 - aList[0].x;
  const height = aList[0].y2 - aList[0].y;
  let b = false;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (min == item.dis) {
      const line = list[item.index];
      const aLine = aList[item.index];
      const y = line.y;
      const x = aLine.x;
      const x1 = Math.min(line.x, line.x2, x, aLine.x2);
      const x2 = Math.max(line.x, line.x2, x, aLine.x2);
      // 参考线可画多条
      lines.push({
        y,
        x1,
        x2
      });
      if (b) continue;
      b = true;
      // 对齐只进行一次
      setPos({
        target,
        x,
        y,
        centerX: item.index - 1,
        centerY: i - 1,
        width,
        height,
        dir: 'y'
      });
      const dis = min * item.dir;
      aList.forEach(x => x.y -= dis);
    }
  }
  return lines;
}
function getDistanceLine(target, list, type) {
  let dis = Infinity;
  let index = -1;
  /** 1正值 -1负值 */
  let dir = 1;
  for (let i = 0; i < list.length; i++) {
    const v = getDistance(target[type], list[i][type]);
    if (dis > v) {
      index = i;
      dis = v;
      dir = target[type] > list[i][type] ? 1 : -1;
    }
  }
  return {
    dis,
    index,
    dir
  };
}
function makeLineByRect(rect) {
  const {
    left,
    top,
    width,
    height
  } = rect;
  const a = {
    x: left,
    y: top,
    x2: left + width,
    y2: top + height
  };
  const x = left + width / 2;
  const y = top + height / 2;
  const b = {
    x,
    y,
    x2: x,
    y2: y
  };
  const c = {
    x: left + width,
    x2: left,
    y: top + height,
    y2: top
  };
  return [a, b, c];
}
function setPos(props) {
  const {
    target,
    centerX,
    centerY,
    width,
    height,
    dir
  } = props;
  let {
    x,
    y
  } = props;
  x -= centerX * width / 2;
  y -= centerY * height / 2;
  setPositionDir(target, new Point(x, y), dir);
  target.setCoords();
}

export { collectLine };
//# sourceMappingURL=collect-line.mjs.map
