import { Intersection } from '../../Intersection';
import { Point } from '../../Point';
import { cornerPointContainsPoint } from '../../util/intersection/findCrossPoint';
import { FabricObject } from './Object';

describe('Object', () => {
  it('rotate with centered rotation', () => {
    const fObj = new FabricObject({
      centeredRotation: true,
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // test that top changed because of centered rotation
    expect(fObj.top).toBe(10);
    // test that left changed because of centered rotation
    expect(fObj.left).toBe(10);
  });
  it('rotate with origin rotation', () => {
    const fObj = new FabricObject({
      centeredRotation: false,
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // top and left are still 0, 0
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
  });
  it('rotate with centered rotation but origin set to center', () => {
    const fObj = new FabricObject({
      centeredRotation: true,
      originX: 'center',
      originY: 'center',
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // test that left is unchanged because of origin being center
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
  });

  test('benchmark containsPoint, raw casting a rect', () => {
    class Test1 extends FabricObject {
      containsPoint(
        point: Point,
        absolute?: boolean,
        calculate?: boolean
      ): boolean {
        return cornerPointContainsPoint(
          point,
          this._getCoords(absolute, calculate)
        );
      }
    }

    class Test2 extends FabricObject {
      containsPoint(
        point: Point,
        absolute?: boolean,
        calculate?: boolean
      ): boolean {
        return Intersection.isPointInPolygon(
          point,
          this.getCoords(absolute, calculate)
        );
      }
    }

    const rect1 = new Test1({
      left: 10,
      top: 10,
      width: 10,
      height: 10,
      angle: 15.5,
    });

    const rect2 = new Test2({
      left: 10,
      top: 10,
      width: 10,
      height: 10,
      angle: 15.5,
    });

    const points = Array(10_000)
      .fill(null)
      .map(
        (_, index) => new Point(Math.random() * index, Math.random() * index)
      );

    const benchmark = (callback: VoidFunction) => {
      const start = Date.now();
      callback();
      return Date.now() - start;
    };

    const benchmark1 = benchmark(() =>
      points.forEach((point) => rect1.containsPoint(point))
    );

    const benchmark2 = benchmark(() =>
      points.forEach((point) => rect2.containsPoint(point))
    );

    expect(benchmark2).toBeLessThan(benchmark1);
  });
});
