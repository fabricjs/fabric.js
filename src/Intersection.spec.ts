import { Intersection } from './Intersection';
import { Point } from './Point';

describe('Intersection', () => {
  test.each([
    [new Point(), true],
    [new Point().add(new Point(Number.EPSILON, 0)), true],
    [new Point().add(new Point(0, Number.EPSILON)), true],
    [new Point().add(new Point(-Number.EPSILON, 0)), false],
    [new Point().add(new Point(0, -Number.EPSILON)), false],
    [new Point().add(new Point(-Number.EPSILON, Number.EPSILON)), false],
    [new Point().add(new Point(Number.EPSILON, -Number.EPSILON)), false],
    [new Point().add(new Point(Number.EPSILON, Number.EPSILON)), true],
    [new Point().add(new Point(-Number.EPSILON, -Number.EPSILON)), false],

    [new Point(1, 0), true],
    [new Point(1, 0).add(new Point(Number.EPSILON, 0)), false],
    [new Point(1, 0).add(new Point(0, Number.EPSILON)), true],
    [new Point(1, 0).add(new Point(-Number.EPSILON, 0)), true],
    [new Point(1, 0).add(new Point(0, -Number.EPSILON)), false],
    [new Point(1, 0).add(new Point(-Number.EPSILON, Number.EPSILON)), true],
    [new Point(1, 0).add(new Point(Number.EPSILON, -Number.EPSILON)), false],
    [new Point(1, 0).add(new Point(Number.EPSILON, Number.EPSILON)), false],
    [new Point(1, 0).add(new Point(-Number.EPSILON, -Number.EPSILON)), false],

    [new Point(1, 1), true],
    [new Point(1, 1).add(new Point(Number.EPSILON, 0)), false],
    [new Point(1, 1).add(new Point(0, Number.EPSILON)), false],
    [new Point(1, 1).add(new Point(-Number.EPSILON, 0)), true],
    [new Point(1, 1).add(new Point(0, -Number.EPSILON)), true],
    [new Point(1, 1).add(new Point(-Number.EPSILON, Number.EPSILON)), false],
    [new Point(1, 1).add(new Point(Number.EPSILON, -Number.EPSILON)), false],
    [new Point(1, 1).add(new Point(Number.EPSILON, Number.EPSILON)), false],
    [new Point(1, 1).add(new Point(-Number.EPSILON, -Number.EPSILON)), true],

    [new Point(0, 1), true],
    [new Point(0, 1).add(new Point(Number.EPSILON, 0)), true],
    [new Point(0, 1).add(new Point(0, Number.EPSILON)), false],
    [new Point(0, 1).add(new Point(-Number.EPSILON, 0)), false],
    [new Point(0, 1).add(new Point(0, -Number.EPSILON)), true],
    [new Point(0, 1).add(new Point(-Number.EPSILON, Number.EPSILON)), false],
    [new Point(0, 1).add(new Point(Number.EPSILON, -Number.EPSILON)), true],
    [new Point(0, 1).add(new Point(Number.EPSILON, Number.EPSILON)), false],
    [new Point(0, 1).add(new Point(-Number.EPSILON, -Number.EPSILON)), false],

    [new Point(0.5, 0.5), true],
    [new Point(0.5, 0.5).add(new Point(Number.EPSILON, 0)), true],
    [new Point(0.5, 0.5).add(new Point(0, Number.EPSILON)), true],
    [new Point(0.5, 0.5).add(new Point(-Number.EPSILON, 0)), true],
    [new Point(0.5, 0.5).add(new Point(0, -Number.EPSILON)), true],
    [new Point(0.5, 0.5).add(new Point(-Number.EPSILON, Number.EPSILON)), true],
    [new Point(0.5, 0.5).add(new Point(Number.EPSILON, -Number.EPSILON)), true],
    [new Point(0.5, 0.5).add(new Point(Number.EPSILON, Number.EPSILON)), true],
    [
      new Point(0.5, 0.5).add(new Point(-Number.EPSILON, -Number.EPSILON)),
      true,
    ],
  ] as const)('%p is in polygon %p, case index %#', (point, result) => {
    const polygon = [
      new Point(),
      new Point(1, 0),
      new Point(1, 1),
      new Point(0, 1),
    ];
    expect(Intersection.isPointInPolygon(point, polygon)).toBe(result);
  });
});
