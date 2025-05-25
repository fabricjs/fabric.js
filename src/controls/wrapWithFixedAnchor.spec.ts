import type { TransformActionHandler, Transform } from '../EventTypeDefs';
import { FabricObject } from '../shapes/Object/FabricObject';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';
import { Point } from '../Point';

import { describe, expect, it } from 'vitest';

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
    // we are testing a left, top transform
    expect(transformData.originX).toBe('left');
    expect(transformData.originY).toBe('top');
    const targetTopLeftCorner = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      'left',
      'top',
    );
    // target position is 100,
    expect(target.top).toBe(100);
    expect(target.left).toBe(100);
    // target anchor corner is different
    expect(targetTopLeftCorner.y).toBe(-203);
    expect(targetTopLeftCorner.x).toBe(-152.5);
    const event = new MouseEvent('move');
    wrappedAction(event, transformData, 0, 0);
    const newTargetTopLeftCorner = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      'left',
      'top',
    );
    // after transform the position of the object moved.
    expect(target.top).toBe(150.5);
    expect(target.left).toBe(201);
    // but the target anchor position didn't move
    expect(newTargetTopLeftCorner.y).toBe(targetTopLeftCorner.y);
    expect(newTargetTopLeftCorner.x).toBe(targetTopLeftCorner.x);
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
    // we are testing a left, top transform
    expect(transformData.originX).toBe('left');
    expect(transformData.originY).toBe('top');
    const targetTopLeftCorner = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      transformData.originX,
      transformData.originY,
    );
    // target position is 100,
    expect(target.top).toBe(100);
    expect(target.left).toBe(100);
    // target anchor corner is different
    expect(targetTopLeftCorner.y).toBe(-203);
    expect(targetTopLeftCorner.x).toBe(-152.5);
    const event = new MouseEvent('move');
    wrappedAction(event, transformData, 0, 0);
    const newTargetAnchorPosition = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      transformData.originX,
      transformData.originY,
    );
    // transform data ended up being right,bottom
    expect(transformData.originX).toBe('right');
    expect(transformData.originY).toBe('bottom');
    // after transform the position of the object moved.
    expect(target.top).toBe(-556.5);
    expect(target.left).toBe(-506);
    // but the target anchor position didn't move from the topLeftCorner
    expect(newTargetAnchorPosition.y).toBe(targetTopLeftCorner.y);
    expect(newTargetAnchorPosition.x).toBe(targetTopLeftCorner.x);
    // while the new top left corner of the object moved away
    const newTopLeftCorner = target.translateToGivenOrigin(
      new Point(target.left, target.top),
      target.originX,
      target.originY,
      'left',
      'top',
    );
    expect(newTopLeftCorner.y).toBe(-910);
    expect(newTopLeftCorner.x).toBe(-859.5);
  });
});
