import { Canvas, Point, Rect, type RectProps, type Transform } from 'fabric';
import { degreesToRadians, saveObjectTransform } from '../util';
import { CENTER } from '../constants';
import { scalingX, scalingY } from './scale';

//
// prep for tests
//
const createZeroThickRectangleScalingItems = (
  rectOptions: { width: number; height: number } & Partial<RectProps>,
  pointDiff: Point
) => {
  // create rect
  const target = new Rect({
    strokeWidth: 0,
    stroke: 'black',
  });
  // create mouse pointer that moves the second point slightly
  const pointer = new Point(
    rectOptions.height / 2,
    rectOptions.width / 2
  ).subtract(pointDiff);
  // add rect to canvas or we get undefined issues
  const canvas = new Canvas('canvas', { width: 100, height: 100 });
  canvas.add(target);

  // create transform event based on polyline
  const corner = 'mt';
  const transform: Transform = {
    target: target,
    action: target.controls[corner].actionName,
    actionHandler: target.controls[corner].actionHandler,
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
  };
  // create empty mouse event as our tests don't care about it
  const moveEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
  // return items used by our action handler
  return { moveEvent, transform, pointer };
};

//
// actual tests
//
describe('Controls', () => {
  it('adjusts a 0 width rect for polyActionhandler without it returning Infinity/NaN', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } =
      createZeroThickRectangleScalingItems(
        { width: 0, height: 60 },
        new Point(1, 0)
      );

    scalingX(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Rect).scaleX).not.toBeNaN();
    expect((transform.target as Rect).scaleX).not.toBe(
      Number.POSITIVE_INFINITY
    );
  });
  it('adjusts a 0 height rect for polyActionhandler without it returning Infinity/NaN', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } =
      createZeroThickRectangleScalingItems(
        { width: 60, height: 0 },
        new Point(0, 1)
      );

    scalingY(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Rect).scaleY).not.toBeNaN();
    expect((transform.target as Rect).scaleY).not.toBe(
      Number.POSITIVE_INFINITY
    );
  });
});
