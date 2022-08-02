import * as DCircle from './Circle.json';
import * as DEllipse from './Ellipse.json';
import * as DLine from './Line.json';
import * as DObject from './FabricObject.json';
import * as DPath from './Path.json';
import * as DPolygon from './Polygon.json';
import * as DPolyline from './Polyline.json';
import * as DRect from './Rect.json';
import * as DTriangle from './Triangle.json';

export const DEFAULTS = {
    object: DObject,
    circle: { ...DObject, ...DCircle },
    ellipse: { ...DObject, ...DEllipse },
    line: { ...DObject, ...DLine },
    path: { ...DObject, ...DPath },
    polygon: { ...DObject, ...DPolyline, ...DPolygon },
    polyline: { ...DObject, ...DPolyline },
    triangle: { ...DObject, ...DTriangle },
    rect: { ...DObject, ...DRect },
};