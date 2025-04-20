import { describe, expect, it } from 'vitest';
import { version } from '../../fabric';
import { Rect } from './Rect';
import { FabricObject } from './Object/FabricObject';
import { Gradient } from '../gradient/Gradient';
import { Pattern } from '../Pattern';
// will require some kind of handling here
import { getEnv } from '../env/node';
const REFERENCE_RECT = {
  version,
  type: 'Rect',
  originX: 'left',
  originY: 'top',
  left: 0,
  top: 0,
  width: 0,
  height: 0,
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
  shadow: null,
  visible: true,
  backgroundColor: '',
  fillRule: 'nonzero',
  paintFirst: 'fill',
  globalCompositeOperation: 'source-over',
  rx: 0,
  ry: 0,
  skewX: 0,
  skewY: 0,
  strokeUniform: false,
};

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
  const elRectWithAttrs = getEnv().document.createElementNS(namespace, 'rect');
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

//   QUnit.test('clone with rounded corners', function (assert) {
//     var done = assert.async();
//     var rect = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 30 });
//     rect.clone().then(function (clone) {
//       assert.equal(clone.get('rx'), rect.get('rx'));
//       assert.equal(clone.get('ry'), rect.get('ry'));
//       done();
//     });
//   });

//   QUnit.test('toSVG with rounded corners', function (assert) {
//     var rect = new fabric.Rect({
//       width: 100,
//       height: 100,
//       rx: 20,
//       ry: 30,
//       strokeWidth: 0,
//     });
//     var svg = rect.toSVG();

//     assert.equal(
//       svg,
//       '<g transform=\"matrix(1 0 0 1 50 50)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-50\" y=\"-50\" rx=\"20\" ry=\"30\" width=\"100\" height=\"100\" />\n</g>\n',
//     );
//   });

//   QUnit.test('toSVG with alpha colors fill', function (assert) {
//     var rect = new fabric.Rect({
//       width: 100,
//       height: 100,
//       strokeWidth: 0,
//       fill: 'rgba(255, 0, 0, 0.5)',
//     });
//     var svg = rect.toSVG();
//     assert.equal(
//       svg,
//       '<g transform=\"matrix(1 0 0 1 50 50)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-opacity: 0.5; fill-rule: nonzero; opacity: 1;\"  x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</g>\n',
//     );
//   });

//   QUnit.test('toSVG with id', function (assert) {
//     var rect = new fabric.Rect({
//       id: 'myRect',
//       width: 100,
//       height: 100,
//       strokeWidth: 0,
//       fill: 'rgba(255, 0, 0, 0.5)',
//     });
//     var svg = rect.toSVG();
//     assert.equal(
//       svg,
//       '<g transform=\"matrix(1 0 0 1 50 50)\" id=\"myRect\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-opacity: 0.5; fill-rule: nonzero; opacity: 1;\"  x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</g>\n',
//     );
//   });

//   QUnit.test('toSVG with alpha colors stroke', function (assert) {
//     var rect = new fabric.Rect({
//       width: 100,
//       height: 100,
//       strokeWidth: 0,
//       fill: '',
//       stroke: 'rgba(255, 0, 0, 0.5)',
//     });
//     var svg = rect.toSVG();
//     assert.equal(
//       svg,
//       '<g transform=\"matrix(1 0 0 1 50 50)\"  >\n<rect style=\"stroke: rgb(255,0,0); stroke-opacity: 0.5; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;\"  x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</g>\n',
//     );
//   });

//   QUnit.test('toSVG with paintFirst set to stroke', function (assert) {
//     var rect = new fabric.Rect({
//       width: 100,
//       height: 100,
//       paintFirst: 'stroke',
//     });
//     var svg = rect.toSVG();
//     assert.equal(
//       svg,
//       '<g transform=\"matrix(1 0 0 1 50.5 50.5)\"  >\n<rect style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  paint-order=\"stroke\"  x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</g>\n',
//     );
//   });

//   QUnit.test('toObject without default values', function (assert) {
//     var options = {
//       width: 69,
//       height: 50,
//       left: 10,
//       top: 20,
//       version: fabric.version,
//     };
//     var rect = new fabric.Rect(options);
//     rect.includeDefaultValues = false;
//     assert.deepEqual(rect.toObject(), { type: 'Rect', ...options });
//   });

//   QUnit.test('paintFirst life cycle', function (assert) {
//     var done = assert.async();
//     var svg =
//       '<svg><rect x="10" y="10" height="50" width="55" fill="red" stroke="blue" paint-order="stroke" /></svg>';
//     fabric.loadSVGFromString(svg).then(({ objects }) => {
//       var rect = objects[0];
//       var rectObject = rect.toObject();
//       var rectSvg = rect.toSVG();
//       assert.equal(rect.paintFirst, 'stroke');
//       assert.equal(rectObject.paintFirst, 'stroke');
//       assert.ok(rectSvg.indexOf('paint-order="stroke"') > -1);
//       done();
//     });
//   });
// })();
