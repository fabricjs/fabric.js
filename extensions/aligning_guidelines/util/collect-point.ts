import type { FabricObject, Point, TOriginX, TOriginY } from 'fabric';
import { aligningLineConfig } from '../constant';
import { getDistanceList } from './basic';
import type { LineProps } from '../typedefs';

type CollectPointProps = {
  target: FabricObject;
  /** Operation points of the target element: top-left, bottom-left, top-right, bottom-right */
  point: Point;
  /** Position using diagonal points when resizing/scaling. */
  diagonalPoint: Point;
  /** Set of points to consider for alignment: [tl, tr, br, bl, center] */
  list: Point[];
  /** Change the zoom or change the size, determine by whether e.transform.action starts with the string "scale" */
  isScale: boolean;
  /** Whether to change uniformly is determined by canvas.uniformScaling and canvas.uniScaleKey. */
  isUniform: boolean;
  /** tl、tr、br、bl、mt、mr、mb、ml */
  corner: string;
};
// Position using diagonal points when resizing/scaling
const originMap: { [props: string]: [TOriginX, TOriginY] } = {
  tl: ['right', 'bottom'],
  tr: ['left', 'bottom'],
  br: ['left', 'top'],
  bl: ['right', 'top'],
  mt: ['center', 'bottom'],
  mr: ['left', 'center'],
  mb: ['center', 'top'],
  ml: ['right', 'center'],
};
export function collectVerticalPoint(props: CollectPointProps): LineProps[] {
  const { target, isScale, isUniform, corner, point, diagonalPoint, list } =
    props;
  const { dis, arr } = getDistanceList(point, list, 'x');
  const margin = aligningLineConfig.margin / (target.canvas?.getZoom() ?? 1);
  if (dis > margin) return [];
  let v = arr[arr.length - 1].x - point.x;
  // tl bl ml
  // If modifying on the left side, the size decreases; conversely, it increases.
  const dirX = corner.includes('l') ? -1 : 1;
  v *= dirX;

  const { width, height, scaleX, scaleY } = target;
  // Because when modifying through the center point, isUniform is always false, so skew does not need to be considered.
  const dStrokeWidth = target.strokeUniform ? 0 : target.strokeWidth;
  const scaleWidth = scaleX * width + dStrokeWidth;
  const sx = (v + scaleWidth) / scaleWidth;
  // When the value of v is very small, the value of sx may be 0.
  if (sx == 0) return [];
  if (isScale) {
    target.set('scaleX', scaleX * sx);
    if (isUniform) target.set('scaleY', scaleY * sx);
  } else {
    target.set('width', width * sx);
    if (isUniform) target.set('height', height * sx);
  }
  const originArr = aligningLineConfig.contraryOriginMap ?? originMap;
  target.setRelativeXY(diagonalPoint, ...originArr[corner]);
  target.setCoords();
  return arr.map((target) => ({ origin: point, target }));
}

export function collectHorizontalPoint(props: CollectPointProps): LineProps[] {
  const { target, isScale, isUniform, corner, point, diagonalPoint, list } =
    props;
  const { dis, arr } = getDistanceList(point, list, 'y');
  const margin = aligningLineConfig.margin / (target.canvas?.getZoom() ?? 1);
  if (dis > margin) return [];
  let v = arr[arr.length - 1].y - point.y;
  // tl mt tr
  // If modifying on the top side, the size decreases; conversely, it increases.
  const dirY = corner.includes('t') ? -1 : 1;
  v *= dirY;

  const { width, height, scaleX, scaleY } = target;
  // Because when modifying through the center point, isUniform is always false, so skew does not need to be considered.
  const dStrokeWidth = target.strokeUniform ? 0 : target.strokeWidth;
  const scaleHeight = scaleY * height + dStrokeWidth;
  const sy = (v + scaleHeight) / scaleHeight;
  // When the value of v is very small, the value of sy may be 0.
  if (sy == 0) return [];
  if (isScale) {
    target.set('scaleY', scaleY * sy);
    if (isUniform) target.set('scaleX', scaleX * sy);
  } else {
    target.set('height', height * sy);
    if (isUniform) target.set('width', width * sy);
  }
  const originArr = aligningLineConfig.contraryOriginMap ?? originMap;
  target.setRelativeXY(diagonalPoint, ...originArr[corner]);
  target.setCoords();
  return arr.map((target) => ({ origin: point, target }));
}
