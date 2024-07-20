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
import { sendPointToPlane } from '../util/misc/planeChange';
import type { TSimpleParseCommandType } from '../util/path/typedefs';
import { iMatrix, MODIFY_PATH } from '../constants';
import type {
  ControlRenderer,
  ControlRenderingStyleOverride,
} from './controlRendering';

const ACTION_NAME: TModificationEvents = MODIFY_PATH;

type TTransformAnchor = Transform & {
  pointIndex: number;
  commandIndex: number;
};

export function wrapRenderWithConnection(
  commandIndex: number,
  pointIndex: number,
  commandIndexPrevious?: number,
  pointIndexPrevious?: number
): ControlRenderer<Path> {
  return function (
    this: Control,
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: ControlRenderingStyleOverride | undefined,
    fabricObject: Path
  ) {
    const point = createPathPositionHandler(commandIndex, pointIndex)(
      ZERO,
      iMatrix,
      fabricObject
    );
    if (commandIndexPrevious && pointIndexPrevious) {
      const point2 = createPathPositionHandler(
        commandIndexPrevious,
        pointIndexPrevious
      )(ZERO, iMatrix, fabricObject);
      ctx.moveTo(point2.x, point2.y);
      ctx.lineTo(left, top);
    } else {
      ctx.moveTo(left, top);
    }
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
  return function (dim: Point, finalMatrix: TMat2D, pathObject: Path) {
    const { path, pathOffset } = pathObject;
    const command = path[commandIndex];
    return new Point(
      (command[pointIndex] as number) - pathOffset.x,
      (command[pointIndex + 1] as number) - pathOffset.y
    ).transform(
      multiplyTransformMatrices(
        pathObject.getViewportTransform(),
        pathObject.calcTransformMatrix()
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
  const { path, pathOffset } = target as Path;
  const mouseLocalPosition = sendPointToPlane(
    new Point(x, y),
    undefined,
    target.calcOwnMatrix()
  );

  path[commandIndex][pointIndex] = mouseLocalPosition.x + pathOffset.x;
  path[commandIndex][pointIndex + 1] = mouseLocalPosition.y + pathOffset.y;
  (target as Path).setDimensions();

  return true;
};

/**
 * Keep the path in the same position when we change its `width`/`height`/`top`/`left`.
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
    const { target } = transform;
    const { path, pathOffset } = target as Path,
      anchorCommand = path[(commandIndex > 0 ? commandIndex : path.length) - 1],
      anchorPoint = new Point(
        anchorCommand[pointIndex] as number,
        anchorCommand[pointIndex + 1] as number
      ),
      anchorPointInParentPlane = anchorPoint
        .subtract(pathOffset)
        .transform(target.calcOwnMatrix()),
      // fn mutates target, target.path and target.pathOffset
      actionPerformed = fn(
        eventData,
        { ...transform, pointIndex, commandIndex },
        x,
        y
      );

    const newAnchorPointInParentPlane = anchorPoint
      .subtract((target as Path).pathOffset)
      .transform(target.calcOwnMatrix());

    const diff = newAnchorPointInParentPlane.subtract(anchorPointInParentPlane);
    target.left -= diff.x;
    target.top -= diff.y;

    return actionPerformed;
  };
};

export const createPathActionHandler = (
  commandIndex: number,
  pointIndex: number
) =>
  wrapWithFireEvent(
    ACTION_NAME,
    factoryPathActionHandler(commandIndex, pointIndex, PathActionHandler),
    { pointIndex, commandIndex }
  );

const indexFromPrevCommand = (previousCommandType: TSimpleParseCommandType) =>
  previousCommandType === 'C' ? 5 : previousCommandType === 'Q' ? 3 : 1;

const createControl = (
  commandIndexPos: number,
  pointIndexPos: number,
  options?: Partial<Control>,
  commandIndexConnect?: number,
  pointIndexConnect?: number,
  commandIndexConnect2?: number,
  pointIndexConnect2?: number
) =>
  new Control({
    actionName: ACTION_NAME,
    positionHandler: createPathPositionHandler(commandIndexPos, pointIndexPos),
    actionHandler: createPathActionHandler(commandIndexPos, pointIndexPos),
    ...(commandIndexConnect && pointIndexConnect
      ? {
          render: wrapRenderWithConnection(
            commandIndexConnect,
            pointIndexConnect,
            commandIndexConnect2,
            pointIndexConnect2
          ),
        }
      : {}),
    ...options,
  });

export function createPathControls(
  path: Path,
  options?: Partial<Control>
): Record<string, Control> {
  const controls = {} as Record<string, Control>;
  let previousCommandType: TSimpleParseCommandType = 'M';
  path.path.forEach((command, commandIndex) => {
    const commandType = command[0];

    if (commandType !== 'Z') {
      controls[`c_${commandIndex}_${commandType}`] = createControl(
        commandIndex,
        command.length - 2,
        options
      );
    }
    switch (commandType) {
      case 'C':
        controls[`c_${commandIndex}_${commandType}_CP_1`] = createControl(
          commandIndex,
          1,
          options,
          commandIndex - 1,
          indexFromPrevCommand(previousCommandType)
        );
        controls[`c_${commandIndex}_${commandType}_CP_2`] = createControl(
          commandIndex,
          3,
          options,
          commandIndex,
          5
        );
        break;
      case 'Q':
        controls[`c_${commandIndex}_${commandType}_CP_1`] = createControl(
          commandIndex,
          1,
          options,
          commandIndex,
          3,
          commandIndex - 1,
          indexFromPrevCommand(previousCommandType)
        );
        break;
    }
    previousCommandType = commandType;
  });
  return controls;
}
