import { Point } from '../point.class';
import { Control } from './control.class';
import { TMat2D } from '../typedefs';
import { Polyline } from '../shapes/polyline.class';
import { multiplyTransformMatrices, transformPoint } from '../util/misc/matrix';
import { TPointerEvent, Transform } from '../EventTypeDefs';
import { normalizePoint } from './util';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { TransformActionHandler } from '../EventTypeDefs';

export class PolyControl extends Control {
  pointIndex: number;

  constructor(options: Partial<Control>, pointIndex: number) {
    super(options);
    this.pointIndex = pointIndex;
  }

  static applySkew(point: Point, shear: Point) {
    const skewedPoint = new Point();
    skewedPoint.y = point.y + point.x * shear.y;
    skewedPoint.x = point.x + skewedPoint.y * shear.x;
    return skewedPoint;
  }

  static removeSkew(point: Point, shear: Point) {
    const unskewedPoint = new Point();
    unskewedPoint.x = point.x - point.y * shear.x;
    unskewedPoint.y = point.y - unskewedPoint.x * shear.y;
    return unskewedPoint;
  }

  // This function locate the controls.
  // It'll be used both for drawing and for interaction
  positionHandler(dim: Point, finalMatrix: TMat2D, polyObject: Polyline) {
    const x = polyObject.points[this.pointIndex].x - polyObject.pathOffset.x,
      y = polyObject.points[this.pointIndex].y - polyObject.pathOffset.y;
    return transformPoint(
      { x: x, y: y },
      multiplyTransformMatrices(
        polyObject.canvas?.viewportTransform ?? ([1, 0, 0, 1, 0, 0] as TMat2D),
        polyObject.calcTransformMatrix()
      )
    );
  }

  // This function define what the control does.
  // It'll be called on every mouse move after a control has been clicked and is being dragged.
  // The function receive as argument the mouse event, the current trasnform object
  // and the current position in canvas coordinate
  // transform.target is a reference to the current object being transformed,
  static polyActionHandler(
    eventData: TPointerEvent,
    transform: Transform,
    x: number,
    y: number
  ) {
    const poly = transform.target as Polyline,
      currentControl = poly.controls[poly.__corner] as PolyControl,
      mouseLocalPosition = normalizePoint(
        poly,
        new Point(x, y),
        'center',
        'center'
      ),
      polygonBaseSize = new Point(poly.width, poly.height),
      size = poly._getTransformedDimensions({}),
      shear = new Point(
        Math.tan(degreesToRadians(poly.skewX)),
        Math.tan(degreesToRadians(poly.skewY))
      );

    const skewedPathOffset = PolyControl.applySkew(poly.pathOffset, shear),
      finalPointPosition = PolyControl.removeSkew(
        mouseLocalPosition
          .multiply(polygonBaseSize)
          .divide(size)
          .add(skewedPathOffset),
        shear
      );

    poly.points[currentControl.pointIndex] = finalPointPosition;
    poly.setDimensions();

    return true;
  }

  // Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`
  static anchorWrapper(anchorIndex: number, fn: TransformActionHandler) {
    return function (
      eventData: TPointerEvent,
      transform: Transform,
      x: number,
      y: number
    ) {
      const poly = transform.target as Polyline,
        absolutePoint = transformPoint(
          new Point(
            poly.points[anchorIndex].x - poly.pathOffset.x,
            poly.points[anchorIndex].y - poly.pathOffset.y
          ),
          poly.calcTransformMatrix()
        ),
        actionPerformed = fn(eventData, transform, x, y),
        polygonBaseSize = poly._getNonTransformedDimensions(),
        shear = new Point(
          Math.tan(degreesToRadians(poly.skewX)),
          Math.tan(degreesToRadians(poly.skewY))
        );

      const newPosition = PolyControl.applySkew(
        new Point(
          poly.points[anchorIndex].x,
          poly.points[anchorIndex].y
        ).subtract(poly.pathOffset),
        shear
      ).divide(polygonBaseSize);

      poly.setPositionByOrigin(
        absolutePoint,
        newPosition.x + 0.5,
        newPosition.y + 0.5
      );
      return actionPerformed;
    };
  }

  static createPolyControls(
    controlPoints: Array<Point>,
    options?: Partial<Control>
  ) {
    const lastControl = controlPoints.length - 1,
      controls = controlPoints.reduce((acc, point, index) => {
        acc['p' + index] = new PolyControl(
          {
            actionName: 'modifyPolygon',
            actionHandler: PolyControl.anchorWrapper(
              index > 0 ? index - 1 : lastControl,
              PolyControl.polyActionHandler
            ),
            ...options,
          },
          index
        );
        return acc;
      }, {} as Record<string, PolyControl>);
    return controls;
  }
}
