import { fabric } from '../../HEADER';
import { halfPI, twoMathPi } from '../constants';
import { Point } from '../point.class';
import { TClassProperties } from '../typedefs';
import { cos } from '../util/misc/cos';
import { sin } from '../util/misc/sin';
import { classRegistry } from '../util/class_registry';
import { Polyline, polylineDefaultValues } from './polyline.class';

export class Polygon extends Polyline {
  protected isOpen() {
    return false;
  }

  static getRegularPolygonPoints({
    numVertexes,
    radius,
  }: {
    numVertexes: number;
    radius: number;
  }) {
    const interiorAngle = twoMathPi / numVertexes;
    // rotate the polygon by 1/2 the interior angle so that the polygon always has a flat side on the bottom
    const rotationAdjustment =
      -halfPI + (numVertexes % 2 === 0 ? interiorAngle / 2 : 0);
    return new Array(numVertexes).fill(0).map((_, i) => {
      const rad = i * interiorAngle + rotationAdjustment;
      return new Point(cos(rad), sin(rad)).scalarMultiply(radius);
    });
  }

  static createRegularPolygon({
    numVertexes,
    radius,
    ...options
  }: {
    numVertexes: number;
    radius: number;
  } & Record<string, unknown>) {
    return new this(this.getRegularPolygonPoints({ numVertexes, radius }), {
      left: 0,
      top: 0,
      ...options,
    });
  }
}

export const polygonDefaultValues: Partial<TClassProperties<Polygon>> = {
  ...polylineDefaultValues,
  type: 'polygon',
};

Object.assign(Polygon.prototype, polygonDefaultValues);

classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);

/** @todo TODO_JS_MIGRATION remove next line after refactoring build */
fabric.Polygon = Polygon;
