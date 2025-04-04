import { getFabricDocument } from '../env';
import { FabricObject } from '../shapes/Object/FabricObject';
import { Gradient } from './Gradient';
import type { GradientUnits, SVGOptions } from './typedefs';
import { classRegistry } from '../ClassRegistry';

import { describe, expect, it, test, vitest } from 'vitest';

vitest.mock('../util/internals/uid', () => ({
  uid: () => 0,
}));

function createLinearGradient(units: GradientUnits = 'pixels') {
  return new Gradient({
    type: 'linear',
    gradientUnits: units,
    coords: {
      x1: 0,
      y1: 10,
      x2: 100,
      y2: 200,
    },
    colorStops: [
      { offset: 0, color: 'rgba(255,0,0,0)' },
      { offset: 1, color: 'green' },
    ],
  });
}

function createRadialGradient(units: GradientUnits = 'pixels') {
  return new Gradient({
    type: 'radial',
    gradientUnits: units,
    coords: {
      x1: 0,
      y1: 10,
      x2: 100,
      y2: 200,
      r1: 0,
      r2: 50,
    },
    colorStops: [
      { offset: 0, color: 'red' },
      { offset: 1, color: 'rgba(0,255,0,0)' },
    ],
  });
}

const SVG_LINEAR =
  '<linearGradient id="SVGID_0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 -50 -50)"  x1="0" y1="10" x2="100" y2="200">\n<stop offset="0%" style="stop-color:rgba(255,0,0,0);"/>\n<stop offset="100%" style="stop-color:green;"/>\n</linearGradient>\n';
const SVG_RADIAL =
  '<radialGradient id="SVGID_0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 -50 -50)"  cx="100" cy="200" r="50" fx="0" fy="10">\n<stop offset="0%" style="stop-color:red;"/>\n<stop offset="100%" style="stop-color:rgba(0,255,0,0);"/>\n</radialGradient>\n';
const SVG_INTERNALRADIUS =
  '<radialGradient id="SVGID_0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 -50 -50)"  cx="100" cy="200" r="50" fx="0" fy="10">\n<stop offset="20%" style="stop-color:red;"/>\n<stop offset="100%" style="stop-color:green;stop-opacity: 0"/>\n</radialGradient>\n';
const SVG_SWAPPED =
  '<radialGradient id="SVGID_0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 -50 -50)"  cx="0" cy="10" r="50" fx="100" fy="200">\n<stop offset="20%" style="stop-color:green;stop-opacity: 0"/>\n<stop offset="100%" style="stop-color:red;"/>\n</radialGradient>\n';
const SVG_LINEAR_PERCENTAGE =
  '<linearGradient id="SVGID_0" gradientUnits="objectBoundingBox" gradientTransform="matrix(1 0 0 1 0 0)"  x1="0" y1="10" x2="100" y2="200">\n<stop offset="0%" style="stop-color:red;stop-opacity: 0"/>\n<stop offset="100%" style="stop-color:green;"/>\n</linearGradient>\n';
const SVG_RADIAL_PERCENTAGE =
  '<radialGradient id="SVGID_0" gradientUnits="objectBoundingBox" gradientTransform="matrix(1 0 0 1 0 0)"  cx="100" cy="200" r="50" fx="0" fy="10">\n<stop offset="0%" style="stop-color:red;"/>\n<stop offset="100%" style="stop-color:green;stop-opacity: 0"/>\n</radialGradient>\n';

