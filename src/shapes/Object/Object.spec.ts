import { Point } from '../../Point';
import { iMatrix } from '../../constants';
import type { TMat2D } from '../../typedefs';
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

  describe('geometry', () => {
    test.each(
      (
        [
          [
            {},
            [
              new Point(40, 30),
              new Point(52, 30),
              new Point(52, 47),
              new Point(40, 47),
            ],
          ],
          [
            { angle: 20 },
            [
              new Point(40, 30),
              new Point(51.2763114494309, 34.104241719908025),
              new Point(45.46196901289453, 50.079016273268465),
              new Point(34.18565756346363, 45.97477455336044),
            ],
          ],
          [
            { skewX: 45 },
            [
              new Point(40, 30),
              new Point(69, 30),
              new Point(69, 47),
              new Point(40, 47),
            ],
          ],
          [
            { skewY: 45 },
            [
              new Point(40, 30),
              new Point(52, 30),
              new Point(52, 59),
              new Point(40, 59),
            ],
          ],
          [
            { skewY: 45, skewX: 30, angle: 90 },
            [
              new Point(40, 30),
              new Point(40, 58.74315780649914),
              new Point(11, 58.74315780649914),
              new Point(11, 30),
            ],
          ],
        ] as const
      )
        .map(
          ([options, expected]) =>
            [
              [options, undefined, expected],
              [options, [2, 0, 0, 2, 35, 35] as TMat2D, expected],
            ] as const
        )
        .flat()
    )(
      'getCoords %p and viewportTransform of %p',
      (options, viewportTransform = iMatrix, expected) => {
        const object = new FabricObject({
          width: 10,
          height: 15,
          strokeWidth: 2,
          top: 30,
          left: 40,
          ...options,
        });
        jest
          .spyOn(object, 'getViewportTransform')
          .mockReturnValue(viewportTransform);

        const coords = object.getCoords();
        expect(coords).toEqual(expected);

        object.left += 5;
        expect(object.getCoords()).toEqual(coords);

        object.setCoords();
        expect(object.getCoords()).toEqual(
          expected.map((point) => point.add(new Point(5, 0)))
        );
      }
    );
  });
});
