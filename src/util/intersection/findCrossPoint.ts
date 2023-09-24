import type { XY } from '../../Point';
import type { TCornerPoint } from '../../typedefs';

// TODO: the file is to be REMOVED

type TLineDescriptor = {
  o: XY;
  d: XY;
};

export type TBBoxLines = {
  topline: TLineDescriptor;
  leftline: TLineDescriptor;
  bottomline: TLineDescriptor;
  rightline: TLineDescriptor;
};

/**
 * Helper method to determine how many cross points are between the 4 object edges
 * and the horizontal line determined by a point on canvas
 * @private
 * @param {Point} point Point to check
 * @param {Object} lines Coordinates of the object being evaluated
 * @return {number} number of crossPoint
 */
const findCrossPoints = (point: XY, lines: TBBoxLines): number => {
  let xcount = 0;

  for (const lineKey in lines) {
    let xi;
    const iLine = lines[lineKey as keyof TBBoxLines];
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
 * @param {Object} lineCoords or aCoords Coordinates of the object corners
 */
const getImageLines = ({ tl, tr, bl, br }: TCornerPoint): TBBoxLines => {
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

  // // debugging
  // if (this.canvas.contextTop) {
  //   this.canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
  //   this.canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
  //
  //   this.canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
  //   this.canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
  //
  //   this.canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
  //   this.canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
  //
  //   this.canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
  //   this.canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);
  // }

  return lines;
};

export const cornerPointContainsPoint = (
  point: XY,
  cornerPoint: TCornerPoint
): boolean => {
  const xPoints = findCrossPoints(point, getImageLines(cornerPoint));
  // if xPoints is odd then point is inside the object
  return xPoints !== 0 && xPoints % 2 === 1;
};