describe('Gradient', () => {
  function fromElement(
    gradientDef: SVGGradientElement,
    obj: FabricObject,
    options: Partial<SVGOptions> = {},
  ) {
    return Gradient.fromElement(gradientDef, obj, {
      width: 0,
      height: 0,
      viewBoxHeight: 0,
      viewBoxWidth: 0,
      opacity: 1,
      ...options,
    } as SVGOptions);
  }

  test('constructor linearGradient', () => {
    const gradient = createLinearGradient();
    expect(gradient instanceof Gradient).toBe(true);
  });

  test('constructor radialGradient', () => {
    const gradient = createRadialGradient();
    expect(gradient instanceof Gradient).toBe(true);
  });

  test('properties linearGradient', () => {
    const gradient = createLinearGradient();

    expect(gradient.coords.x1).toBe(0);
    expect(gradient.coords.y1).toBe(10);
    expect(gradient.coords.x2).toBe(100);
    expect(gradient.coords.y2).toBe(200);

    expect(gradient.type).toBe('linear');

    expect(gradient.colorStops[0].offset).toBe(0);
    expect(gradient.colorStops[0].color).toBe('rgba(255,0,0,0)');

    expect(gradient.colorStops[1].offset).toBe(1);
    expect(gradient.colorStops[1].color).toBe('green');
  });

  test('toSVG', () => {
    const gradient = createLinearGradient();
    expect(gradient.toSVG, 'toSVG function exists').toBeTruthy();
  });

  describe('SVG exports', () => {
    test('toSVG linear', () => {
      const gradient = createLinearGradient();
      const baseObj = new FabricObject({ width: 100, height: 100 });
      expect(gradient.toSVG(baseObj)).toEqual(SVG_LINEAR);
    });

    test('toSVG radial', () => {
      const gradient = createRadialGradient();
      const baseObj = new FabricObject({ width: 100, height: 100 });
      expect(gradient.toSVG(baseObj)).toEqual(SVG_RADIAL);
    });

    // QUnit.test('toSVG radial with r1 > 0', function (assert) {
    //   var gradient = createRadialGradientWithInternalRadius();
    //   var obj = new fabric.Object({ width: 100, height: 100 });
    //   assert.equalSVG(gradient.toSVG(obj), SVG_INTERNALRADIUS);
    // });

    // QUnit.test('toSVG radial with r1 > 0 swapped', function (assert) {
    //   var gradient = createRadialGradientSwapped();
    //   var obj = new fabric.Object({ width: 100, height: 100 });
    //   const gradientColorStops = JSON.stringify(gradient.colorStops);
    //   assert.equalSVG(
    //     gradient.toSVG(obj),
    //     SVG_SWAPPED,
    //     'it exports as expected',
    //   );
    //   const gradientColorStopsAfterExport = JSON.stringify(gradient.colorStops);
    //   assert.equalSVG(
    //     gradient.toSVG(obj),
    //     SVG_SWAPPED,
    //     'it exports as expected a second time',
    //   );
    //   assert.equalSVG(
    //     gradientColorStops,
    //     gradientColorStopsAfterExport,
    //     'colorstops do not change',
    //   );
    // });

    // QUnit.test('toSVG linear objectBoundingBox', function (assert) {
    //   var gradient = createLinearGradient('percentage');
    //   var obj = new fabric.Object({ width: 100, height: 100 });
    //   assert.equalSVG(gradient.toSVG(obj), SVG_LINEAR_PERCENTAGE);
    // });

    // QUnit.test('toSVG radial objectBoundingBox', function (assert) {
    //   var gradient = createRadialGradient('percentage');
    //   var obj = new fabric.Object({ width: 100, height: 100 });
    //   assert.equalSVG(gradient.toSVG(obj), SVG_RADIAL_PERCENTAGE);
    // });
  });

  test('registered in class registry', () => {
    expect(classRegistry.getClass('gradient')).toEqual(Gradient);
    expect(classRegistry.getClass('linear')).toEqual(Gradient);
    expect(classRegistry.getClass('radial')).toEqual(Gradient);
  });

  test('fromElement linearGradient', () => {
    expect(typeof Gradient.fromElement === 'function').toBeTruthy();

    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'linearGradient',
    );
    const stop1 = getFabricDocument().createElement('stop');
    const stop2 = getFabricDocument().createElement('stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    const object = new FabricObject({ width: 100, height: 100 });
    const gradient = fromElement(element, object, { opacity: '' });

    expect(gradient instanceof Gradient).toBeTruthy();
    expect(gradient.type).toEqual('linear');
    expect(gradient.coords.x1).toEqual(0);
    expect(gradient.coords.y1).toEqual(0);
    expect(gradient.coords.x2).toEqual(1);
    expect(gradient.coords.y2).toEqual(0);
    expect(gradient.gradientUnits).toEqual('percentage');

    expect(gradient.colorStops[0].offset).toEqual(1);
    expect(gradient.colorStops[1].offset).toEqual(0);

    expect(gradient.colorStops[0].color).toEqual('rgba(0,0,0,0)');
    expect(gradient.colorStops[1].color).toEqual('rgba(255,255,255,1)');
  });

  test('fromElement linearGradient with floats percentage - objectBoundingBox', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'linearGradient',
    );
    element.setAttributeNS(namespace, 'gradientUnits', 'objectBoundingBox');
    element.setAttributeNS(namespace, 'x1', '10%');
    element.setAttributeNS(namespace, 'y1', '0.2%');
    element.setAttributeNS(namespace, 'x2', '200');
    element.setAttributeNS(namespace, 'y2', '20%');
    const stop1 = getFabricDocument().createElement('stop');
    const stop2 = getFabricDocument().createElement('stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    const object = new FabricObject({ width: 200, height: 200 });
    const gradient = fromElement(element, object, { opacity: '' });

    expect(gradient instanceof Gradient).toBeTruthy();

    expect(gradient.coords.x1).toEqual(0.1);
    expect(gradient.coords.y1).toEqual(0.002);
    expect(gradient.coords.x2).toEqual(200);
    expect(gradient.coords.y2).toEqual(0.2);
    expect(gradient.gradientUnits).toEqual('percentage');
  });

  test('fromElement linearGradient with floats percentage - userSpaceOnUse', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'linearGradient',
    );
    element.setAttributeNS(namespace, 'gradientUnits', 'userSpaceOnUse');
    element.setAttributeNS(namespace, 'x1', '10%');
    element.setAttributeNS(namespace, 'y1', '0.2%');
    element.setAttributeNS(namespace, 'x2', '200');
    element.setAttributeNS(namespace, 'y2', '20%');
    const stop1 = getFabricDocument().createElement('stop');
    const stop2 = getFabricDocument().createElement('stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    const object = new FabricObject({
      left: 10,
      top: 15,
      width: 200,
      height: 200,
    });
    const gradient = fromElement(element, object, {
      opacity: '',
      viewBoxWidth: 400,
      viewBoxHeight: 300,
    });

    expect(gradient instanceof Gradient).toBeTruthy();
    expect(gradient.gradientUnits).toEqual('pixels');
    expect(gradient.offsetX).toEqual(-10);
    expect(gradient.offsetY).toEqual(-15);
    expect(gradient.coords.x1).toEqual(40);
    expect(gradient.coords.y1).toEqual(0.6);
    expect(gradient.coords.x2).toEqual(200);
    expect(gradient.coords.y2).toEqual(60);
  });

  test('fromElement linearGradient with Infinity', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'linearGradient',
    );
    const stop1 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop2 = getFabricDocument().createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.setAttributeNS(namespace, 'x1', '-Infinity');
    element.setAttributeNS(namespace, 'x2', 'Infinity');
    element.setAttributeNS(namespace, 'y1', 'Infinity');
    element.setAttributeNS(namespace, 'y2', '-Infinity');
    element.appendChild(stop1);
    element.appendChild(stop2);

    const object = new FabricObject({
      width: 100,
      height: 300,
      top: 20,
      left: 30,
    });
    const gradient = fromElement(element, object, { opacity: '' });

    expect(gradient instanceof Gradient).toBeTruthy();

    expect(gradient.coords.x1).toEqual(0);
    expect(gradient.coords.y1).toEqual(1);
    expect(gradient.coords.x2).toEqual(1);
    expect(gradient.coords.y2).toEqual(0);

    expect(gradient.colorStops[0].offset).toEqual(1);
    expect(gradient.colorStops[1].offset).toEqual(0);

    expect(gradient.colorStops[0].color).toEqual('rgba(0,0,0,0)');
    expect(gradient.colorStops[1].color).toEqual('rgba(255,255,255,1)');
  });

  test('fromElement without stop', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'linearGradient',
    );
    const stop1 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop2 = getFabricDocument().createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    const object = new FabricObject({ width: 100, height: 100 });
    const gradient = fromElement(element, object, { opacity: '' });

    expect(gradient instanceof Gradient).toBeTruthy();

    expect(gradient.colorStops[0].offset).toEqual(1);
    expect(gradient.colorStops[1].offset).toEqual(0);
  });

  describe('fromElement with x1,x2,y1,2 linear', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'linearGradient',
    );

    element.setAttributeNS(namespace, 'x1', '30%');
    element.setAttributeNS(namespace, 'x2', '20%');
    element.setAttributeNS(namespace, 'y1', '0.1');
    element.setAttributeNS(namespace, 'y2', 'Infinity');

    const object = new FabricObject({ width: 200, height: 200 });
    const gradient = fromElement(element, object, { opacity: '' });
    expect(gradient.coords.x1).toEqual(0.3);
    expect(gradient.coords.y1).toEqual(0.1);
    expect(gradient.coords.x2).toEqual(0.2);
    expect(gradient.coords.y2).toEqual(1);

    it('top and left do not change the output', () => {
      const object = new FabricObject({
        width: 200,
        height: 200,
        top: 50,
        left: 10,
      });
      const gradient = fromElement(element, object, { opacity: '' });
      expect(gradient.coords.x1).toEqual(0.3);
      expect(gradient.coords.y1).toEqual(0.1);
      expect(gradient.coords.x2).toEqual(0.2);
      expect(gradient.coords.y2).toEqual(1);
    });
  });

  describe('fromElement with x1,x2,y1,2 radial', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'radialGradient',
    );

    element.setAttributeNS(namespace, 'fx', '30%');
    element.setAttributeNS(namespace, 'fy', '20%');
    element.setAttributeNS(namespace, 'cx', '0.1');
    element.setAttributeNS(namespace, 'cy', '1');
    element.setAttributeNS(namespace, 'r', '100%');

    let object = new FabricObject({ width: 200, height: 200 });
    let gradient = fromElement(element, object, { opacity: '' });
    it('should not change with width height', () => {
      expect(gradient.coords.x1).toEqual(0.3);
      expect(gradient.coords.y1).toEqual(0.2);
      expect(gradient.coords.x2).toEqual(0.1);
      expect(gradient.coords.y2).toEqual(1);
      expect(gradient.coords.r1).toEqual(0);
      expect(gradient.coords.r2).toEqual(1);
    });

    it('should not change with top left', () => {
      object = new FabricObject({ width: 200, height: 200, top: 10, left: 10 });
      gradient = fromElement(element, object, { opacity: '' });
      expect(gradient.coords.x1).toEqual(0.3);
      expect(gradient.coords.y1).toEqual(0.2);
      expect(gradient.coords.x2).toEqual(0.1);
      expect(gradient.coords.y2).toEqual(1);
      expect(gradient.coords.r1).toEqual(0);
      expect(gradient.coords.r2).toEqual(1);
    });
  });

  describe('fromElement with x1,x2,y1,2 radial userSpaceOnUse', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'radialGradient',
    );

    element.setAttributeNS(namespace, 'fx', '30');
    element.setAttributeNS(namespace, 'fy', '20');
    element.setAttributeNS(namespace, 'cx', '15');
    element.setAttributeNS(namespace, 'cy', '18');
    element.setAttributeNS(namespace, 'r', '100');
    element.setAttributeNS(namespace, 'gradientUnits', 'userSpaceOnUse');

    it('should not change with width height', () => {
      const object = new FabricObject({ width: 200, height: 200 });
      const gradient = fromElement(element, object, { opacity: '' });
      expect(gradient.coords.x1).toEqual(30);
      expect(gradient.coords.y1).toEqual(20);
      expect(gradient.coords.x2).toEqual(15);
      expect(gradient.coords.y2).toEqual(18);
      expect(gradient.coords.r1).toEqual(0);
      expect(gradient.coords.r2).toEqual(100);
    });

    it('should not change with top left', () => {
      const object = new FabricObject({
        width: 200,
        height: 200,
        top: 50,
        left: 60,
      });
      const gradient = fromElement(element, object, { opacity: '' });
      expect(gradient.coords.x1).toEqual(30);
      expect(gradient.coords.y1).toEqual(20);
      expect(gradient.coords.x2).toEqual(15);
      expect(gradient.coords.y2).toEqual(18);
      expect(gradient.coords.r1).toEqual(0);
      expect(gradient.coords.r2).toEqual(100);
    });
  });

  describe('fromElement with x1,x2,y1,2 linear userSpaceOnUse', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'linearGradient',
    );

    element.setAttributeNS(namespace, 'x1', '30');
    element.setAttributeNS(namespace, 'y1', '20');
    element.setAttributeNS(namespace, 'x2', '15');
    element.setAttributeNS(namespace, 'y2', '18');
    element.setAttributeNS(namespace, 'gradientUnits', 'userSpaceOnUse');

    it('should not change with width height', () => {
      const object = new FabricObject({ width: 200, height: 200 });
      const gradient = fromElement(element, object, { opacity: '' });
      expect(gradient.coords.x1).toEqual(30);
      expect(gradient.coords.y1).toEqual(20);
      expect(gradient.coords.x2).toEqual(15);
      expect(gradient.coords.y2).toEqual(18);
    });

    it('should not change with top left', () => {
      const object = new FabricObject({
        width: 200,
        height: 200,
        top: 40,
        left: 40,
      });
      const gradient = fromElement(element, object, { opacity: '' });
      expect(gradient.coords.x1).toEqual(30);
      expect(gradient.coords.y1).toEqual(20);
      expect(gradient.coords.x2).toEqual(15);
      expect(gradient.coords.y2).toEqual(18);
    });
  });

  test('fromElement radialGradient defaults', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'radialGradient',
    );
    const stop1 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop2 = getFabricDocument().createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');

    element.appendChild(stop1);
    element.appendChild(stop2);

    const object = new FabricObject({ width: 100, height: 100 });
    const gradient = fromElement(element, object, {}) as Gradient<'radial'>;

    expect(gradient instanceof Gradient).toBeTruthy();

    expect(gradient.coords.x1).toEqual(0.5);
    expect(gradient.coords.y1).toEqual(0.5);
    expect(gradient.coords.x2).toEqual(0.5);
    expect(gradient.coords.y2).toEqual(0.5);
    expect(gradient.coords.r1).toEqual(0);
    expect(gradient.coords.r2).toEqual(0.5);

    expect(gradient.colorStops[0].offset).toEqual(1);
    expect(gradient.colorStops[1].offset).toEqual(0);

    expect(gradient.colorStops[0].color).toEqual('rgba(0,0,0,1)');
    expect(gradient.colorStops[1].color).toEqual('rgba(255,255,255,1)');
  });

  test('fromElement radialGradient with transform', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'radialGradient',
    );
    const stop1 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop2 = getFabricDocument().createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.setAttributeNS(
      namespace,
      'gradientTransform',
      'matrix(3.321 -0.6998 0.4077 1.9347 -440.9168 -408.0598)',
    );
    const object = new FabricObject({ width: 100, height: 100 });
    const gradient = fromElement(element, object, {});
    expect(gradient.gradientTransform).toEqual([
      3.321, -0.6998, 0.4077, 1.9347, -440.9168, -408.0598,
    ]);
  });

  test('fromElement linearGradient colorStop attributes/styles', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'linearGradient',
    );
    const stop1 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop2 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop3 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop4 = getFabricDocument().createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', '');
    stop1.setAttributeNS(namespace, 'stop-opacity', '');

    stop2.setAttributeNS(namespace, 'offset', '0.5');
    stop2.setAttributeNS(
      namespace,
      'style',
      'stop-color: black; stop-opacity:;',
    );
    stop2.setAttributeNS(namespace, 'stop-color', 'white');

    stop3.setAttributeNS(namespace, 'offset', '75%');
    stop3.setAttributeNS(namespace, 'style', 'stop-color:; stop-opacity:;');
    stop3.setAttributeNS(namespace, 'stop-opacity', '0.9');
    stop3.setAttributeNS(namespace, 'stop-color', 'blue');

    stop4.setAttributeNS(namespace, 'offset', '100%');
    stop4.setAttributeNS(
      namespace,
      'style',
      'stop-color: red; stop-opacity: 0.5;',
    );
    stop4.setAttributeNS(namespace, 'stop-opacity', '0.9');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.appendChild(stop3);
    element.appendChild(stop4);

    const object = new FabricObject({ width: 100, height: 100 });
    const gradient = fromElement(element, object, { opacity: '' });

    expect(gradient instanceof Gradient).toBeTruthy();

    expect(gradient.coords.x1).toEqual(0);
    expect(gradient.coords.y1).toEqual(0);
    expect(gradient.coords.x2).toEqual(1);
    expect(gradient.coords.y2).toEqual(0);

    expect(gradient.colorStops[0].offset).toEqual(1);
    expect(gradient.colorStops[1].offset).toEqual(0.75);
    expect(gradient.colorStops[2].offset).toEqual(0.5);
    expect(gradient.colorStops[3].offset).toEqual(0);

    expect(gradient.colorStops[0].color).toEqual('rgba(255,0,0,0.5)');
    expect(gradient.colorStops[1].color).toEqual('rgba(0,0,255,0.9)');
    expect(gradient.colorStops[2].color).toEqual('rgba(0,0,0,1)');
    expect(gradient.colorStops[3].color).toEqual('rgba(0,0,0,1)');
  });

  test('fromElement radialGradient colorStop attributes/styles', () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const element = getFabricDocument().createElementNS(
      namespace,
      'radialGradient',
    );
    const stop1 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop2 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop3 = getFabricDocument().createElementNS(namespace, 'stop');
    const stop4 = getFabricDocument().createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', '');
    stop1.setAttributeNS(namespace, 'stop-opacity', '');

    stop2.setAttributeNS(namespace, 'offset', '0.5');
    stop2.setAttributeNS(
      namespace,
      'style',
      'stop-color: black; stop-opacity:;',
    );
    stop2.setAttributeNS(namespace, 'stop-color', 'white');

    stop3.setAttributeNS(namespace, 'offset', '75%');
    stop3.setAttributeNS(namespace, 'style', 'stop-color:; stop-opacity:;');
    stop3.setAttributeNS(namespace, 'stop-opacity', '0.9');
    stop3.setAttributeNS(namespace, 'stop-color', 'blue');

    stop4.setAttributeNS(namespace, 'offset', '100%');
    stop4.setAttributeNS(
      namespace,
      'style',
      'stop-color: red; stop-opacity: 0.5;',
    );
    stop4.setAttributeNS(namespace, 'stop-opacity', '0.9');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.appendChild(stop3);
    element.appendChild(stop4);

    const object = new FabricObject({ width: 100, height: 100 });
    const gradient = fromElement(element, object, { opacity: '' });

    expect(gradient instanceof Gradient).toBeTruthy();

    expect(gradient.colorStops[0].offset).toEqual(1);
    expect(gradient.colorStops[1].offset).toEqual(0.75);
    expect(gradient.colorStops[2].offset).toEqual(0.5);
    expect(gradient.colorStops[3].offset).toEqual(0);

    expect(gradient.colorStops[0].color).toEqual('rgba(255,0,0,0.5)');
    expect(gradient.colorStops[1].color).toEqual('rgba(0,0,255,0.9)');
    expect(gradient.colorStops[2].color).toEqual('rgba(0,0,0,1)');
    expect(gradient.colorStops[3].color).toEqual('rgba(0,0,0,1)');
  });
});

