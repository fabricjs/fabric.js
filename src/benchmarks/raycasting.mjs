import { Object as FabricObject, Point } from '../../dist/index.mjs';

// SWAPPING OF RAY CASTING LOGIC IN #9381

// OLD CODE FOR REFERENCE AND IMPLEMENTATION TEST

// type TLineDescriptor = {
//   o: XY;
//   d: XY;
// };

// type TBBoxLines = {
//   topline: TLineDescriptor;
//   leftline: TLineDescriptor;
//   bottomline: TLineDescriptor;
//   rightline: TLineDescriptor;
// };

/**
 * Helper method to determine how many cross points are between the 4 object edges
 * and the horizontal line determined by a point on canvas
 * @private
 * @param {Point} point Point to check
 * @param {Object} lines Coordinates of the object being evaluated
 * @return {number} number of crossPoint
 */
const findCrossPoints = (point, lines) => {
  let xcount = 0;

  for (const lineKey in lines) {
    let xi;
    const iLine = lines[lineKey];
    // optimization 1: line below point. no cross
    if (iLine.o.y < point.y && iLine.d.y < point.y) {
      continue;
    }
    // optimization 2: line above point. no cross
    if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
      continue;
    }
    // optimization 3: vertical line case
    if (iLine.o.x === iLine.d.x && iLine.o.x >= point.x) {
      xi = iLine.o.x;
    }
    // calculate the intersection point
    else {
      const b1 = 0;
      const b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
      const a1 = point.y - b1 * point.x;
      const a2 = iLine.o.y - b2 * iLine.o.x;

      xi = -(a1 - a2) / (b1 - b2);
    }
    // don't count xi < point.x cases
    if (xi >= point.x) {
      xcount += 1;
    }
    // optimization 4: specific for square images (square or rects?)
    // todo remove this optimazion for
    if (xcount === 2) {
      break;
    }
  }
  return xcount;
};

/**
 * Method that returns an object with the object edges in it, given the coordinates of the corners
 * @private
 * @param {Object} aCoords Coordinates of the object corners
 */
const getImageLines = ({ tl, tr, bl, br }) => {
  const lines = {
    topline: {
      o: tl,
      d: tr,
    },
    rightline: {
      o: tr,
      d: br,
    },
    bottomline: {
      o: br,
      d: bl,
    },
    leftline: {
      o: bl,
      d: tl,
    },
  };

  return lines;
};

export const cornerPointContainsPoint = (point, cornerPoint) => {
  const xPoints = findCrossPoints(point, getImageLines(cornerPoint));
  // if xPoints is odd then point is inside the object
  return xPoints !== 0 && xPoints % 2 === 1;
};

// END OF OLD CODE

class Test1 extends FabricObject {
  containsPoint(point) {
    const [tl, tr, br, bl] = this.getCoords();
    return cornerPointContainsPoint(point, { tl, tr, br, bl });
  }
}

const rect1 = new Test1({
  left: 10,
  top: 10,
  width: 10,
  height: 10,
  angle: 15.5,
});

const rect2 = new FabricObject({
  left: 10,
  top: 10,
  width: 10,
  height: 10,
  angle: 15.5,
});

const points = Array(1_000_000)
  .fill(null)
  .map((_) => new Point(Math.random() * 40, Math.random() * 40));

const benchmark = (callback) => {
  const start = Date.now();
  callback();
  return Date.now() - start;
};

const benchmark1 = benchmark(() => {
  const newPoints = points.map((point) => ({ x: point.x, y: point.y }));
  newPoints.forEach((point) => rect1.containsPoint(point));
});

const benchmark2 = benchmark(() => {
  const newPoints = points.map((point) => new Point(point.x, point.y));
  newPoints.forEach((point) => rect2.containsPoint(point));
});

// eslint-disable-next-line no-restricted-syntax
console.log({
  benchmark1,
  benchmark2,
  bench1_run: benchmark1 / points.length,
  bench2_run: benchmark2 / points.length,
});
