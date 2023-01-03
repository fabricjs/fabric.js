import { Point } from '../point.class';
import { Control } from './control.class';
import { TMat2D } from '../typedefs';
import { iMatrix } from '../constants';
import { Polyline } from '../shapes/polyline.class';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import { TPointerEvent, Transform } from '../EventTypeDefs';
import { getLocalPoint } from './util';
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

  static getSize(poly: Polyline) {
    return new Point(poly.width, poly.height)
  }

  /**
   * This function locates the controls.
   * It'll be used both for drawing and for interaction.
   */
  positionHandler(dim: Point, finalMatrix: TMat2D, polyObject: Polyline) {
    const x = polyObject.points[this.pointIndex].x - polyObject.pathOffset.x,
      y = polyObject.points[this.pointIndex].y - polyObject.pathOffset.y;
    return new Point(x, y).transform(
      multiplyTransformMatrices(
        polyObject.canvas?.viewportTransform ?? iMatrix,
        polyObject.calcTransformMatrix()
      )
    );
  }

  /**
   * This function defines what the control does.
   * It'll be called on every mouse move after a control has been clicked and is being dragged.
   * The function receives as argument the mouse event, the current trasnform object
   * and the current position in canvas coordinate `transform.target` is a reference to the 
   * current object being transformed.
   */
  static polyActionHandler(
    eventData: TPointerEvent,
    transform: Transform,
    x: number,
    y: number
  ) {
    const poly = transform.target as Polyline,
      currentControl = poly.controls[poly.__corner] as PolyControl,
      mouseLocalPosition = getLocalPoint(transform, 'center', 'center', x, y),
      polygonBaseSize = PolyControl.getSize(poly),
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

  /** 
   * Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`.
   */
  static anchorWrapper(anchorIndex: number, fn: TransformActionHandler) {
    return function (
      eventData: TPointerEvent,
      transform: Transform,
      x: number,
      y: number
    ) {
      const poly = transform.target as Polyline,
        absolutePoint = new Point(
            poly.points[anchorIndex].x - poly.pathOffset.x,
            poly.points[anchorIndex].y - poly.pathOffset.y
          ).transform(poly.calcTransformMatrix()),
        actionPerformed = fn(eventData, transform, x, y),
        polygonBaseSize = PolyControl.getSize(poly),
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
    numOfControls: number,
    options?: Partial<Control>
  ) {
    const lastControl = numOfControls - 1,
      controls = {} as Record<string, PolyControl>; 
    for (let idx = 0; idx < numOfControls; idx++) {
        controls['p' + idx] = new PolyControl(
          {
            actionName: 'modifyPolygon',
            actionHandler: PolyControl.anchorWrapper(
              idx > 0 ? idx - 1 : lastControl,
              PolyControl.polyActionHandler
            ),
            ...options,
          },
          idx 
        );
    };
    return controls;
  }
}
  

  
