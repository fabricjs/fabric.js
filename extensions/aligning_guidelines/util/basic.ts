import type { FabricObject, Point } from 'fabric';

export function getDistance(a: number, b: number) {
  return Math.abs(a - b);
}

export function setPositionDir(
  target: FabricObject,
  pos: Point,
  dir: 'x' | 'y',
) {
  const center = target.translateToCenterPoint(pos, 'center', 'center');
  const position = target.translateToOriginPoint(
    center,
    target.originX,
    target.originY,
  );
  if (dir == 'x') target.setX(position.x);
  else target.setY(position.y);
}
