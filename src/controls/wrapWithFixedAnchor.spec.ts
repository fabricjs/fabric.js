import type { TransformActionHandler, Transform } from '../EventTypeDefs';
import { FabricObject } from '../shapes/Object/FabricObject';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';
import { Point } from '../Point';

const createTransformData = (): Transform => {
  return {
    target: new FabricObject({
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      originX: 'center',
      originY: 'center',
      scaleX: 5,
      scaleY: 6,
    }),
    originX: 'left',
    originY: 'top',
  } as Transform;
};

describe('wrapWithFixedAnchor', () => {
  it('it maintains an object fixed on a constrain point', () => {
    const actionToWrap: TransformActionHandler = (eventData, transform) => {
      transform.target.scaleX = 7;
      transform.target.scaleY = 7;
      return true;
    };
    const wrappedAction = wrapWithFixedAnchor(actionToWrap);
    const transformData = createTransformData();
    const { target } = transformData;
    const targetAnchorPosition = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      transformData.originX,
      transformData.originY
    );
    // target position is 100,
    expect(target.top).toBe(100);
    expect(target.left).toBe(100);
    // target anchor corner is different
    expect(targetAnchorPosition.y).toBe(-203);
    expect(targetAnchorPosition.x).toBe(-152.5);
    const event = new MouseEvent('move');
    wrappedAction(event, transformData as Transform, 0, 0);
    const newTargetAnchorPosition = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      transformData.originX,
      transformData.originY
    );
    // after transform the position of the object moved.
    expect(target.top).toBe(150.5);
    expect(target.left).toBe(201);
    // but the target anchor position didn't move
    expect(newTargetAnchorPosition.y).toBe(-203);
    expect(newTargetAnchorPosition.x).toBe(-152.5);
  });
  it('the fixed anchor point works with an origin swap', () => {
    const actionToWrap: TransformActionHandler = (eventData, transform) => {
      transform.target.scaleX = 7;
      transform.target.scaleY = 7;
      transform.originX = 'right';
      transform.originY = 'bottom';
      return true;
    };
    const wrappedAction = wrapWithFixedAnchor(actionToWrap);

    const transformData = createTransformData();
    const { target } = transformData;
    const targetAnchorPosition = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      transformData.originX,
      transformData.originY
    );

    // target position is 100,
    expect(target.top).toBe(100);
    expect(target.left).toBe(100);
    // target anchor corner is different
    expect(targetAnchorPosition.y).toBe(-203);
    expect(targetAnchorPosition.x).toBe(-152.5);
    const event = new MouseEvent('move');
    wrappedAction(event, transformData as Transform, 0, 0);
    const newTargetAnchorPosition = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      transformData.originX,
      transformData.originY
    );
    // after transform the position of the object moved.
    expect(target.top).toBe(-556.5);
    expect(target.left).toBe(-506);
    // but the target anchor position didn't move
    expect(newTargetAnchorPosition.y).toBe(-203);
    expect(newTargetAnchorPosition.x).toBe(-152.5);
    // while the top left corner of the object moved away
    const topLeftCorner = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      'left',
      'top'
    );
    expect(topLeftCorner.y).toBe(-910);
    expect(topLeftCorner.x).toBe(-859.5);
  });
});
