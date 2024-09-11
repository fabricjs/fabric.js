import type {
  FabricObject,
  Point,
  TCornerPoint,
  TOriginX,
  TOriginY,
} from 'fabric';
import { aligningLineConfig } from '../constant';
import { getDistance } from './basic';

type CollectPointProps = {
  activeObject: FabricObject;
  /** Operation points of the target element: top-left, bottom-left, top-right, bottom-right */
  point: Point;
  /** Set of points to consider for alignment: [tl, tr, br, bl, center] */
  list: Point[];
  /** Change the zoom or change the size, determine by whether e.transform.action starts with the string "scale" */
  isScale: boolean;
  /** Whether to change uniformly is determined by canvas.uniformScaling and canvas.uniScaleKey. */
  isUniform: boolean;
  /** Which specific point to operate on, 0-3 correspond to top-left, top-right, bottom-right, bottom-left */
  index: number;
};
const coordsArr: Array<keyof TCornerPoint> = ['br', 'bl', 'tl', 'tr'];
const originArr: [TOriginX, TOriginY][] = [
  ['right', 'bottom'],
  ['left', 'bottom'],
  ['left', 'top'],
  ['right', 'top'],
];
export function collectVerticalPoint(props: CollectPointProps) {
  const aligningLineMargin = aligningLineConfig.margin;
  const { activeObject, isScale, isUniform, index, point, list } = props;
  const { dis, arr } = getDistanceList(point, list, 'x');
  const margin = aligningLineMargin / (activeObject.canvas?.getZoom() ?? 1);
  if (dis > margin) return [];
  let v = arr[arr.length - 1].x - point.x;
  // To the left or to the right?
  const dirX = index == 0 || index == 3 ? -1 : 1;
  v *= dirX;

  const { width, height, scaleX, scaleY } = activeObject;
  const dim = activeObject._getTransformedDimensions();
  const sx = (v + dim.x) / dim.x;
  const aCoords = activeObject.aCoords ?? activeObject.calcACoords();
  const diagonalPoint = aCoords[coordsArr[index]];
  if (isScale) {
    activeObject.set('scaleX', scaleX * sx);
    if (isUniform) activeObject.set('scaleY', scaleY * sx);
  } else {
    activeObject.set('width', width * sx);
    if (isUniform) activeObject.set('height', height * sx);
  }
  activeObject.setRelativeXY(
    diagonalPoint,
    originArr[index][0],
    originArr[index][1]
  );
  activeObject.setCoords();
  return arr.map((item) => ({
    x: item.x,
    y1: item.y,
    y2: point.y,
  }));
}

export function collectHorizontalPoint(props: CollectPointProps) {
  const aligningLineMargin = aligningLineConfig.margin;
  const { activeObject, isScale, isUniform, index, point, list } = props;
  const { dis, arr } = getDistanceList(point, list, 'y');
  const margin = aligningLineMargin / (activeObject.canvas?.getZoom() ?? 1);
  if (dis > margin) return [];
  let v = arr[arr.length - 1].y - point.y;
  // To the top or to the bottom?
  const dirY = index < 2 ? -1 : 1;
  v *= dirY;

  const { width, height, scaleX, scaleY } = activeObject;
  const dim = activeObject._getTransformedDimensions();
  const sy = (v + dim.y) / dim.y;
  const aCoords = activeObject.aCoords ?? activeObject.calcACoords();
  const diagonalPoint = aCoords[coordsArr[index]];
  if (isScale) {
    activeObject.set('scaleY', scaleY * sy);
    if (isUniform) activeObject.set('scaleX', scaleX * sy);
  } else {
    activeObject.set('height', height * sy);
    if (isUniform) activeObject.set('width', width * sy);
  }
  activeObject.setRelativeXY(
    diagonalPoint,
    originArr[index][0],
    originArr[index][1]
  );
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
