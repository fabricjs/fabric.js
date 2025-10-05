import { describe, it, expect } from 'vitest';
import { Point } from '../Point';
import { getFabricDocument } from '../env';
import { VERSION as version } from '../constants';
import { Polygon } from './Polygon';
import { Polyline } from './Polyline';
import { FabricObject } from './Object/FabricObject';

function getPoints() {
  return [
    { x: 10, y: 12 },
    { x: 20, y: 22 },
  ];
}

const REFERENCE_OBJECT = {
  version: version,
  type: 'Polygon',
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

const REFERENCE_EMPTY_OBJECT = {
  points: [],
  width: 0,
  height: 0,
  top: 0,
  left: 0,
};

describe('Polygon', () => {
  it('constructor', () => {
    expect(Polygon, 'Polygon class should exist').toBeTruthy();

    const polygon = new Polygon(getPoints());

    expect(polygon, 'should be instance of Polygon').toBeInstanceOf(Polygon);
    expect(polygon, 'should be instance of Polyline').toBeInstanceOf(Polyline);
    expect(polygon, 'should be instance of FabricObject').toBeInstanceOf(
      FabricObject,
    );

    expect(polygon.constructor, 'type should be Polygon').toHaveProperty(
      'type',
      'Polygon',
    );
    expect(polygon.get('points'), 'points should match input').toEqual([
      { x: 10, y: 12 },
      { x: 20, y: 22 },
    ]);
  });

  it('constructor, with strokeWidth top-left and origins top-left', () => {
    const polygon = new Polygon(getPoints(), {
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
    });

    expect(polygon.left, 'left should be 9').toBe(9);
    expect(polygon.top, 'top should be 11').toBe(11);
  });

  it('constructor, with strokeWidth top-left and origins center-center', () => {
    const polygon = new Polygon(getPoints(), {
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    expect(polygon.left, 'left should be 15').toBe(15);
    expect(polygon.top, 'top should be 17').toBe(17);
  });

  it('constructor, with strokeWidth top-left and origins bottom-right', () => {
    const polygon = new Polygon(getPoints(), {
      strokeWidth: 2,
      originX: 'right',
      originY: 'bottom',
    });

    expect(polygon.left, 'left should be 21').toBe(21);
    expect(polygon.top, 'top should be 23').toBe(23);
  });

  it('polygon with exactBoundingBox false', () => {
    const polygon = new Polygon(
      [
        { x: 10, y: 10 },
        { x: 20, y: 10 },
        { x: 20, y: 100 },
      ],
      {
        // @ts-expect-error -- TODO: are types wrong for Polygon? seems like it doesn't accept exactBoundingBox property
        exactBoundingBox: false,
        strokeWidth: 60,
      },
    );

    const dimensions = polygon._getNonTransformedDimensions();

    expect(dimensions.x, 'x dimension should be 70').toBe(70);
    expect(dimensions.y, 'y dimension should be 150').toBe(150);
  });

  it('polygon with exactBoundingBox true', () => {
    const polygon = new Polygon(
      [
        { x: 10, y: 10 },
        { x: 10, y: 10 },
        { x: 20, y: 10 },
        { x: 20, y: 10 },
        {
          x: 20,
          y: 10,
        },
        { x: 20, y: 100 },
        { x: 10, y: 10 },
      ],
      {
        // @ts-expect-error -- TODO: are types wrong for Polygon? seems like it doesn't accept exactBoundingBox property
        exactBoundingBox: true,
        strokeWidth: 60,
        stroke: 'blue',
      },
    );

    const limitedMiter = polygon._getNonTransformedDimensions();

    expect(Math.round(limitedMiter.x), 'limited miter x').toBe(74);
    expect(Math.round(limitedMiter.y), 'limited miter y').toBe(123);
    expect(polygon._getTransformedDimensions(), 'dims should match').toEqual(
      limitedMiter,
    );

    polygon.set('strokeMiterLimit', 999);
    const miter = polygon._getNonTransformedDimensions();

    expect(Math.round(miter.x), 'miter x').toBe(74);
    expect(Math.round(miter.y), 'miter y').toBe(662);
    expect(polygon._getTransformedDimensions(), 'dims should match').toEqual(
      miter,
    );

    polygon.set('strokeLineJoin', 'bevel');
    const bevel = polygon._getNonTransformedDimensions();

    expect(Math.round(limitedMiter.x), 'bevel x').toBe(74);
    expect(Math.round(limitedMiter.y), 'bevel y').toBe(123);
    expect(polygon._getTransformedDimensions(), 'dims should match').toEqual(
      bevel,
    );

    polygon.set('strokeLineJoin', 'round');
    const round = polygon._getNonTransformedDimensions();

    expect(Math.round(round.x), 'round x').toBe(70);
    expect(Math.round(round.y), 'round y').toBe(150);
    expect(polygon._getTransformedDimensions(), 'dims should match').toEqual(
      round,
    );
  });

  it.todo('polygon with exactBoundingBox true and skew', () => {
    const polygon = new Polygon(
      [
        { x: 10, y: 10 },
        { x: 20, y: 10 },
        { x: 20, y: 100 },
      ],
      {
        // @ts-expect-error -- TODO: are types wrong for Polygon? seems like it doesn't accept exactBoundingBox property
        exactBoundingBox: true,
        strokeWidth: 60,
        stroke: 'blue',
        skewX: 30,
        skewY: 45,
      },
    );

    const limitedMiter = polygon._getNonTransformedDimensions();

    expect(Math.round(limitedMiter.x), 'limited miter x').toBe(185);
    expect(Math.round(limitedMiter.y), 'limited miter y').toBe(194);
    expect(polygon._getTransformedDimensions(), 'dims should match').toEqual(
      limitedMiter,
    );

    polygon.set('strokeMiterLimit', 999);
    const miter = polygon._getNonTransformedDimensions();

    expect(Math.round(miter.x), 'miter x').toBe(498);
    expect(Math.round(miter.y), 'miter y').toBe(735);
    expect(polygon._getTransformedDimensions(), 'dims should match').toEqual(
      miter,
    );

    polygon.set('strokeLineJoin', 'bevel');
    const bevel = polygon._getNonTransformedDimensions();

    expect(Math.round(limitedMiter.x), 'bevel x').toBe(185);
    expect(Math.round(limitedMiter.y), 'bevel y').toBe(194);
    expect(polygon._getTransformedDimensions(), 'dims should match').toEqual(
      bevel,
    );

    polygon.set('strokeLineJoin', 'round');
    const round = polygon._getNonTransformedDimensions();

    // WRONG value! was buggy when writing test
    expect(Math.round(round.x), 'round x').toBe(170);
    expect(Math.round(round.y), 'round y').toBe(185);
    expect(polygon._getTransformedDimensions(), 'dims should match').toEqual(
      round,
    );
  });

  it('complexity', () => {
    const polygon = new Polygon(getPoints());

    expect(polygon.complexity, 'complexity should be a function').toBeTypeOf(
      'function',
    );
  });

  it('toObject', () => {
    const polygon = new Polygon(getPoints());

    expect(polygon.toObject, 'toObject should be a function').toBeTypeOf(
      'function',
    );

    expect(
      {
        ...polygon.toObject(),
        points: getPoints(),
      },
      'polygon object should match reference',
    ).toEqual(REFERENCE_OBJECT);
  });

  it('toSVG', () => {
    const polygon = new Polygon(getPoints(), { fill: 'red', stroke: 'blue' });

    expect(polygon.toSVG, 'toSVG should be a function').toBeTypeOf('function');

    const EXPECTED_SVG =
      '<g transform="matrix(1 0 0 1 15 17)"  >\n<polygon style="stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  points="-5,-5 5,5 " />\n</g>\n';

    expect(polygon.toSVG(), 'SVG output should match expected').toBe(
      EXPECTED_SVG,
    );
  });

  it('fromObject', async () => {
    expect(Polygon.fromObject, 'fromObject should be a function').toBeTypeOf(
      'function',
    );

    const polygon = await Polygon.fromObject(REFERENCE_OBJECT);

    expect(polygon, 'should be instance of Polygon').toBeInstanceOf(Polygon);
    expect(polygon.toObject(), 'polygon object should match reference').toEqual(
      REFERENCE_OBJECT,
    );
  });

  it('fromElement without points', async () => {
    expect(Polygon.fromElement, 'fromElement should be a function').toBeTypeOf(
      'function',
    );

    const elPolygonWithoutPoints = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon',
    );
    elPolygonWithoutPoints.setAttributeNS(
      'http://www.w3.org/2000/svg',
      'stroke-width',
      String(0),
    );

    const polygon = await Polygon.fromElement(elPolygonWithoutPoints);

    expect(polygon.toObject(), 'polygon object should match reference').toEqual(
      {
        ...REFERENCE_OBJECT,
        ...REFERENCE_EMPTY_OBJECT,
        strokeWidth: 0,
      },
    );
  });

  it('fromElement without points but strokeWidth', async () => {
    const elPolygonWithoutPoints = getFabricDocument().createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon',
    );

    const polygon = await Polygon.fromElement(elPolygonWithoutPoints);

    expect(polygon.toObject(), 'polygon object should match reference').toEqual(
      {
        ...REFERENCE_OBJECT,
        ...REFERENCE_EMPTY_OBJECT,
        left: 0,
        top: 0,
      },
    );
  });

  it('fromElement with empty points', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolygonWithEmptyPoints = getFabricDocument().createElementNS(
      namespace,
      'polygon',
    );

    elPolygonWithEmptyPoints.setAttributeNS(namespace, 'points', '');

    const polygon = await Polygon.fromElement(elPolygonWithEmptyPoints);

    expect(polygon.toObject(), 'polygon object should match reference').toEqual(
      {
        ...REFERENCE_OBJECT,
        ...REFERENCE_EMPTY_OBJECT,
        left: 0,
        top: 0,
      },
    );
  });

  it('fromElement with points', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolygon = getFabricDocument().createElementNS(namespace, 'polygon');

    elPolygon.setAttributeNS(namespace, 'points', '10,12 20,22');

    const polygon = await Polygon.fromElement(elPolygon);

    expect(polygon, 'should be instance of Polygon').toBeInstanceOf(Polygon);
    expect(polygon.toObject(), 'polygon object should match reference').toEqual(
      {
        ...REFERENCE_OBJECT,
        points: [
          { x: 10, y: 12 },
          { x: 20, y: 22 },
        ],
        left: 15,
        top: 17,
      },
    );
  });

  it('fromElement with points no strokewidth', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolygon = getFabricDocument().createElementNS(namespace, 'polygon');

    elPolygon.setAttributeNS(namespace, 'points', '10,12 20,22');
    elPolygon.setAttributeNS(namespace, 'stroke-width', String(0));

    const polygon = await Polygon.fromElement(elPolygon);

    expect(polygon, 'should be instance of Polygon').toBeInstanceOf(Polygon);
    expect(polygon.toObject(), 'polygon object should match reference').toEqual(
      {
        ...REFERENCE_OBJECT,
        strokeWidth: 0,
        points: [
          { x: 10, y: 12 },
          { x: 20, y: 22 },
        ],
        left: 15,
        top: 17,
      },
    );
  });

  it('fromElement with points and custom attributes', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elPolygonWithAttrs = getFabricDocument().createElementNS(
      namespace,
      'polygon',
    );

    elPolygonWithAttrs.setAttributeNS(
      namespace,
      'points',
      '10,10 20,20 30,30 10,10',
    );
    elPolygonWithAttrs.setAttributeNS(namespace, 'fill', 'rgb(255,255,255)');
    elPolygonWithAttrs.setAttributeNS(namespace, 'opacity', '0.34');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-width', '3');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke', 'blue');
    elPolygonWithAttrs.setAttributeNS(
      namespace,
      'transform',
      'translate(-10,-20) scale(2)',
    );
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-miterlimit', '5');

    const polygonWithAttrs = await Polygon.fromElement(elPolygonWithAttrs);

    const expectedPoints = [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 },
      { x: 10, y: 10 },
    ];

    expect(
      polygonWithAttrs.toObject(),
      'polygon object should match reference',
    ).toEqual({
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
      top: 20,
      left: 20,
    });
  });

  it('_calcDimensions with object options', () => {
    const polygon = new Polygon(getPoints(), {
      scaleX: 2,
      scaleY: 3,
      skewX: 20,
      skewY: 30,
      strokeWidth: 20,
      strokeMiterLimit: 10,
      strokeUniform: false,
      strokeLineJoin: 'miter',
      // @ts-expect-error -- TODO: are types wrong for Polygon? seems like it doesn't accept exactBoundingBox property
      exactBoundingBox: true,
    });

    const { left, top, width, height, pathOffset, strokeOffset, strokeDiff } =
      polygon._calcDimensions();

    // Types
    expect(typeof left, 'left should be a number').toBe('number');
    expect(typeof top, 'top should be a number').toBe('number');
    expect(typeof width, 'width should be a number').toBe('number');
    expect(typeof height, 'height should be a number').toBe('number');
    expect(pathOffset, 'pathOffset should be a Point').toBeInstanceOf(Point);
    expect(strokeOffset, 'strokeOffset should be a Point').toBeInstanceOf(
      Point,
    );
    expect(strokeDiff, 'strokeDiff should be a Point').toBeInstanceOf(Point);

    // Values
    expect(left, 'left should match expected value').toBe(10.485714075442775);
    expect(top, 'top should match expected value').toBe(14.784917784669414);
    expect(width, 'width should match expected value').toBe(27.707709196083425);
    expect(height, 'height should match expected value').toBe(
      21.750672506349947,
    );
    expect(pathOffset, 'pathOffset should match expected value').toEqual(
      new Point(14.999999999999998, 17.000000000000004),
    );
    expect(strokeOffset, 'strokeOffset should match expected value').toEqual(
      new Point(11.966623726115365, 8.965754721680533),
    );
    expect(strokeDiff, 'strokeDiff should match expected value').toEqual(
      new Point(23.933247452230738, 17.931509443361065),
    );
  });

  it('_calcDimensions with custom options', () => {
    const polygon = new Polygon(getPoints(), {
      scaleX: 2,
      scaleY: 3,
      skewX: 20,
      skewY: 30,
      strokeWidth: 20,
      strokeMiterLimit: 10,
      strokeUniform: false,
      strokeLineJoin: 'miter',
      // @ts-expect-error -- TODO: are types wrong for Polygon? seems like it doesn't accept exactBoundingBox property
      exactBoundingBox: true,
    });

    const customOptions = {
      scaleX: 4,
      scaleY: 2,
      skewX: 0,
      skewY: 20,
      strokeWidth: 10,
      strokeMiterLimit: 20,
      strokeUniform: true,
      strokeLineJoin: 'miter',
      exactBoundingBox: true,
    } as const;

    const { left, top, width, height, pathOffset, strokeOffset, strokeDiff } =
      polygon._calcDimensions(customOptions);

    // Types
    expect(typeof left, 'left should be a number').toBe('number');
    expect(typeof top, 'top should be a number').toBe('number');
    expect(typeof width, 'width should be a number').toBe('number');
    expect(typeof height, 'height should be a number').toBe('number');
    expect(pathOffset, 'pathOffset should be a Point').toBeInstanceOf(Point);
    expect(strokeOffset, 'strokeOffset should be a Point').toBeInstanceOf(
      Point,
    );
    expect(strokeDiff, 'strokeDiff should be a Point').toBeInstanceOf(Point);

    // Values
    expect(left, 'left should match expected value').toBe(9.440983005625053);
    expect(top, 'top should match expected value').toBe(13.60709991156367);
    expect(width, 'width should match expected value').toBe(11.118033988749893);
    expect(height, 'height should match expected value').toBe(
      17.704907204858728,
    );
    expect(pathOffset, 'pathOffset should match expected value').toEqual(
      new Point(6.825391045997646, 18.518912156261834),
    );
    expect(strokeOffset, 'strokeOffset should match expected value').toEqual(
      new Point(1.1180339887498931, 6.097807293295057),
    );
    expect(strokeDiff, 'strokeDiff should match expected value').toEqual(
      new Point(2.2360679774997863, 12.195614586590114),
    );
  });
});
