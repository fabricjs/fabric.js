import { expect } from '@jest/globals';
import { getFabricDocument } from '../env';
import { FabricObject } from '../shapes/Object/FabricObject';
import { Gradient } from './Gradient';
import type { SVGOptions } from './typedefs';
import { classRegistry } from '../ClassRegistry';

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

  it('registered in class registry', () => {
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

    expect(gradient.colorStops[0].color).toEqual('rgb(0,0,0)');
    expect(gradient.colorStops[1].color).toEqual('rgb(255,255,255)');

    expect(gradient.colorStops[0].opacity).toEqual(0);
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

    expect(gradient.colorStops[0].color).toEqual('rgb(0,0,0)');
    expect(gradient.colorStops[1].color).toEqual('rgb(255,255,255)');

    expect(gradient.colorStops[0].opacity).toEqual(0);
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
    const gradient = fromElement(element, object, {});

    expect(gradient instanceof Gradient).toBeTruthy();

    expect(gradient.coords.x1).toEqual(0.5);
    expect(gradient.coords.y1).toEqual(0.5);
    expect(gradient.coords.x2).toEqual(0.5);
    expect(gradient.coords.y2).toEqual(0.5);
    expect(gradient.coords.r1).toEqual(0);
    expect(gradient.coords.r2).toEqual(0.5);

    expect(gradient.colorStops[0].offset).toEqual(1);
    expect(gradient.colorStops[1].offset).toEqual(0);

    expect(gradient.colorStops[0].color).toEqual('rgb(0,0,0)');
    expect(gradient.colorStops[1].color).toEqual('rgb(255,255,255)');
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

    expect(gradient.colorStops[0].color).toEqual('rgb(255,0,0)');
    expect(gradient.colorStops[1].color).toEqual('rgb(0,0,255)');
    expect(gradient.colorStops[2].color).toEqual('rgb(0,0,0)');
    expect(gradient.colorStops[3].color).toEqual('rgb(0,0,0)');

    expect(gradient.colorStops[0].opacity).toEqual(0.5);
    expect(gradient.colorStops[1].opacity).toEqual(0.9);
    expect(gradient.colorStops[2].opacity).toEqual(1);
    expect(gradient.colorStops[3].opacity).toEqual(1);
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

    expect(gradient.colorStops[0].color).toEqual('rgb(255,0,0)');
    expect(gradient.colorStops[1].color).toEqual('rgb(0,0,255)');
    expect(gradient.colorStops[2].color).toEqual('rgb(0,0,0)');
    expect(gradient.colorStops[3].color).toEqual('rgb(0,0,0)');

    expect(gradient.colorStops[0].opacity).toEqual(0.5);
    expect(gradient.colorStops[1].opacity).toEqual(0.9);
    expect(gradient.colorStops[2].opacity).toEqual(1);
    expect(gradient.colorStops[3].opacity).toEqual(1);
  });
});
