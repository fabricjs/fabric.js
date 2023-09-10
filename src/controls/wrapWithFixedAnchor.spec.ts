import type { TransformActionHandler, Transform } from '../EventTypeDefs';
import { FabricObject } from '../shapes/Object/FabricObject';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';
/**
 * export function wrapWithFixedAnchor<T extends Transform>(
  actionHandler: TransformActionHandler<T>
) {
  return ((eventData, transform, x, y) => {
    const { target, originX, originY } = transform,
      centerPoint = target.getRelativeCenterPoint(),
      constraint = target.translateToOriginPoint(centerPoint, originX, originY),
      actionPerformed = actionHandler(eventData, transform, x, y);
    // flipping requires to change the transform origin, so we read from the mutated transform
    // instead of leveraging the one destructured before
    target.setPositionByOrigin(
      constraint,
      transform.originX,
      transform.originY
    );
    return actionPerformed;
  }) as TransformActionHandler<T>;
}
 * 
 */

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
