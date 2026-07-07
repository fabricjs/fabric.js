import { Point } from '../Point';
import { Control } from './Control';
import type { TMat2D } from '../typedefs';
import type { Path } from '../shapes/Path';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import type {
  TModificationEvents,
  TPointerEvent,
  Transform,
} from '../EventTypeDefs';
import { sendPointToPlane } from '../util/misc/planeChange';
import type { TSimpleParseCommandType } from '../util/path/typedefs';
import type { ControlRenderingStyleOverride } from './controlRendering';
import { fireEvent } from './fireEvent';
import { commonEventInfo } from './util';

const ACTION_NAME: TModificationEvents = 'modifyPath' as const;

type TTransformAnchor = Transform;

export type PathPointControlStyle = {
  controlFill?: string;
  controlStroke?: string;
  connectionDashArray?: number[];
};

const calcPathPointPosition = (
  pathObject: Path,
  commandIndex: number,
  pointIndex: number,
) => {
  const { path, pathOffset } = pathObject;
  const command = path[commandIndex];
  return new Point(
    (command[pointIndex] as number) - pathOffset.x,
    (command[pointIndex + 1] as number) - pathOffset.y,
  ).transform(
    multiplyTransformMatrices(
      pathObject.getViewportTransform(),
      pathObject.calcTransformMatrix(),
    ),
  );
};

const movePathPoint = (
  pathObject: Path,
  x: number,
  y: number,
  commandIndex: number,
  pointIndex: number,
) => {
  const { path, pathOffset } = pathObject;

  const anchorCommand =
    path[(commandIndex > 0 ? commandIndex : path.length) - 1];
  const anchorPoint = new Point(
    anchorCommand[pointIndex] as number,
    anchorCommand[pointIndex + 1] as number,
  );

  const anchorPointInParentPlane = anchorPoint
    .subtract(pathOffset)
    .transform(pathObject.calcOwnMatrix());

  const mouseLocalPosition = sendPointToPlane(
    new Point(x, y),
    undefined,
    pathObject.calcOwnMatrix(),
  );

  path[commandIndex][pointIndex] = mouseLocalPosition.x + pathOffset.x;
  path[commandIndex][pointIndex + 1] = mouseLocalPosition.y + pathOffset.y;
  pathObject.setDimensions();

  const newAnchorPointInParentPlane = anchorPoint
    .subtract(pathObject.pathOffset)
    .transform(pathObject.calcOwnMatrix());

  const diff = newAnchorPointInParentPlane.subtract(anchorPointInParentPlane);
  pathObject.left -= diff.x;
  pathObject.top -= diff.y;
  pathObject.set('dirty', true);
  return true;
};

/**
 * This function locates the controls.
 * It'll be used both for drawing and for interaction.
 */
function pathPositionHandler(
  this: PathPointControl,
  dim: Point,
  finalMatrix: TMat2D,
  pathObject: Path,
) {
  const { commandIndex, pointIndex } = this;
  return calcPathPointPosition(pathObject, commandIndex, pointIndex);
}

/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
function pathActionHandler(
  this: PathPointControl,
  eventData: TPointerEvent,
  transform: TTransformAnchor,
  x: number,
  y: number,
) {
  const { target } = transform;
  const { commandIndex, pointIndex } = this;
  const actionPerformed = movePathPoint(
    target as Path,
    x,
    y,
    commandIndex,
    pointIndex,
  );
  if (actionPerformed) {
    fireEvent(this.actionName as TModificationEvents, {
      ...commonEventInfo(eventData, transform, x, y),
      commandIndex,
      pointIndex,
    });
  }
  return actionPerformed;
}

const indexFromPrevCommand = (previousCommandType: TSimpleParseCommandType) =>
  previousCommandType === 'C' ? 5 : previousCommandType === 'Q' ? 3 : 1;

