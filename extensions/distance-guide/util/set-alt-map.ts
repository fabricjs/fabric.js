import type { FabricObject, TBBox } from 'fabric';
import { Point, util } from 'fabric';
import type { DistanceGuide } from '..';

export function setAltMap(
  this: DistanceGuide,
  origin?: FabricObject,
  target?: FabricObject,
) {
  this.altMap = getAltMap(origin, target);
}
function getAltMap(origin?: FabricObject, target?: FabricObject) {
  if (!origin || !target) return;
  if (origin == target) return;

  const o = util.makeBoundingBoxFromPoints(origin.getCoords());
  const t = util.makeBoundingBoxFromPoints(target.getCoords());
  const points = getPoints(o, t);

  return { target: t, origin: o, points };
}

function getPoints(originBox: TBBox, targetBox: TBBox) {
  const acMap = {
    top: new Point(originBox.left + originBox.width / 2, originBox.top),
    right: new Point(
      originBox.left + originBox.width,
      originBox.top + originBox.height / 2,
    ),
    bottom: new Point(
      originBox.left + originBox.width / 2,
      originBox.top + originBox.height,
    ),
    left: new Point(originBox.left, originBox.top + originBox.height / 2),
  };
  // tl, tr, br, bl
  const targetMap = [
    new Point(targetBox.left, targetBox.top),
    new Point(targetBox.left + targetBox.width, targetBox.top),
    new Point(
      targetBox.left + targetBox.width,
      targetBox.top + targetBox.height,
    ),
    new Point(targetBox.left, targetBox.top + targetBox.height),
  ];

  const list = [];
  for (let i = 0; i < targetMap.length; i++) {
    const dis = getDisByPoint(acMap, targetMap[i], i);
    list.push({ ...dis, target: targetMap[i] });
  }
  let arr = list.filter((x) => x.disX >= 0 && x.disY >= 0);
  if (arr.length == 0) arr = list.filter((x) => x.disX >= 0 || x.disY >= 0);

  return arr.filter(({ xPoint, yPoint, target }) => ({
    xPoint,
    yPoint,
    target,
  }));
}

type AcMap = {
  [key: string]: Point;
};
function getDisByPoint(acMap: AcMap, p: Point, n: number) {
  const xFlag = n == 0 || n == 3;
  const yFlag = n < 2;
  let xPoint = xFlag ? acMap.right : acMap.left;
  let disX = xFlag ? p.x - xPoint.x : xPoint.x - p.x;
  if (disX < 0) {
    xPoint = xFlag ? acMap.left : acMap.right;
    disX = xFlag ? p.x - xPoint.x : xPoint.x - p.x;
  }

  let yPoint = yFlag ? acMap.bottom : acMap.top;
  let disY = yFlag ? p.y - yPoint.y : yPoint.y - p.y;
  if (disY < 0) {
    yPoint = yFlag ? acMap.top : acMap.bottom;
    disY = yFlag ? p.y - yPoint.y : yPoint.y - p.y;
  }

  return { xPoint, yPoint, disX, disY };
}
