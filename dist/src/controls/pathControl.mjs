import { objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Point } from '../Point.mjs';
import { Control } from './Control.mjs';
import { multiplyTransformMatrices } from '../util/misc/matrix.mjs';
import { sendPointToPlane } from '../util/misc/planeChange.mjs';
import { fireEvent } from './fireEvent.mjs';
import { commonEventInfo } from './util.mjs';

const ACTION_NAME = 'modifyPath';
const calcPathPointPosition = (pathObject, commandIndex, pointIndex) => {
  const {
    path,
    pathOffset
  } = pathObject;
  const command = path[commandIndex];
  return new Point(command[pointIndex] - pathOffset.x, command[pointIndex + 1] - pathOffset.y).transform(multiplyTransformMatrices(pathObject.getViewportTransform(), pathObject.calcTransformMatrix()));
};
const movePathPoint = (pathObject, x, y, commandIndex, pointIndex) => {
  const {
    path,
    pathOffset
  } = pathObject;
  const anchorCommand = path[(commandIndex > 0 ? commandIndex : path.length) - 1];
  const anchorPoint = new Point(anchorCommand[pointIndex], anchorCommand[pointIndex + 1]);
  const anchorPointInParentPlane = anchorPoint.subtract(pathOffset).transform(pathObject.calcOwnMatrix());
  const mouseLocalPosition = sendPointToPlane(new Point(x, y), undefined, pathObject.calcOwnMatrix());
  path[commandIndex][pointIndex] = mouseLocalPosition.x + pathOffset.x;
  path[commandIndex][pointIndex + 1] = mouseLocalPosition.y + pathOffset.y;
  pathObject.setDimensions();
  const newAnchorPointInParentPlane = anchorPoint.subtract(pathObject.pathOffset).transform(pathObject.calcOwnMatrix());
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
function pathPositionHandler(dim, finalMatrix, pathObject) {
  const {
    commandIndex,
    pointIndex
  } = this;
  return calcPathPointPosition(pathObject, commandIndex, pointIndex);
}

/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
function pathActionHandler(eventData, transform, x, y) {
  const {
    target
  } = transform;
  const {
    commandIndex,
    pointIndex
  } = this;
  const actionPerformed = movePathPoint(target, x, y, commandIndex, pointIndex);
  {
    fireEvent(this.actionName, _objectSpread2(_objectSpread2({}, commonEventInfo(eventData, transform, x, y)), {}, {
      commandIndex,
      pointIndex
    }));
  }
  return actionPerformed;
}
const indexFromPrevCommand = previousCommandType => previousCommandType === 'C' ? 5 : previousCommandType === 'Q' ? 3 : 1;
class PathPointControl extends Control {
  constructor(options) {
    super(options);
  }
  render(ctx, left, top, styleOverride, fabricObject) {
    const overrides = _objectSpread2(_objectSpread2({}, styleOverride), {}, {
      cornerColor: this.controlFill,
      cornerStrokeColor: this.controlStroke,
      transparentCorners: !this.controlFill
    });
    super.render(ctx, left, top, overrides, fabricObject);
  }
}
class PathControlPointControl extends PathPointControl {
  constructor(options) {
    super(options);
  }
  render(ctx, left, top, styleOverride, fabricObject) {
    const {
      path
    } = fabricObject;
    const {
      commandIndex,
      pointIndex,
      connectToCommandIndex,
      connectToPointIndex
    } = this;
    ctx.save();
    ctx.strokeStyle = this.controlStroke;
    if (this.connectionDashArray) {
      ctx.setLineDash(this.connectionDashArray);
    }
    const [commandType] = path[commandIndex];
    const point = calcPathPointPosition(fabricObject, connectToCommandIndex, connectToPointIndex);
    if (commandType === 'Q') {
      // one control point connects to 2 points
      const point2 = calcPathPointPosition(fabricObject, commandIndex, pointIndex + 2);
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
const createControl = (commandIndexPos, pointIndexPos, isControlPoint, options, connectToCommandIndex, connectToPointIndex) => new (isControlPoint ? PathControlPointControl : PathPointControl)(_objectSpread2(_objectSpread2({
  commandIndex: commandIndexPos,
  pointIndex: pointIndexPos,
  actionName: ACTION_NAME,
  positionHandler: pathPositionHandler,
  actionHandler: pathActionHandler,
  connectToCommandIndex,
  connectToPointIndex
}, options), isControlPoint ? options.controlPointStyle : options.pointStyle));
function createPathControls(path) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const controls = {};
  let previousCommandType = 'M';
  path.path.forEach((command, commandIndex) => {
    const commandType = command[0];
    if (commandType !== 'Z') {
      controls["c_".concat(commandIndex, "_").concat(commandType)] = createControl(commandIndex, command.length - 2, false, options);
    }
    switch (commandType) {
      case 'C':
        controls["c_".concat(commandIndex, "_C_CP_1")] = createControl(commandIndex, 1, true, options, commandIndex - 1, indexFromPrevCommand(previousCommandType));
        controls["c_".concat(commandIndex, "_C_CP_2")] = createControl(commandIndex, 3, true, options, commandIndex, 5);
        break;
      case 'Q':
        controls["c_".concat(commandIndex, "_Q_CP_1")] = createControl(commandIndex, 1, true, options, commandIndex, 3);
        break;
    }
    previousCommandType = commandType;
  });
  return controls;
}

export { createPathControls };
//# sourceMappingURL=pathControl.mjs.map
