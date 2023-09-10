import type { TransformActionHandler, Transform } from '../EventTypeDefs';
import { FabricObject } from '../shapes/Object/FabricObject';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';

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
    expect(transformData.target.top).toBe(100);
    expect(transformData.target.left).toBe(100);
    const event = new MouseEvent('move');
    wrappedAction(event, transformData as Transform, 0, 0);
    expect(transformData.target.top).toBe(150.5);
    expect(transformData.target.left).toBe(201);
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
    expect(transformData.target.top).toBe(100);
    expect(transformData.target.left).toBe(100);
    const event = new MouseEvent('move');
    wrappedAction(event, transformData as Transform, 0, 0);
    expect(transformData.target.top).toBe(-556.5);
    expect(transformData.target.left).toBe(-506);
  });
});
