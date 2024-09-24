/* eslint-disable no-restricted-syntax */
import { util, Point } from '../../dist/index.mjs';

const makeBBoxOld = (points) => {
  if (points.length === 0) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
  }

  const { min, max } = points.reduce(
    ({ min, max }, curr) => {
      return {
        min: min.min(curr),
        max: max.max(curr),
      };
    },
    { min: new Point(points[0]), max: new Point(points[0]) },
  );

  const size = max.subtract(min);

  return {
    left: min.x,
    top: min.y,
    width: size.x,
    height: size.y,
  };
};

const size = 10000;
const arraySize = 6000;

const points = new Array(arraySize)
  .fill(0)
  .map(
    () => new Point((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000),
  );

const benchmark = (callback) => {
  const start = Date.now();
  callback();
  return Date.now() - start;
};

const fabric = benchmark(() => {
  for (let i = 0; i < size; i++) {
    util.makeBoundingBoxFromPoints(points);
  }
});

const older = benchmark(() => {
  for (let i = 0; i < size; i++) {
    makeBBoxOld(points);
  }
});

console.log({
  fabric,
  older,
});

/**
 * On Node 20 macbook pro m1
 * { fabric: 139, older: 1089 }
 */
