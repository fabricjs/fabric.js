import { Canvas, Point, Rect, type RectProps } from 'fabric';
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
    ...rectOptions,
  });
  // add rect to canvas or we get undefined issues
  const canvas = new Canvas('canvas', { width: 100, height: 100 });
  canvas.add(target);

  // create mouse event near center of rect, as the 0 size will put it on the middle scaler
  const canvasOffset = canvas.calcOffset();
  const moveEvent = new MouseEvent('mousemove', {
    clientX: canvasOffset.left + target.left + target.width / 2 - pointDiff.x,
    clientY: canvasOffset.top + target.top + target.height / 2 - pointDiff.y,
  });
  canvas.setActiveObject(target);
  target.__corner = target._findTargetCorner(
    canvas.getViewportPoint(moveEvent)
  );
  canvas._setupCurrentTransform(moveEvent, target, false);
  const transform = canvas._currentTransform!;
  const pointer = canvas.getScenePoint(moveEvent);

  // return items used by our action handler
  return { moveEvent, transform, pointer };
};

//
// actual tests
//
describe('Scale', () => {
  it('adjusts a 0 width rect for polyActionhandler without it returning Infinity/NaN', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } =
      createZeroThickRectangleScalingItems(
        { width: 0, height: 60 },
        new Point(1, 0)
      );

    const didScale = scalingX(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Rect).scaleX).not.toBeNaN();
    expect((transform.target as Rect).scaleX).not.toBe(
      Number.POSITIVE_INFINITY
    );
    expect(didScale).toBe(false);
  });
  it('adjusts a 0 height rect for polyActionhandler without it returning Infinity/NaN', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } =
      createZeroThickRectangleScalingItems(
        { width: 60, height: 0 },
        new Point(0, 1)
      );

    const didScale = scalingY(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Rect).scaleY).not.toBeNaN();
    expect((transform.target as Rect).scaleY).not.toBe(
      Number.POSITIVE_INFINITY
    );
    expect(didScale).toBe(false);
  });
});
