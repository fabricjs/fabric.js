import { Polyline } from './Polyline';
import { Point } from '../Point';

import { describe, expect, it } from 'vitest';
import { getFabricDocument } from '../env';
import { version } from '../../package.json';
import { Polygon } from './Polygon';
import { FabricObject } from './Object/FabricObject';

const points = [
  { x: 2, y: 2 },
  { x: 12, y: 2 },
  { x: 12, y: 7 },
];

const REFERENCE_OBJECT = {
  version: version,
  type: 'Polyline',
  originX: 'center',
  originY: 'center',
  left: 15,
  top: 17,
  width: 10,
  height: 10,
  fill: 'rgb(0,0,0)',
  stroke: null,
  strokeWidth: 1,
  strokeDashArray: null,
  strokeLineCap: 'butt',
  strokeDashOffset: 0,
  strokeLineJoin: 'miter',
  strokeMiterLimit: 4,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  opacity: 1,
  points: getPoints(),
  shadow: null,
  visible: true,
  backgroundColor: '',
  fillRule: 'nonzero',
  paintFirst: 'fill',
  globalCompositeOperation: 'source-over',
  skewX: 0,
  skewY: 0,
  strokeUniform: false,
} as const;

describe('Polyline', () => {
  describe('_calcDimensions and pathOffset', () => {
    it('returns dimensions of the polyline regardless of transform or strokeWidth', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 4,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 2,
        width: 10,
        height: 5,
        pathOffset: new Point(7, 4.5),
        strokeDiff: new Point(0, 0),
        strokeOffset: new Point(0, 0),
      });
    });
    it('returns dimensions of the polyline regardless of transform or strokeWidth and skew', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 4,
        skewX: 10,
        skewY: 5,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 2,
        width: 10,
        height: 5,
        pathOffset: new Point(7, 4.5),
        strokeDiff: expect.any(Point),
        strokeOffset: expect.any(Point),
      });
    });
    it('returns dimensions of the polyline exactBounds and no strokeWidth', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 0,
        exactBoundingBox: true,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 2,
        width: 10,
        height: 5,
        pathOffset: new Point(7, 4.5),
        strokeDiff: new Point(0, 0),
        strokeOffset: new Point(0, 0),
      });
    });
    it('returns dimensions of the polyline exactBounds and strokeWidth', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 4,
        exactBoundingBox: true,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 0,
        width: 12,
        height: 7,
        pathOffset: new Point(8, 3.5),
        strokeDiff: new Point(4, 4),
        strokeOffset: new Point(0, 4),
      });
    });
    it('returns dimensions of the polyline exactBounds and strokeWidth with skew', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 4,
        skewX: 10,
        exactBoundingBox: true,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 0,
        width: 13.234288864959254,
        height: 7,
        pathOffset: new Point(8, 3.5),
        strokeDiff: new Point(4.70530792283386, 4),
        strokeOffset: new Point(0.7053079228338603, 4),
      });
    });
  });
  it('should safeguard passing points in options', () => {
    expect(new Polyline(points, { points: [{ x: 1, y: 1 }] })).toEqual(
      expect.objectContaining({
        points: points,
      }),
    );
  });

  const REFERENCE_EMPTY_OBJECT = {
    points: [],
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  };

  it('initializes constructor correctly', () => {
    expect(Polyline).toBeTruthy();

    const polyline = new Polyline(getPoints());

    expect(polyline).toBeInstanceOf(Polyline);
    expect(polyline).toBeInstanceOf(FabricObject);

    expect(polyline.constructor).toHaveProperty('type', 'Polyline');
    expect(polyline.get('points')).toEqual([
      { x: 10, y: 12 },
      { x: 20, y: 22 },
    ]);
  });

  it('positions with strokeWidth top-left and origins top-left', () => {
    const polyline = new Polyline(getPoints(), {
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
    });

    expect(polyline.left).toBe(9);
    expect(polyline.top).toBe(11);
  });

  it('positions with strokeWidth top-left and origins center-center', () => {
    const polyline = new Polyline(getPoints(), {
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    expect(polyline.left).toBe(15);
    expect(polyline.top).toBe(17);
  });

  it('positions with strokeWidth top-left and origins bottom-right', () => {
    const polyline = new Polyline(getPoints(), {
      strokeWidth: 2,
      originX: 'right',
      originY: 'bottom',
    });

    expect(polyline.left).toBe(21);
    expect(polyline.top).toBe(23);
  });

  it('has complexity function', () => {
    const polyline = new Polyline(getPoints());
    expect(polyline.complexity).toBeTypeOf('function');
  });

  it('converts to object correctly', () => {
    const polyline = new Polyline(getPoints());
    expect(polyline.toObject).toBeTypeOf('function');

    expect({
      ...polyline.toObject(),
    }).toEqual(REFERENCE_OBJECT);
  });

  it('generates SVG correctly', () => {
    const polyline = new Polygon(getPoints(), { fill: 'red', stroke: 'blue' });
    expect(polyline.toSVG).toBeTypeOf('function');
    const EXPECTED_SVG =
      '<g transform="matrix(1 0 0 1 15 17)"  >\n<polygon style="stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  points="-5,-5 5,5 " />\n</g>\n';
    expect(polyline.toSVG()).toEqual(EXPECTED_SVG);
  });

  it('creates from object correctly', async () => {
    expect(Polyline.fromObject).toBeTypeOf('function');
    const polyline = await Polyline.fromObject(REFERENCE_OBJECT);
    expect(polyline).toBeInstanceOf(Polyline);
    expect(polyline.toObject()).toEqual(REFERENCE_OBJECT);
  });

  it('creates from element without points nor strokeWidth', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    expect(Polyline.fromElement).toBeTypeOf('function');
    const elPolylineWithoutPoints = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline',
    ) as unknown as HTMLElement;
    elPolylineWithoutPoints.setAttributeNS(namespace, 'stroke-width', '0');

    const polyline = await Polyline.fromElement(elPolylineWithoutPoints);
    expect(polyline.toObject()).toEqual({
      ...REFERENCE_OBJECT,
      ...REFERENCE_EMPTY_OBJECT,
      strokeWidth: 0,
    });
  });

  it('creates from element without points but takes strokeWidth into account', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolylineWithoutPoints = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline',
    ) as unknown as HTMLElement;
    elPolylineWithoutPoints.setAttributeNS(namespace, 'stroke-width', '8');

    const polyline = await Polyline.fromElement(elPolylineWithoutPoints);
    expect(polyline.toObject()).toEqual({
      ...REFERENCE_OBJECT,
      ...REFERENCE_EMPTY_OBJECT,
      left: 0,
      top: 0,
      strokeWidth: 8,
    });
  });

  it('creates from element with empty points', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolylineWithEmptyPoints = getFabricDocument().createElementNS(
      namespace,
      'polyline',
    ) as unknown as HTMLElement;
    elPolylineWithEmptyPoints.setAttributeNS(namespace, 'points', '');

    const polyline = await Polyline.fromElement(elPolylineWithEmptyPoints);
    expect(polyline.toObject()).toEqual({
      ...REFERENCE_OBJECT,
      ...REFERENCE_EMPTY_OBJECT,
      left: 0,
      top: 0,
    });
  });

  it('creates from element with points and strokeWidth', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolyline = getFabricDocument().createElementNS(
      namespace,
      'polyline',
    ) as unknown as HTMLElement;
    elPolyline.setAttributeNS(namespace, 'points', '10,12 20,22');
    elPolyline.setAttributeNS(namespace, 'stroke-width', '1');

    const polyline = await Polyline.fromElement(elPolyline);
    expect(polyline.toObject()).toEqual({
      ...REFERENCE_OBJECT,
      left: 15,
      top: 17,
    });
  });

  it('creates from element without strokeWidth with top-left on top-left point', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolyline = getFabricDocument().createElementNS(
      namespace,
      'polyline',
    ) as unknown as HTMLElement;
    elPolyline.setAttributeNS(namespace, 'points', '10,12 20,22');
    elPolyline.setAttributeNS(namespace, 'stroke-width', String(0));

    const polyline = await Polyline.fromElement(elPolyline);
    expect(polyline).toBeInstanceOf(Polyline);
    expect(polyline.toObject()).toEqual({
      ...REFERENCE_OBJECT,
      strokeWidth: 0,
      left: 15,
      top: 17,
    });
  });

  it('creates from element with strokeWidth and adjusts space for stroke', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolyline = getFabricDocument().createElementNS(
      namespace,
      'polyline',
    ) as unknown as HTMLElement;
    elPolyline.setAttributeNS(namespace, 'points', '10,12 20,22');

    const polyline = await Polyline.fromElement(elPolyline);
    expect(polyline).toBeInstanceOf(Polyline);
    expect(polyline.toObject()).toEqual({
      ...REFERENCE_OBJECT,
      left: 15,
      top: 17,
    });
  });

  it('creates from element with custom attributes', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolylineWithAttrs = getFabricDocument().createElementNS(
      namespace,
      'polyline',
    ) as unknown as HTMLElement;
    elPolylineWithAttrs.setAttributeNS(
      namespace,
      'points',
      '10,10 20,20 30,30 10,10',
    );
    elPolylineWithAttrs.setAttributeNS(namespace, 'fill', 'rgb(255,255,255)');
    elPolylineWithAttrs.setAttributeNS(namespace, 'opacity', '0.34');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-width', '3');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke', 'blue');
    elPolylineWithAttrs.setAttributeNS(
      namespace,
      'transform',
      'translate(-10,-20) scale(2)',
    );
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-miterlimit', '5');

    const polylineWithAttrs = await Polyline.fromElement(elPolylineWithAttrs);
    const expectedPoints = [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 },
      { x: 10, y: 10 },
    ];
    expect(polylineWithAttrs.toObject()).toEqual({
      ...REFERENCE_OBJECT,
      width: 20,
      height: 20,
      fill: 'rgb(255,255,255)',
      stroke: 'blue',
      strokeWidth: 3,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeLineJoin: 'bevel',
      strokeMiterLimit: 5,
      opacity: 0.34,
      points: expectedPoints,
      left: 20,
      top: 20,
    });
  });
});

function getPoints() {
  return [
    { x: 10, y: 12 },
    { x: 20, y: 22 },
  ];
}
