import { describe, expect, it } from 'vitest';
import { version } from '../../package.json';
import { Rect } from './Rect';
import { FabricObject } from './Object/FabricObject';
import { Gradient } from '../gradient';
import { Pattern } from '../Pattern';
// will require some kind of handling here
import { getEnv } from '../env';
import { loadSVGFromString } from '../parser/loadSVGFromString';
import { createReferenceObject } from '../../test/utils';

const REFERENCE_RECT = createReferenceObject('Rect', {
  rx: 0,
  ry: 0,
});

describe('Rect', () => {
  it('constructor', function () {
    const rect = new Rect();

    expect(rect).toBeInstanceOf(Rect);
    expect(rect, 'Inherits from FabricObject').toBeInstanceOf(FabricObject);
    expect(rect.constructor.type).toBe('Rect');
  });

  it('cache properties', function () {
    expect(Rect.cacheProperties, 'rx is in cacheProperties array').toContain(
      'rx',
    );
    expect(Rect.cacheProperties, 'ry is in cacheProperties array').toContain(
      'ry',
    );
  });
  it('toObject', function () {
    const rect = new Rect();
    const object = rect.toObject();
    expect(object).toEqual(REFERENCE_RECT);
  });
  it('fromObject', async () => {
    const rect = await Rect.fromObject(REFERENCE_RECT);
    expect(rect).toBeInstanceOf(Rect);
    expect(rect.toObject()).toEqual(REFERENCE_RECT);

    const expectedObject = {
      ...REFERENCE_RECT,
      fill: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 0 },
        colorStops: [
          { offset: '0', color: 'rgb(255,0,0)', opacity: 1 },
          { offset: '1', color: 'rgb(0,0,255)', opacity: 1 },
        ],
        offsetX: 0,
        offsetY: 0,
      },
      stroke: {
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 0 },
        colorStops: [
          { offset: '0', color: 'rgb(255,0,0)', opacity: 1 },
          { offset: '1', color: 'rgb(0,0,255)', opacity: 1 },
        ],
        offsetX: 0,
        offsetY: 0,
      },
    };
    const rect2 = await Rect.fromObject(expectedObject);
    expect(rect2.fill).toBeInstanceOf(Gradient);
    expect(rect2.stroke).toBeInstanceOf(Gradient);
  });
  it('Rect.fromObject with pattern fill', async () => {
    const fillObj = {
      type: 'Pattern',
      source:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
    };
    const rect = await Rect.fromObject({ fill: fillObj });
    expect(rect.fill).toBeInstanceOf(Pattern);
  });

  it('Rect.fromElement', async () => {
    const elRect = getEnv().document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    const rect = await Rect.fromElement(elRect);
    expect(rect).toBeInstanceOf(Rect);
    expect(rect.toObject()).toEqual({ ...REFERENCE_RECT, visible: false });
  });

  it('fromElement with custom attributes', async () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const elRectWithAttrs = getEnv().document.createElementNS(
      namespace,
      'rect',
    );
    elRectWithAttrs.setAttributeNS(namespace, 'x', '10');
    elRectWithAttrs.setAttributeNS(namespace, 'y', '20');
    elRectWithAttrs.setAttributeNS(namespace, 'width', '222');
    elRectWithAttrs.setAttributeNS(namespace, 'height', '333');
    elRectWithAttrs.setAttributeNS(namespace, 'rx', '11');
    elRectWithAttrs.setAttributeNS(namespace, 'ry', '12');
    elRectWithAttrs.setAttributeNS(namespace, 'fill', 'rgb(255,255,255)');
    elRectWithAttrs.setAttributeNS(namespace, 'opacity', '0.45');
    elRectWithAttrs.setAttributeNS(namespace, 'stroke', 'blue');
    elRectWithAttrs.setAttributeNS(namespace, 'stroke-width', '3');
    elRectWithAttrs.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elRectWithAttrs.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elRectWithAttrs.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elRectWithAttrs.setAttributeNS(namespace, 'stroke-miterlimit', '5');
    elRectWithAttrs.setAttributeNS(
      namespace,
      'vector-effect',
      'non-scaling-stroke',
    );
    const rectWithAttrs = await Rect.fromElement(elRectWithAttrs);
    expect(rectWithAttrs).toBeInstanceOf(Rect);
    expect(rectWithAttrs.strokeUniform, 'strokeUniform is parsed').toBe(true);
    const expectedObject = {
      ...REFERENCE_RECT,
      left: 10,
      top: 20,
      width: 222,
      height: 333,
      fill: 'rgb(255,255,255)',
      opacity: 0.45,
      stroke: 'blue',
      strokeWidth: 3,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeLineJoin: 'bevel',
      strokeMiterLimit: 5,
      rx: 11,
      ry: 12,
      strokeUniform: true,
    };
    expect(rectWithAttrs.toObject()).toEqual(expectedObject);
  });

  it('clone with rounded corners', async () => {
    const rect = new Rect({ width: 100, height: 100, rx: 20, ry: 30 });
    const clone = await rect.clone();
    expect(clone.get('rx'), rect.get('rx'));
    expect(clone.get('ry'), rect.get('ry'));
  });

  it('toSVG with rounded corners', async () => {
    const rect = new Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      rx: 20,
      ry: 30,
      strokeWidth: 0,
    });
    const svg = rect.toSVG();

    expect(svg).toBe(
      '<g transform="matrix(1 0 0 1 50 50)"  >\n<rect style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x="-50" y="-50" rx="20" ry="30" width="100" height="100" />\n</g>\n',
    );
  });

  it('toSVG with alpha colors fill', async () => {
    const rect = new Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      strokeWidth: 0,
      fill: 'rgba(255, 0, 0, 0.5)',
    });
    const svg = rect.toSVG();
    expect(svg).toBe(
      '<g transform="matrix(1 0 0 1 50 50)"  >\n<rect style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-opacity: 0.5; fill-rule: nonzero; opacity: 1;"  x="-50" y="-50" rx="0" ry="0" width="100" height="100" />\n</g>\n',
    );
  });

  it('toSVG with id', async () => {
    const rect = new Rect({
      id: 'myRect',
      width: 100,
      height: 100,
      strokeWidth: 0,
      fill: 'rgba(255, 0, 0, 0.5)',
    });
    const svg = rect.toSVG();
    expect(svg).toBe(
      '<g transform="matrix(1 0 0 1 0 0)" id="myRect"  >\n<rect style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-opacity: 0.5; fill-rule: nonzero; opacity: 1;"  x="-50" y="-50" rx="0" ry="0" width="100" height="100" />\n</g>\n',
    );
  });

  it('toSVG with alpha colors stroke', async () => {
    const rect = new Rect({
      top: 50,
      width: 100,
      height: 100,
      strokeWidth: 0,
      fill: '',
      stroke: 'rgba(255, 0, 0, 0.5)',
    });
    const svg = rect.toSVG();
    expect(svg).toBe(
      '<g transform="matrix(1 0 0 1 0 50)"  >\n<rect style="stroke: rgb(255,0,0); stroke-opacity: 0.5; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"  x="-50" y="-50" rx="0" ry="0" width="100" height="100" />\n</g>\n',
    );
  });

  it('toSVG with paintFirst set to stroke', async () => {
    const rect = new Rect({
      left: 50,
      width: 100,
      height: 100,
      paintFirst: 'stroke',
    });
    const svg = rect.toSVG();
    expect(svg).toBe(
      '<g transform="matrix(1 0 0 1 50 0)"  >\n<rect style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  paint-order="stroke"  x="-50" y="-50" rx="0" ry="0" width="100" height="100" />\n</g>\n',
    );
  });

  it('toObject without default values', async () => {
    const options = {
      width: 69,
      height: 50,
      left: 10,
      top: 20,
      version,
    };
    const rect = new Rect(options);
    rect.includeDefaultValues = false;
    expect(rect.toObject()).toEqual({ type: 'Rect', ...options });
  });

  it('paintFirst life cycle', async () => {
    const svg =
      '<svg><rect x="10" y="10" height="50" width="55" fill="red" stroke="blue" paint-order="stroke" /></svg>';
    const { objects } = await loadSVGFromString(svg);
    const rect = objects[0];
    expect(rect).toBeTruthy();
    const rectObject = rect!.toObject();
    const rectSvg = rect!.toSVG();
    expect(rect?.paintFirst).toBe('stroke');
    expect(rectObject.paintFirst).toBe('stroke');
    expect(rectSvg).toContain('paint-order="stroke"');
  });

  describe('svg attribute injection', () => {
    it('properties are properly escaped', () => {
      const rect = new Rect({
        id: 'asd"><script>alert(1)</script>',
        width: 100,
        height: 100,
      });
      const svg = rect.toSVG();
      expect(svg).toContain(
        `id="asd&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"`,
      );
    });
    it('polyglot test', () => {
      const polyglotPayload =
        'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )';
      const rect = new Rect({ id: polyglotPayload, width: 100, height: 100 });
      const svg = rect.toSVG();
      // Should escape all special characters
      expect(svg).not.toContain(polyglotPayload);
    });
  });
});
