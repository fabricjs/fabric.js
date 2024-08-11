import type { FabricObject, Point, TOriginX, TOriginY } from 'fabric';
import { aligningLineConfig } from '../constant';
import { getDistance } from './basic';

type CollectPointProps = {
  activeObject: FabricObject;
  point: Point;
  list: Point[];
  isScale: boolean;
  index: number;
};
const originXArr: TOriginX[] = ['left', 'center', 'right'];
const originYArr: TOriginY[] = ['top', 'center', 'bottom'];

export function collectVerticalPoint(props: CollectPointProps) {
  const aligningLineMargin = aligningLineConfig.margin;
  const { activeObject, isScale, index, point, list } = props;
  const { dis, arr } = getDistanceList(point, list, 'x');
  const margin = aligningLineMargin / (activeObject.canvas?.getZoom() ?? 1);
  if (dis > margin) return [];
  let v = arr[arr.length - 1].x - point.x;
  const dir = index == 0 || index == 3 ? -1 : 1;
  v *= dir;

  const { width, scaleX, left } = activeObject;
  const dim = activeObject._getTransformedDimensions();
  const sx = (v + dim.x) / dim.x;
  if (isScale) activeObject.set('scaleX', scaleX * sx);
  else activeObject.set('width', width * sx);
  const dArr = [0, (v / 2) * dir, v * dir];
  if (dir < 0) dArr.reverse();
  const d = dArr[originXArr.indexOf(activeObject.originX)];
  activeObject.set('left', left + d);
  activeObject.setCoords();
  return arr.map((item) => ({
    x: item.x,
    y1: item.y,
    y2: point.y,
  }));
}

export function collectHorizontalPoint(props: CollectPointProps) {
  const aligningLineMargin = aligningLineConfig.margin;
  const { activeObject, isScale, index, point, list } = props;
  const { dis, arr } = getDistanceList(point, list, 'y');
  const margin = aligningLineMargin / (activeObject.canvas?.getZoom() ?? 1);
  if (dis > margin) return [];
  let v = arr[arr.length - 1].y - point.y;
  const dir = index < 2 ? -1 : 1;
  v *= dir;

  const { height, scaleY, top } = activeObject;
  const dim = activeObject._getTransformedDimensions();
  const sy = (v + dim.y) / dim.y;
  if (isScale) activeObject.set('scaleY', scaleY * sy);
  else activeObject.set('height', height * sy);
  const dArr = [0, (v / 2) * dir, v * dir];
  if (dir < 0) dArr.reverse();
  const d = dArr[originYArr.indexOf(activeObject.originY)];
  activeObject.set('top', top + d);
  activeObject.setCoords();
  return arr.map((item) => ({
    y: item.y,
    x1: item.x,
    x2: point.x,
  }));
}

function getDistanceList(point: Point, list: Point[], type: 'x' | 'y') {
  let dis = Infinity;
  let arr: Point[] = [];
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
  return { dis, arr };
}