/**
 * 
 * (function() {

  function createRadialGradientWithInternalRadius() {
    return new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: 0,
        y1: 10,
        x2: 100,
        y2: 200,
        r1: 10,
        r2: 50
      },
      colorStops: [
        { offset: 0, color: 'red' },
        { offset: 1, color: 'green', opacity: 0 }
      ]
    });
  }

  function createRadialGradientSwapped() {
    return new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: 0,
        y1: 10,
        x2: 100,
        y2: 200,
        r1: 50,
        r2: 10
      },
      colorStops: [
        { offset: 0, color: 'red' },
        { offset: 1, color: 'green', opacity: 0 }
      ]
    });
  }
  


  QUnit.test('properties radialGradient', function(assert) {
    var gradient = createRadialGradient();

    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 10);
    assert.equal(gradient.coords.x2, 100);
    assert.equal(gradient.coords.y2, 200);
    assert.equal(gradient.coords.r1, 0);
    assert.equal(gradient.coords.r2, 50);

    assert.equal(gradient.type, 'radial');

    assert.equal(gradient.colorStops[0].offset, 0);
    assert.equal(gradient.colorStops[0].color, 'red');
    assert.ok(!('opacity' in gradient.colorStops[0]));

    assert.equal(gradient.colorStops[1].offset, 1);
    assert.equal(gradient.colorStops[1].color, 'green');
    assert.equal(gradient.colorStops[1].opacity, 0);
  });

  QUnit.test('toObject linearGradient', function(assert) {
    var gradient = createLinearGradient();
    gradient.gradientTransform = [1, 0, 0, 1, 50, 50];
    assert.ok(typeof gradient.toObject === 'function');

    var object = gradient.toObject();

    assert.deepEqual(object.coords, gradient.coords);
    assert.equal(object.gradientUnits, gradient.gradientUnits);
    assert.equal(object.type, gradient.type);
    assert.deepEqual(object.gradientTransform, gradient.gradientTransform);
    assert.deepEqual(object.colorStops, gradient.colorStops);
  });

  QUnit.test('toObject with custom props', function(assert) {
    var gradient = createLinearGradient();
    gradient.id = 'myId';
    var object = gradient.toObject(['id']);
    assert.equal(object.id, 'myId');
  });

  QUnit.test('toObject radialGradient', function(assert) {
    var gradient = createRadialGradient();

    assert.ok(typeof gradient.toObject === 'function');

    var object = gradient.toObject();

    assert.deepEqual(object.coords, gradient.coords);
    assert.equal(object.type, gradient.type);
    assert.deepEqual(object.colorStops, gradient.colorStops);
  });

  QUnit.test('toLive linearGradient', function(assert) {
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});
    var gradient = createLinearGradient();
    var gradientHTML = canvas.contextContainer.createLinearGradient(0, 0, 1, 1);
    assert.ok(typeof gradient.toLive === 'function');
    var gradientCtx = gradient.toLive(canvas.contextContainer);
    assert.equal(gradientCtx.toString(), gradientHTML.toString(), 'is a gradient for canvas radial');
  });

  QUnit.test('toLive radialGradient', function(assert) {
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false });
    var gradient = createRadialGradient();
    var gradientHTML = canvas.contextContainer.createRadialGradient(0, 0, 1, 1, 2, 2);
    assert.ok(typeof gradient.toLive === 'function');
    var gradientCtx = gradient.toLive(canvas.contextContainer);
    assert.equal(gradientCtx.toString(), gradientHTML.toString(), 'is a gradient for canvas radial');
  });

})();

 */
