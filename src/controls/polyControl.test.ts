import { Point, Polyline, type Transform } from 'fabric';
import { degreesToRadians, saveObjectTransform } from '../util';
import {
  createPolyControls,
  factoryPolyActionHandler,
  polyActionHandler,
} from './polyControl';
import { CENTER } from '../constants';

//
// prep for tests
//
const createPolylineMovementItems = (points: Point[], pointDiff: Point) => {
  // create polyline with controls
  const target = new Polyline(points, {
    stroke: 'black',
    strokeWidth: 0,
    originX: 'center',
    originY: 'center',
    strokeUniform: false,
    exactBoundingBox: false,
  });
  const controls = createPolyControls(target);
  target.controls = controls;
  const corner = 'p1';
  // create mouse pointer that moves the second point slightly
  const pointer = new Point(target.points[1]).subtract(pointDiff);

  // create transform event based on polyline
  const transform: Transform & { pointIndex: number } = {
    target: target,
    action: controls[corner].actionName,
    actionHandler: controls[corner].actionHandler,
    actionPerformed: false,
    corner,
    scaleX: target.scaleX,
    scaleY: target.scaleY,
    skewX: target.skewX,
    skewY: target.skewY,
    offsetX: pointer.x - target.left,
    offsetY: pointer.y - target.top,
    originX: CENTER,
    originY: CENTER,
    ex: pointer.x,
    ey: pointer.y,
    lastX: pointer.x,
    lastY: pointer.y,
    theta: degreesToRadians(target.angle),
    width: target.width,
    height: target.height,
    shiftKey: false,
    altKey: false,
    original: {
      ...saveObjectTransform(target),
      originX: CENTER,
      originY: CENTER,
    },
    pointIndex: 1,
  };
  // create empty mouse event as our tests don't care about it
  const moveEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
  // return items used by our action handler
  return { moveEvent, transform, pointer };
};

//
// actual tests
//
describe('polyControl', () => {
  it('adjusts a 0 width poly for polyActionhandler without it returning NaN', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } = createPolylineMovementItems(
      [new Point(20, 20), new Point(20, 80)],
      new Point(1, 0)
    );

    polyActionHandler(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Polyline).points[1].x).not.toBeFalsy();
  });
  it('adjusts a 0 height poly for polyActionhandler without it returning NaN', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } = createPolylineMovementItems(
      [new Point(20, 20), new Point(80, 20)],
      new Point(0, 1)
    );

    polyActionHandler(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Polyline).points[1].y).not.toBeFalsy();
  });
  it('adjusts a 0 width poly for polyActionhandler without it returning NaN', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } = createPolylineMovementItems(
      [new Point(20, 20), new Point(20, 80)],
      new Point(1, 0)
    );

    const generatedFunction = factoryPolyActionHandler(1, () => false);
    generatedFunction(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Polyline).left).not.toBeFalsy();
  });
  it('adjusts a 0 height poly for factoryPolyActionHandler without it returning NaN', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } = createPolylineMovementItems(
      [new Point(20, 20), new Point(80, 20)],
      new Point(0, 1)
    );

    const generatedFunction = factoryPolyActionHandler(1, () => false);
    generatedFunction(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Polyline).top).not.toBeFalsy();
  });
});
