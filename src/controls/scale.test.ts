import { Point } from '../Point';
import { Canvas } from '../canvas/Canvas';
import { Rect } from '../shapes/Rect';
import type { RectProps } from '../shapes/Rect';
import { scalingX, scalingY } from './scale';

//
// prep for tests
//
const createZeroThickRectangleScalingItems = (
  rectOptions: { width: number; height: number } & Partial<RectProps>,
  usedCorner: keyof Rect['oCoords'],
  pointDiff: Point,
) => {
  const extraMargin = 100;
  const { width, height } = rectOptions;

  // create canvas as large as the rect + margin
  const canvas = new Canvas('canvas', {
    width: width + extraMargin,
    height: height + extraMargin,
  });

  // create rect in the center of rect
  const target = new Rect({
    strokeWidth: 0,
    stroke: 'black',
    ...rectOptions,
    left: (width + extraMargin) / 2,
    top: (height + extraMargin) / 2,
    originX: 'center',
    originY: 'center',
  });

  // add rect to canvas or we get undefined issues
  canvas.add(target);

  // create mouse event near center of rect, as the 0 size will put it on the middle scaler
  const canvasOffset = canvas.calcOffset();

  const mouseDown = new MouseEvent('mousedown', {
    clientX: canvasOffset.left + target.oCoords[usedCorner].x,
    clientY: canvasOffset.top + target.oCoords[usedCorner].y,
  });

  const moveEvent = new MouseEvent('mousemove', {
    clientX: canvasOffset.left + target.oCoords[usedCorner].x + pointDiff.x,
    clientY: canvasOffset.top + target.oCoords[usedCorner].y + pointDiff.y,
  });

  canvas.setActiveObject(target);
  target.__corner = usedCorner;
  canvas._setupCurrentTransform(mouseDown, target, false);
  const transform = canvas._currentTransform!;
  const pointer = canvas.getScenePoint(moveEvent);

  // return items used by our action handler
  return { moveEvent, transform, pointer, target };
};

//
// actual tests
//
describe('Scale', () => {
  it('adjusts a 0 width rect for polyActionhandler without it returning Infinity/NaN side scale', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer, target } =
      createZeroThickRectangleScalingItems(
        { width: 0, height: 60 },
        'mr',
        new Point(20, 0), // moving right
      );
    const currentScale = target.scaleX;
    const didScale = scalingX(moveEvent, transform, pointer.x, pointer.y);
    expect(currentScale).toEqual(transform.target.scaleX);
    expect((transform.target as Rect).scaleX).not.toBeNaN();
    expect((transform.target as Rect).scaleX).not.toBe(
      Number.POSITIVE_INFINITY,
    );
    expect(didScale).toBe(false);
  });
  it('adjusts a 0 width rect for polyActionhandler without it returning Infinity/NaN corner scale', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer, target } =
      createZeroThickRectangleScalingItems(
        { width: 0, height: 60 },
        'br',
        new Point(20, 20), // moving right
      );
    const currentScaleX = target.scaleX;
    const currentScaleY = target.scaleY;
    const didScale = scalingX(moveEvent, transform, pointer.x, pointer.y);
    expect(currentScaleX).toEqual(transform.target.scaleX);
    expect(currentScaleY).toEqual(transform.target.scaleY);
    expect((transform.target as Rect).scaleX).not.toBeNaN();
    expect((transform.target as Rect).scaleX).not.toBe(
      Number.POSITIVE_INFINITY,
    );
    expect(didScale).toBe(false);
  });
  it('adjusts a 0 height rect for polyActionhandler without it returning Infinity/NaN side scale', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } =
      createZeroThickRectangleScalingItems(
        { width: 60, height: 0 },
        'mb',
        new Point(0, 20),
      );

    const didScale = scalingY(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Rect).scaleY).not.toBeNaN();
    expect((transform.target as Rect).scaleY).not.toBe(
      Number.POSITIVE_INFINITY,
    );
    expect(didScale).toBe(false);
  });
  it('adjusts a 0 height rect for polyActionhandler without it returning Infinity/NaN corner scale', () => {
    // when NaN wasn't handled correctly, the polygon would disappear. Now, it stays
    const { moveEvent, transform, pointer } =
      createZeroThickRectangleScalingItems(
        { width: 60, height: 0 },
        'br',
        new Point(20, 20),
      );

    const didScale = scalingY(moveEvent, transform, pointer.x, pointer.y);

    expect((transform.target as Rect).scaleY).not.toBeNaN();
    expect((transform.target as Rect).scaleY).not.toBe(
      Number.POSITIVE_INFINITY,
    );
    expect(didScale).toBe(false);
  });
});
