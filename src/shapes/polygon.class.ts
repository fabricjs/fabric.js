import { fabric } from '../../HEADER';
import { TClassProperties } from '../typedefs';
import { Polyline, polylineDefaultValues } from './polyline.class';

export class Polygon extends Polyline {
  protected isOpen() {
    return false;
  }
}

export const polygonDefaultValues: Partial<TClassProperties<Polygon>> = {
  ...polylineDefaultValues,
  type: 'polygon',
};

Object.assign(Polygon.prototype, polygonDefaultValues);
/** @todo TODO_JS_MIGRATION remove next line after refactoring build */
fabric.Polygon = Polygon;
