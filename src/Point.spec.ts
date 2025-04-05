import { describe, expect, it } from 'vitest';
import { Point } from './Point';

describe('Point', () => {
  it('constructor & properties', () => {
    expect(Point).toBeTypeOf('function');

    const point = new Point();

    expect(point).toBeTruthy();
    expect(point).toBeInstanceOf(Point);
    expect(point.constructor === Point).toBeTruthy();
    expect(point.constructor).toBeTypeOf('function');
    expect(point.x, 'constructor assign x value').toBe(0);
    expect(point.y, 'constructor assign y value').toBe(0);

    const x = 5,
      y = 6;
    const point2 = new Point(x, y);
    expect(point2.x, 'constructor pass x value').toBe(x);
    expect(point2.y, 'constructor pass y value').toBe(y);
  });

  it('point add', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.add).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.add(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is not chainable').not.toBe(point);
    expect(returned.x, 'x coords should be added').toBe(x1 + x2);
    expect(returned.y, 'y coords should be added').toBe(y1 + y2);
    expect(point.x, 'point is not changed').toBe(x1);
    expect(point.y, 'point is not changed').toBe(y1);
    expect(point2.x, 'point 2 is not changed').toBe(x2);
    expect(point2.y, 'point 2 is not changed').toBe(y2);
  });

  it('point addEquals', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.addEquals).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.addEquals(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is chainable').toBe(point);
    expect(point.x, 'x coords should be added').toBe(x1 + x2);
    expect(point.y, 'y coords should be added').toBe(y1 + y2);
    expect(point2.x, 'point 2 is not changed').toBe(x2);
    expect(point2.y, 'point 2 is not changed').toBe(y2);
  });

  it('scalarAdd', () => {
    const x1 = 2,
      y1 = 3,
      scalar = 3;
    const point = new Point(x1, y1);

    expect(point.scalarAdd).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.scalarAdd(scalar);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is not chainable').not.toBe(point);
    expect(returned.x, 'x coords should be added').toBe(x1 + scalar);
    expect(returned.y, 'y coords should be added').toBe(y1 + scalar);
  });

  it('scalarAddEquals', () => {
    const x1 = 2,
      y1 = 3,
      scalar = 3;
    const point = new Point(x1, y1);

    expect(point.scalarAddEquals).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.scalarAddEquals(scalar);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is chainable').toBe(point);
    expect(point.x, 'x coords should be added').toBe(x1 + scalar);
    expect(point.y, 'y coords should be added').toBe(y1 + scalar);
  });

  it('point subtract', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.subtract).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.subtract(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is not chainable').not.toBe(point);
    expect(returned.x, 'x coords should be added').toBe(x1 - x2);
    expect(returned.y, 'y coords should be added').toBe(y1 - y2);
    expect(point.x, 'point is not changed').toBe(x1);
    expect(point.y, 'point is not changed').toBe(y1);
    expect(point2.x, 'point 2 is not changed').toBe(x2);
    expect(point2.y, 'point 2 is not changed').toBe(y2);
  });

  it('point subtractEquals', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.subtractEquals).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.subtractEquals(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is chainable').toBe(point);
    expect(point.x, 'x coords should be added').toBe(x1 - x2);
    expect(point.y, 'y coords should be added').toBe(y1 - y2);
    expect(point2.x, 'point 2 is not changed').toBe(x2);
    expect(point2.y, 'point 2 is not changed').toBe(y2);
  });

  it('scalarSubtract', () => {
    const x1 = 2,
      y1 = 3,
      scalar = 3;
    const point = new Point(x1, y1);

    expect(point.scalarSubtract).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.scalarSubtract(scalar);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is not chainable').not.toBe(point);
    expect(returned.x, 'x coords should be added').toBe(x1 - scalar);
    expect(returned.y, 'y coords should be added').toBe(y1 - scalar);
  });

  it('scalarSubtractEquals', () => {
    const x1 = 2,
      y1 = 3,
      scalar = 3;
    const point = new Point(x1, y1);

    expect(point.scalarSubtractEquals).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.scalarSubtractEquals(scalar);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is chainable').toBe(point);
    expect(point.x, 'x coords should be added').toBe(x1 - scalar);
    expect(point.y, 'y coords should be added').toBe(y1 - scalar);
  });

  it('multiply', () => {
    const a = new Point(2, 3),
      b = new Point(4, 5);

    expect(a.multiply).toBeTypeOf('function');
    const returned = a.multiply(b);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned.x, 'should be the product of the x coords').toBe(a.x * b.x);
    expect(returned.y, 'should be the product of the y coords').toBe(a.y * b.y);
  });

  it('scalarMultiply', () => {
    const x1 = 2,
      y1 = 3,
      scalar = 3;
    const point = new Point(x1, y1);

    expect(point.scalarMultiply).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.scalarMultiply(scalar);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is not chainable').not.toBe(point);
    expect(returned.x, 'x coords should be added').toBe(x1 * scalar);
    expect(returned.y, 'y coords should be added').toBe(y1 * scalar);
  });

  it('scalarMultiplyEquals', () => {
    const x1 = 2,
      y1 = 3,
      scalar = 3;
    const point = new Point(x1, y1);

    expect(point.scalarMultiplyEquals).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.scalarMultiplyEquals(scalar);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is chainable').toBe(point);
    expect(point.x, 'x coords should be added').toBe(x1 * scalar);
    expect(point.y, 'y coords should be added').toBe(y1 * scalar);
  });

  it('divide', () => {
    const a = new Point(2, 3),
      b = new Point(4, 5);

    expect(a.divide).toBeTypeOf('function');
    const returned = a.divide(b);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned.x, 'should be the quotient of the x coords').toBe(
      a.x / b.x,
    );
    expect(returned.y, 'should be the quotient of the y coords').toBe(
      a.y / b.y,
    );
  });

  it('scalarDivide', () => {
    const x1 = 2,
      y1 = 3,
      scalar = 3;
    const point = new Point(x1, y1);

    expect(point.scalarDivide).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.scalarDivide(scalar);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is not chainable').not.toBe(point);
    expect(returned.x, 'x coords should be added').toBe(x1 / scalar);
    expect(returned.y, 'y coords should be added').toBe(y1 / scalar);
  });

  it('scalarDivideEquals', () => {
    const x1 = 2,
      y1 = 3,
      scalar = 3;
    const point = new Point(x1, y1);

    expect(point.scalarDivideEquals).toBeTypeOf('function');
    expect(point.x, 'constructor pass x value').toBe(x1);
    expect(point.y, 'constructor pass y value').toBe(y1);
    const returned = point.scalarDivideEquals(scalar);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is chainable').toBe(point);
    expect(point.x, 'x coords should be added').toBe(x1 / scalar);
    expect(point.y, 'y coords should be added').toBe(y1 / scalar);
  });

  it('point eq', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point3 = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.eq).toBeTypeOf('function');
    expect(point.eq(point2), 'points are not equals').toBeFalsy();
    expect(point.eq(point), 'a point should be equal to itself').toBeTruthy();
    expect(
      point.eq(point3),
      'point constructed from save var are equals',
    ).toBeTruthy();
  });

  it('point lt', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.lt).toBeTypeOf('function');
    expect(point.x < point2.x, 'x1 should be less than x2').toBeTruthy();
    expect(point.y < point2.y, 'y1 should be less than y2').toBeTruthy();
    expect(point.lt(point2), 'point should be lt than point 2').toBeTruthy();
  });

  it('point gt', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.gt).toBeTypeOf('function');
    expect(point2.x > point.x, 'x1 should be gt than x2').toBeTruthy();
    expect(point2.y > point.y, 'y1 should be gt than y2').toBeTruthy();
    expect(point2.gt(point), 'point2 should be gt than point').toBeTruthy();
  });

  it('point lte', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point3 = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.lte).toBeTypeOf('function');
    expect(point.x <= point2.x, 'x1 should be less than x2').toBeTruthy();
    expect(point.y <= point2.y, 'y1 should be less than y2').toBeTruthy();
    expect(point.lte(point2), 'point should be lt than point 2').toBeTruthy();
    expect(point.x <= point3.x, 'x1 should be less than x2').toBeTruthy();
    expect(point.y <= point3.y, 'y1 should be less than y2').toBeTruthy();
    expect(
      point.eq(point3) && point.lte(point3),
      'lte return true on equal points',
    ).toBeTruthy();
    expect(point.lte(point), 'point is lte than itselft').toBeTruthy();
  });

  it('point gte', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point3 = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.gte).toBeTypeOf('function');
    expect(point2.x >= point.x, 'x1 should be greater than x2').toBeTruthy();
    expect(point2.y >= point.y, 'y1 should be greater than y2').toBeTruthy();
    expect(point2.gte(point), 'point2 should be gte than point').toBeTruthy();
    expect(point3.x >= point.x, 'x1 should be greater than x2').toBeTruthy();
    expect(point3.y >= point.y, 'y1 should be greater than y2').toBeTruthy();
    expect(
      point3.eq(point) && point3.gte(point),
      'gte returns true on equal points',
    ).toBeTruthy();
    expect(point.gte(point), 'point should be gte than itself').toBeTruthy();
  });

  it('point lerp', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.lerp).toBeTypeOf('function');
    const returned = point.lerp(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'not chainable').not.toBe(point);
    expect(returned.x, 'default is in the middle').toBe(
      point.x + (point2.x - point.x) / 2,
    );
    expect(returned.y, 'default is in the middle').toBe(
      point.y + (point2.y - point.y) / 2,
    );
    const returned2 = point.lerp(point2, 0);
    expect(returned2, '0 gives you the original point').toEqual(point);
    const returned3 = point.lerp(point2, 1);
    expect(returned3, '1 gives you the destination point').toEqual(point2);
    const returned4 = point.lerp(point2, -1);
    expect(returned4, '-1 < 0 so t = 0 gives you the original point').toEqual(
      point,
    );
    const returned5 = point.lerp(point2, 2);
    expect(returned5, '2 > 1 so t = 1 gives you the destination point').toEqual(
      point2,
    );
  });

  it('point distance from', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.distanceFrom).toBeTypeOf('function');
    const returned = point.distanceFrom(point2);
    expect(typeof returned, 'returns a number').toBe('number');
    expect(returned, 'return the geometric distance between coords').toBe(
      Math.sqrt(
        Math.pow(point2.x - point.x, 2) + Math.pow(point2.y - point.y, 2),
      ),
    );
  });

  it('midPointFrom', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 5;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.midPointFrom).toBeTypeOf('function');
    const returned = point.midPointFrom(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'not chainable').not.toBe(point);
    expect(returned.x, 'point.x is in the middle').toBe(
      point.x + (point2.x - point.x) / 2,
    );
    expect(returned.y, 'point.y is in the middle').toBe(
      point.y + (point2.y - point.y) / 2,
    );
  });

  it('min', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 1;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.min).toBeTypeOf('function');
    const returned = point.min(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'not chainable').not.toBe(point);
    expect(returned.x, 'point.x is the min from the points').toBe(
      Math.min(point.x, point2.x),
    );
    expect(returned.y, 'point.y is the min from the points').toBe(
      Math.min(point.y, point2.y),
    );
  });

  it('max', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 1;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.max).toBeTypeOf('function');
    const returned = point.max(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'not chainable').not.toBe(point);
    expect(returned.x, 'point.x is the max from the points').toBe(
      Math.max(point.x, point2.x),
    );
    expect(returned.y, 'point.y is the max from the points').toBe(
      Math.max(point.y, point2.y),
    );
  });

  it('toString', () => {
    const x1 = 2,
      y1 = 3;
    const point = new Point(x1, y1);

    expect(point.toString).toBeTypeOf('function');
    const returned = point.toString();
    expect(typeof returned, 'returns a string').toBe('string');
    expect(returned, 'coords concat with ,').toBe(point.x + ',' + point.y);
  });

  it('setXY', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 8;
    const point = new Point(x1, y1);

    expect(point.setXY).toBeTypeOf('function');
    const returned = point.setXY(x2, y2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'chainable').toBe(point);
    expect(returned.x, 'it changed x property').toBe(x2);
    expect(returned.y, 'it changed x property').toBe(y2);
  });

  it('setX', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4;
    const point = new Point(x1, y1);

    expect(point.setX).toBeTypeOf('function');
    const returned = point.setX(x2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'chainable').toBe(point);
    expect(returned.x, 'it changed x property').toBe(x2);
  });

  it('setY', () => {
    const x1 = 2,
      y1 = 3,
      y2 = 8;
    const point = new Point(x1, y1);

    expect(point.setY).toBeTypeOf('function');
    const returned = point.setY(y2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'chainable').toBe(point);
    expect(returned.y, 'it changed y property').toBe(y2);
  });

  it('setFromPoint', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 8;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.setFromPoint).toBeTypeOf('function');
    const returned = point.setFromPoint(point2);
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'chainable').toBe(point);
    expect(returned.x, 'it changed x property').toBe(point2.x);
    expect(returned.y, 'it changed x property').toBe(point2.y);
  });

  it('swap', () => {
    const x1 = 2,
      y1 = 3,
      x2 = 4,
      y2 = 8;
    const point = new Point(x1, y1);
    const point2 = new Point(x2, y2);

    expect(point.swap).toBeTypeOf('function');
    const returned = point.swap(point2);
    expect(returned, 'it does not return anything').toBe(undefined);
    expect(point.x, 'swapped x').toBe(x2);
    expect(point.y, 'swapped y').toBe(y2);
    expect(point2.x, 'swapped x').toBe(x1);
    expect(point2.y, 'swapped y').toBe(y1);
  });

  it('clone', () => {
    const x1 = 2,
      y1 = 3;
    const point = new Point(x1, y1);

    expect(point.clone).toBeTypeOf('function');
    const returned = point.clone();
    expect(returned, 'returns a point class').toBeInstanceOf(Point);
    expect(returned, 'is not chainable').not.toBe(point);
    expect(returned.x, 'x coords should be same').toBe(point.x);
    expect(returned.y, 'y coords should be same').toBe(point.y);
  });

  it('rotate', () => {
    const point = new Point(5, 1);
    const rotated = point.rotate(Math.PI);
    expect(rotated.x, 'rotated x').toBe(-5);
    expect(rotated.y, 'rotated y').toBe(-1);
  });

  it('rotate with origin point', () => {
    const point = new Point(5, 1);
    const rotated = point.rotate(Math.PI, new Point(4, 1));
    expect(rotated.x, 'rotated x around 4').toBe(3);
    expect(rotated.y, 'rotated y around 1').toBe(1);
  });
});
