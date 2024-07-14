import { Point, ZERO } from '../Point';
import { Control } from './Control';
import type { TMat2D } from '../typedefs';
import type { Path } from '../shapes/Path';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import type {
  TModificationEvents,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { sendPointToPlane } from '../util';
import { iMatrix, MODIFY_PATH } from '../constants';
import type { ControlRenderingStyleOverride } from './controlRendering';

const ACTION_NAME: TModificationEvents = MODIFY_PATH;

type TTransformAnchor = Transform & {
  pointIndex: number;
  commandIndex: number;
};

export function wrapRenderWithConnectionC(commandIndex: number) {
  return function (
    this: Control,
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: ControlRenderingStyleOverride | undefined,
    fabricObject: Path
  ) {
    const point = createPathPositionHandler(commandIndex, 5)(
      ZERO,
      iMatrix,
      fabricObject
    );
    ctx.moveTo(left, top);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    return Control.prototype.render.call(
      this,
      ctx,
      left,
      top,
      styleOverride,
      fabricObject
    );
  };
}

export function wrapRenderWithConnectionQ(commandIndex: number) {
  return function (
    this: Control,
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: ControlRenderingStyleOverride | undefined,
    fabricObject: Path
  ) {
    const point = createPathPositionHandler(commandIndex, 3)(
      ZERO,
      iMatrix,
      fabricObject
    );
    ctx.moveTo(left, top);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    return Control.prototype.render.call(
      this,
      ctx,
      left,
      top,
      styleOverride,
      fabricObject
    );
  };
}

/**
 * This function locates the controls.
 * It'll be used both for drawing and for interaction.
 */
export const createPathPositionHandler = (
  commandIndex: number,
  pointIndex: number
) => {
  return function (dim: Point, finalMatrix: TMat2D, polyObject: Path) {
    const { path, pathOffset } = polyObject;
    const command = path[commandIndex];
    return new Point(
      command[pointIndex] as number,
      command[pointIndex + 1] as number
    )
      .subtract(pathOffset)
      .transform(
        multiplyTransformMatrices(
          polyObject.getViewportTransform(),
          polyObject.calcTransformMatrix()
        )
      );
  };
};

/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
export const PathActionHandler = (
  eventData: TPointerEvent,
  transform: TTransformAnchor,
  x: number,
  y: number
) => {
  const { target, pointIndex, commandIndex } = transform;
  const path = target as Path;
  const mouseLocalPosition = sendPointToPlane(
    new Point(x, y),
    undefined,
    path.calcOwnMatrix()
  ).add(path.pathOffset);

  path.path[commandIndex][pointIndex] = mouseLocalPosition.x;
  path.path[commandIndex][pointIndex + 1] = mouseLocalPosition.y;
  path.setDimensions();

  return true;
};

/**
 * Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`.
 */
export const factoryPathActionHandler = (
  commandIndex: number,
  pointIndex: number,
  fn: TransformActionHandler<TTransformAnchor>
) => {
  return function (
    eventData: TPointerEvent,
    transform: Transform,
    x: number,
    y: number
  ) {
    const path = transform.target as Path,
      commands = path.path,
      anchorCommand =
        commands[(commandIndex > 0 ? commandIndex : commands.length) - 1],
      anchorPoint = new Point(
        anchorCommand[pointIndex] as number,
        anchorCommand[pointIndex + 1] as number
      ),
      anchorPointInParentPlane = anchorPoint
        .subtract(path.pathOffset)
        .transform(path.calcOwnMatrix()),
      actionPerformed = fn(
        eventData,
        { ...transform, pointIndex, commandIndex },
        x,
        y
      );

    const newAnchorPointInParentPlane = anchorPoint
      .subtract(path.pathOffset)
      .transform(path.calcOwnMatrix());

    const diff = newAnchorPointInParentPlane.subtract(anchorPointInParentPlane);
    path.left -= diff.x;
    path.top -= diff.y;

    return actionPerformed;
  };
};

export const createPathActionHandler = (
  commandIndex: number,
  pointIndex: number
) =>
  wrapWithFireEvent(
    ACTION_NAME,
    factoryPathActionHandler(commandIndex, pointIndex, PathActionHandler)
  );

export function createPathControls(
  path: Path,
  options?: Partial<Control>
): Record<string, Control> {
  const controls = {} as Record<string, Control>;
  for (
    let commandIndex = 0;
    commandIndex < (typeof path === 'number' ? path : path.path.length);
    commandIndex++
  ) {
    const command = path.path[commandIndex];
    const commandType = command[0];

    switch (commandType) {
      case 'M':
      case 'L':
        controls[`cmd_${commandIndex}_${commandType}`] = new Control({
          actionName: ACTION_NAME,
          positionHandler: createPathPositionHandler(commandIndex, 1),
          actionHandler: createPathActionHandler(commandIndex, 1),
          ...options,
        });
        break;
      case 'C':
        controls[`cmd_${commandIndex}_${commandType}_c1`] = new Control({
          actionName: ACTION_NAME,
          positionHandler: createPathPositionHandler(commandIndex, 1),
          actionHandler: createPathActionHandler(commandIndex, 1),
          ...options,
        });
        controls[`cmd_${commandIndex}_${commandType}_c2`] = new Control({
          actionName: ACTION_NAME,
          positionHandler: createPathPositionHandler(commandIndex, 3),
          actionHandler: createPathActionHandler(commandIndex, 3),
          render: wrapRenderWithConnectionC(commandIndex),
          ...options,
        });
        controls[`cmd_${commandIndex}_${commandType}_p`] = new Control({
          actionName: ACTION_NAME,
          positionHandler: createPathPositionHandler(commandIndex, 5),
          actionHandler: createPathActionHandler(commandIndex, 5),

          ...options,
        });
        break;
      case 'Q':
        controls[`cmd_${commandIndex}_${commandType}_c1`] = new Control({
          actionName: ACTION_NAME,
          positionHandler: createPathPositionHandler(commandIndex, 1),
          actionHandler: createPathActionHandler(commandIndex, 1),
          render: wrapRenderWithConnectionQ(commandIndex, 1),
          ...options,
        });
        controls[`cmd_${commandIndex}_${commandType}`] = new Control({
          actionName: ACTION_NAME,
          positionHandler: createPathPositionHandler(commandIndex, 3),
          actionHandler: createPathActionHandler(commandIndex, 3),
          ...options,
        });
        break;
    }
  }
  return controls;
}