class PathPointControl extends Control {
  declare commandIndex: number;
  declare pointIndex: number;
  declare controlFill: string;
  declare controlStroke: string;
  constructor(options?: Partial<PathPointControl>) {
    super(options);
  }

  render(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: ControlRenderingStyleOverride | undefined,
    fabricObject: Path,
  ) {
    const overrides: ControlRenderingStyleOverride = {
      ...styleOverride,
      cornerColor: this.controlFill,
      cornerStrokeColor: this.controlStroke,
      transparentCorners: !this.controlFill,
    };
    super.render(ctx, left, top, overrides, fabricObject);
  }
}

class PathControlPointControl extends PathPointControl {
  declare connectionDashArray?: number[];
  declare connectToCommandIndex: number;
  declare connectToPointIndex: number;
  constructor(options?: Partial<PathControlPointControl>) {
    super(options);
  }

  render(
    this: PathControlPointControl,
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: ControlRenderingStyleOverride | undefined,
    fabricObject: Path,
  ) {
    const { path } = fabricObject;
    const {
      commandIndex,
      pointIndex,
      connectToCommandIndex,
      connectToPointIndex,
    } = this;
    ctx.save();
    ctx.strokeStyle = this.controlStroke;
    if (this.connectionDashArray) {
      ctx.setLineDash(this.connectionDashArray);
    }
    const [commandType] = path[commandIndex];
    const point = calcPathPointPosition(
      fabricObject,
      connectToCommandIndex,
      connectToPointIndex,
    );

    if (commandType === 'Q') {
      // one control point connects to 2 points
      const point2 = calcPathPointPosition(
        fabricObject,
        commandIndex,
        pointIndex + 2,
      );
      ctx.moveTo(point2.x, point2.y);
      ctx.lineTo(left, top);
    } else {
      ctx.moveTo(left, top);
    }
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.restore();

    super.render(ctx, left, top, styleOverride, fabricObject);
  }
}

const createControl = (
  commandIndexPos: number,
  pointIndexPos: number,
  isControlPoint: boolean,
  options: Partial<Control> & {
    controlPointStyle?: PathPointControlStyle;
    pointStyle?: PathPointControlStyle;
  },
  connectToCommandIndex?: number,
  connectToPointIndex?: number,
) =>
  new (isControlPoint ? PathControlPointControl : PathPointControl)({
    commandIndex: commandIndexPos,
    pointIndex: pointIndexPos,
    actionName: ACTION_NAME,
    positionHandler: pathPositionHandler,
    actionHandler: pathActionHandler,
    connectToCommandIndex,
    connectToPointIndex,
    ...options,
    ...(isControlPoint ? options.controlPointStyle : options.pointStyle),
  } as Partial<PathControlPointControl>);

export function createPathControls(
  path: Path,
  options: Partial<Control> & {
    controlPointStyle?: PathPointControlStyle;
    pointStyle?: PathPointControlStyle;
  } = {},
): Record<string, Control> {
  const controls = {} as Record<string, Control>;
  let previousCommandType: TSimpleParseCommandType = 'M';
  path.path.forEach((command, commandIndex) => {
    const commandType = command[0];

    if (commandType !== 'Z') {
      controls[`c_${commandIndex}_${commandType}`] = createControl(
        commandIndex,
        command.length - 2,
        false,
        options,
      );
    }
    switch (commandType) {
      case 'C':
        controls[`c_${commandIndex}_C_CP_1`] = createControl(
          commandIndex,
          1,
          true,
          options,
          commandIndex - 1,
          indexFromPrevCommand(previousCommandType),
        );
        controls[`c_${commandIndex}_C_CP_2`] = createControl(
          commandIndex,
          3,
          true,
          options,
          commandIndex,
          5,
        );
        break;
      case 'Q':
        controls[`c_${commandIndex}_Q_CP_1`] = createControl(
          commandIndex,
          1,
          true,
          options,
          commandIndex,
          3,
        );
        break;
    }
    previousCommandType = commandType;
  });
  return controls;
}
