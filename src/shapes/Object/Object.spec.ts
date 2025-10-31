import { Shadow } from '../../Shadow';
import { Rect } from '../Rect';
import { FabricObject } from './Object';
import { Group } from '../Group';

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ObjectEvents } from '../../../fabric';
import {
  ActiveSelection,
  Canvas,
  config,
  FabricImage,
  Point,
  runningAnimations,
  StaticCanvas,
  version,
  Object,
} from '../../../fabric';
import { toFixed } from '../../util';

describe('Object', () => {
  const canvas = new StaticCanvas(undefined, { enableRetinaScaling: false });

  afterEach(() => {
    config.configure({
      perfLimitSizeTotal: 2097152,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256,
      devicePixelRatio: 1,
    });
    canvas.enableRetinaScaling = false;
    canvas.setZoom(1);
    canvas.clear();
    canvas.backgroundColor = Canvas.prototype.backgroundColor;
    canvas.calcOffset();
  });

  it('tests constructor & properties', () => {
    expect(typeof FabricObject).toBe('function');
    const cObj = new FabricObject();
    expect(cObj).toBeDefined();
    expect(cObj instanceof FabricObject).toBe(true);
    expect(cObj.constructor).toBe(FabricObject);

    expect((cObj.constructor as typeof FabricObject).type).toBe('FabricObject');
    expect(cObj.includeDefaultValues).toBe(true);

    //TODO: Add message 'object caching default value'
    expect(cObj.objectCaching).toBe(true);
  });
  it('rotate with centered rotation', () => {
    const fObj = new FabricObject({
      originX: 'left',
      centeredRotation: true,
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // test that top changed because of centered rotation
    expect(fObj.top).toBe(0);
    // test that left changed because of centered rotation
    expect(fObj.left).toBe(10);
  });
  it('rotate with origin rotation', () => {
    const fObj = new FabricObject({
      centeredRotation: false,
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // top and left are still 0, 0
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
  });
  it('rotate with centered rotation but origin set to center', () => {
    const fObj = new FabricObject({
      centeredRotation: true,
      originX: 'center',
      originY: 'center',
      width: 10,
      height: 10,
      strokeWidth: 0,
    });
    // test starting defaul values before change
    expect(fObj.angle).toBe(0);
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
    fObj.rotate(180);
    // test that angle has been changed
    expect(fObj.angle).toBe(180);
    // test that left is unchanged because of origin being center
    expect(fObj.top).toBe(0);
    expect(fObj.left).toBe(0);
  });
  describe('needsItsOwnCache', () => {
    it('returns false for default values', () => {
      const rect = new Rect({ width: 100, height: 100 });
      expect(rect.needsItsOwnCache()).toBe(false);
    });
    it('returns true when a clipPath is present', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.clipPath = new Rect({ width: 50, height: 50 });
      expect(rect.needsItsOwnCache()).toBe(true);
    });
    it('returns true when paintFirst is stroke and there is a shadow', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.paintFirst = 'stroke';
      rect.stroke = 'black';
      rect.shadow = new Shadow({ color: 'green' });
      expect(rect.needsItsOwnCache()).toBe(true);
    });
    it('returns false when paintFirst is stroke and there is no shadow', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.paintFirst = 'stroke';
      rect.stroke = 'black';
      rect.shadow = null;
      expect(rect.needsItsOwnCache()).toBe(false);
    });
    it('returns false when paintFirst is stroke but no stroke', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.paintFirst = 'stroke';
      rect.stroke = '';
      rect.shadow = new Shadow({ color: 'green' });
      expect(rect.needsItsOwnCache()).toBe(false);
    });
    it('returns false when paintFirst is stroke but no fill', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.paintFirst = 'stroke';
      rect.stroke = 'black';
      rect.fill = '';
      rect.shadow = new Shadow({ color: 'green' });
      expect(rect.needsItsOwnCache()).toBe(false);
    });
  });
  describe('set method and dirty flag bubbling', () => {
    it('when dirty is true it bubbles', () => {
      const rect = new Rect({ width: 100, height: 100 });
      const group = new Group([rect]);
      group.dirty = false;
      expect(group.dirty).toBe(false);
      rect.set('dirty', true);
      expect(group.dirty).toBe(true);
    });
    it('when dirty is false it does not bubble', () => {
      const rect = new Rect({ width: 100, height: 100 });
      const group = new Group([rect]);
      group.dirty = true;
      expect(group.dirty).toBe(true);
      rect.set('dirty', false);
      expect(group.dirty).toBe(true);
    });
    it('when dirty is true it bubbles to the parent', () => {
      const rect = new Rect({ width: 100, height: 100 });
      rect.group = new Group();
      rect.parent = new Group();
      rect.group.dirty = false;
      rect.parent.dirty = false;
      rect.dirty = false;
      rect.set('dirty', true);
      expect(rect.group.dirty).toBe(false);
      expect(rect.parent.dirty).toBe(true);
    });
  });

  it('test strokeDashArray with an odd number of elements.', () => {
    const dashArrayBase = [1];
    const ctx = {
      setLineDash: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    const obj = new FabricObject({
      strokeDashArray: [1],
    });
    obj._setLineDash(ctx, dashArrayBase);
    expect(ctx.setLineDash).toHaveBeenCalledWith(dashArrayBase);
    expect(obj.strokeDashArray).toEqual([1]);
  });

  it('get', () => {
    const cObj = new FabricObject({
      left: 11,
      top: 22,
      width: 50,
      height: 60,
      opacity: 0.7,
    });

    expect(cObj.get('left'), 'should get left property').toBe(11);
    expect(cObj.get('top'), 'should get top property').toBe(22);
    expect(cObj.get('width'), 'should get width property').toBe(50);
    expect(cObj.get('height'), 'should get height property').toBe(60);
    expect(cObj.get('opacity'), 'should get opacity property').toBe(0.7);
  });

  it('set', () => {
    const cObj = new FabricObject({
      left: 11,
      top: 22,
      width: 50,
      height: 60,
      opacity: 0.7,
    });

    cObj.set('left', 12);
    cObj.set('top', 23);
    cObj.set('width', 51);
    cObj.set('height', 61);
    cObj.set('opacity', 0.5);

    expect(cObj.get('left'), 'left property should be updated').toBe(12);
    expect(cObj.get('top'), 'top property should be updated').toBe(23);
    expect(cObj.get('width'), 'width property should be updated').toBe(51);
    expect(cObj.get('height'), 'height property should be updated').toBe(61);
    expect(cObj.get('opacity'), 'opacity property should be updated').toBe(0.5);

    expect(cObj.set('opacity', 0.5), 'set should be chainable').toBe(cObj);
  });

  it('set with object of prop/values', () => {
    const cObj = new FabricObject({});

    expect(
      cObj.set({ width: 99, height: 88, fill: 'red' }),
      'set should be chainable',
    ).toBe(cObj);

    expect(cObj.get('fill'), 'fill should be set').toBe('red');
    expect(cObj.get('width'), 'width should be set').toBe(99);
    expect(cObj.get('height'), 'height should be set').toBe(88);
  });

  // it('Dynamically generated accessors', () => {
  //   const cObj = new FabricObject({});
  //
  //   expect(typeof cObj.getWidth, 'getWidth should be a function').toBe('function');
  //   expect(typeof cObj.setWidth, 'setWidth should be a function').toBe('function');
  //
  //   expect(typeof cObj.getFill, 'getFill should be a function').toBe('function');
  //   expect(typeof cObj.setFill, 'setFill should be a function').toBe('function');
  //
  //   expect(cObj.setFill('red'), 'setFill should be chainable').toBe(cObj);
  //   expect(cObj.getFill(), 'getFill should return set value').toBe('red');
  //
  //   cObj.setScaleX(2.3);
  //   expect(cObj.getScaleX(), 'getScaleX should return set value').toBe(2.3);
  //
  //   cObj.setOpacity(0.123);
  //   expect(cObj.getOpacity(), 'getOpacity should return set value').toBe(0.123);
  // });

  it('stateProperties', () => {
    const cObj = new FabricObject();

    expect(cObj.constructor, 'stateProperties should exist').toHaveProperty(
      'stateProperties',
    );
    expect(
      'stateProperties' in cObj.constructor &&
        (cObj.constructor.stateProperties as string[]).length > 0,
      'stateProperties should not be empty',
    ).toBeTruthy();
  });

  it('transform', () => {
    const cObj = new FabricObject();

    expect(cObj.transform, 'transform should be a function').toBeTypeOf(
      'function',
    );
  });

  it('toJSON', () => {
    const emptyObjectJSON =
      '{"type":"FabricObject","version":"' +
      version +
      '","originX":"center","originY":"center","left":0,"top":0,"width":0,"height":0,"fill":"rgb(0,0,0)",' +
      '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,' +
      '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
      '"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over",' +
      '"skewX":0,"skewY":0}';

    const augmentedJSON =
      '{"type":"FabricObject","version":"' +
      version +
      '","originX":"center","originY":"center","left":0,"top":0,"width":122,"height":0,"fill":"rgb(0,0,0)",' +
      '"stroke":null,"strokeWidth":1,"strokeDashArray":[5,2],"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"bevel","strokeUniform":false,"strokeMiterLimit":5,' +
      '"scaleX":1.3,"scaleY":1,"angle":0,"flipX":false,"flipY":true,"opacity":0.88,' +
      '"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over",' +
      '"skewX":0,"skewY":0}';

    const cObj = new FabricObject();

    expect(cObj.toJSON, 'toJSON should be a function').toBeTypeOf('function');
    expect(
      JSON.stringify(cObj.toJSON()),
      'default object JSON representation',
    ).toBe(emptyObjectJSON);
    expect(
      JSON.stringify(cObj),
      'stringified object should equal JSON representation',
    ).toBe(emptyObjectJSON);

    cObj
      .set('opacity', 0.88)
      .set('scaleX', 1.3)
      .set('width', 122)
      .set('flipY', true)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevel')
      .set('strokeMiterLimit', 5);

    expect(
      JSON.stringify(cObj.toJSON()),
      'augmented object JSON representation',
    ).toBe(augmentedJSON);
  });

  it('toObject', () => {
    const emptyObjectRepr = {
      version: version,
      type: 'FabricObject',
      originX: 'center',
      originY: 'center',
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
      skewX: 0,
      skewY: 0,
      strokeUniform: false,
    };

    const augmentedObjectRepr = {
      version: version,
      type: 'FabricObject',
      originX: 'center',
      originY: 'center',
      left: 10,
      top: 20,
      width: 30,
      height: 40,
      fill: 'rgb(0,0,0)',
      stroke: null,
      strokeWidth: 1,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeDashOffset: 0,
      strokeLineJoin: 'bevel',
      strokeMiterLimit: 5,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: true,
      flipY: false,
      opacity: 0.13,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      strokeUniform: false,
    };

    const cObj = new FabricObject();

    expect(cObj.toObject(), 'should match empty object representation').toEqual(
      emptyObjectRepr,
    );

    cObj
      .set('left', 10)
      .set('top', 20)
      .set('width', 30)
      .set('height', 40)
      .set('flipX', true)
      .set('opacity', 0.13)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevel')
      .set('strokeMiterLimit', 5);

    expect(
      cObj.toObject(),
      'should match augmented object representation',
    ).toEqual(augmentedObjectRepr);

    const fractionalValue = 166.66666666666666;
    const testedProperties = 'left top width height'.split(' ');
    const fractionDigitsDefault = 2;

    function testFractionDigits(
      fractionDigits: number,
      expectedValue: unknown,
    ) {
      config.configure({ NUM_FRACTION_DIGITS: fractionDigits });

      testedProperties.forEach(function (property) {
        cObj.set(property, fractionalValue);
        expect(
          cObj.toObject()[property],
          `value of ${property} should have ${fractionDigits} fractional digits`,
        ).toBe(expectedValue);
      });

      config.configure({ NUM_FRACTION_DIGITS: fractionDigitsDefault });
    }

    testFractionDigits(2, 166.67);
    testFractionDigits(3, 166.667);
    testFractionDigits(0, 167);
  });

  it('toObject without default values', () => {
    const emptyObjectRepr = {
      version: version,
      type: 'FabricObject',
      top: 0,
      left: 0,
    };

    const augmentedObjectRepr = {
      version: version,
      type: 'FabricObject',
      left: 10,
      top: 20,
      width: 30,
      height: 40,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeLineJoin: 'bevel',
      strokeMiterLimit: 5,
      flipX: true,
      opacity: 0.13,
    };

    const cObj = new FabricObject();

    cObj.includeDefaultValues = false;
    expect(cObj.toObject(), 'top and left are always maintained').toEqual(
      emptyObjectRepr,
    );

    cObj
      .set('left', 10)
      .set('top', 20)
      .set('width', 30)
      .set('height', 40)
      .set('flipX', true)
      .set('opacity', 0.13)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevel')
      .set('strokeMiterLimit', 5);

    const toObjectObj = cObj.toObject();
    expect(toObjectObj, 'non-default values should be present').toEqual(
      augmentedObjectRepr,
    );
    expect(
      toObjectObj.strokeDashArray,
      'strokeDashArray should be a new array',
    ).not.toBe(augmentedObjectRepr.strokeDashArray);
    expect(
      toObjectObj.strokeDashArray,
      'strokeDashArray should equal the original array',
    ).toEqual(augmentedObjectRepr.strokeDashArray);
  });

  it('toDatalessObject', () => {
    const cObj = new FabricObject();

    expect(
      cObj.toDatalessObject,
      'toDatalessObject should be a function',
    ).toBeTypeOf('function');
    expect(
      cObj.toDatalessObject(),
      'toDatalessObject should equal toObject',
    ).toEqual(cObj.toObject());
  });

  it('toString', () => {
    class Moo extends FabricObject {
      static type = 'Moo';
    }

    const cObj = new FabricObject();

    expect(cObj.toString(), 'toString should return class name').toBe(
      '#<FabricObject>',
    );
    expect(
      new Moo().toString(),
      'toString should return custom class name',
    ).toBe('#<Moo>');
  });

  it('render', () => {
    const cObj = new FabricObject();

    expect(cObj.render, 'render should be a function').toBeTypeOf('function');
  });

  it('scale', () => {
    const cObj = new FabricObject();

    expect(cObj.scale, 'scale should be a function').toBeTypeOf('function');
    expect(cObj.get('scaleX'), 'default scaleX should be 1').toBe(1);
    expect(cObj.get('scaleY'), 'default scaleY should be 1').toBe(1);

    cObj.scale(1.5);

    expect(cObj.get('scaleX'), 'scaleX should be updated').toBe(1.5);
    expect(cObj.get('scaleY'), 'scaleY should be updated').toBe(1.5);
  });

  it('setOpacity', () => {
    const cObj = new FabricObject();

    expect(cObj.get('opacity'), 'default opacity should be 1').toBe(1);

    cObj.set('opacity', 0.68);

    expect(cObj.get('opacity'), 'opacity should be updated').toBe(0.68);
    expect(cObj.set('opacity', 1), 'set should be chainable').toBe(cObj);
  });

  it('getAngle', () => {
    const cObj = new FabricObject();

    expect(cObj.get('angle'), 'default angle should be 0').toBe(0);

    cObj.rotate(45);

    expect(cObj.get('angle'), 'angle should be 45 after rotation').toBe(45);
  });

  it('rotate what?', () => {
    const cObj = new FabricObject();

    expect(cObj.get('angle'), 'default angle should be 0').toBe(0);
    expect(cObj.set('angle', 45), 'set should be chainable').toBe(cObj);
    expect(cObj.get('angle'), 'angle should be 45 after setting').toBe(45);
  });

  it('clone', async () => {
    const cObj = new FabricObject({ left: 123, top: 456, opacity: 0.66 });

    expect(cObj.clone, 'clone should be a function').toBeTypeOf('function');

    const clone = await cObj.clone();

    expect(clone.get('left'), 'clone should have same left').toBe(123);
    expect(clone.get('top'), 'clone should have same top').toBe(456);
    expect(clone.get('opacity'), 'clone should have same opacity').toBe(0.66);

    // augmenting clone properties should not affect original instance
    clone.set('left', 12).set('scaleX', 2.5).rotate(33);

    expect(cObj.get('left'), 'original left should not change').toBe(123);
    expect(cObj.get('scaleX'), 'original scaleX should not change').toBe(1);
    expect(cObj.get('angle'), 'original angle should not change').toBe(0);
  });

  it('cloneAsImage', () => {
    const cObj = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
      strokeWidth: 0,
    });

    expect(cObj.cloneAsImage, 'cloneAsImage should be a function').toBeTypeOf(
      'function',
    );

    const image = cObj.cloneAsImage({});

    expect(image, 'image should exist').toBeTruthy();
    expect(image, 'image should be a FabricImage').toBeInstanceOf(FabricImage);
    expect(image.width, 'the image has same dimension of object').toBe(100);
  });

  it('cloneAsImage with retina scaling enabled', () => {
    const cObj = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
      strokeWidth: 0,
    });

    config.configure({ devicePixelRatio: 2 });

    const image = cObj.cloneAsImage({ enableRetinaScaling: true });

    expect(image, 'image should exist').toBeTruthy();
    expect(image, 'image should be a FabricImage').toBeInstanceOf(FabricImage);
    expect(image.width, 'the image has been scaled by retina').toBe(200);
  });

  it('toCanvasElement', () => {
    const cObj = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
      strokeWidth: 0,
      canvas: canvas,
    });

    expect(
      cObj.toCanvasElement,
      'toCanvasElement should be a function',
    ).toBeTypeOf('function');

    const canvasEl = cObj.toCanvasElement();

    expect(canvasEl.getContext, 'the element returned is a canvas').toBeTypeOf(
      'function',
    );
    expect(cObj.canvas, 'canvas ref should remain unchanged').toBe(canvas);
  });

  it('toCanvasElement activeSelection', () => {
    const cObj = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
      strokeWidth: 0,
    });

    const cObj2 = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
      strokeWidth: 0,
    });

    canvas.add(cObj, cObj2);

    const activeSel = new ActiveSelection([cObj, cObj2], { canvas: canvas });

    expect(cObj.canvas, 'canvas is the main one step 1').toBe(canvas);

    activeSel.toCanvasElement();

    expect(cObj.canvas, 'canvas is the main one step 2').toBe(canvas);

    activeSel.removeAll();

    expect(cObj.canvas, 'canvas is the main one step 3').toBe(canvas);
  });

  it('toCanvasElement does not modify oCoords on zoomed canvas', () => {
    const cObj = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
      strokeWidth: 0,
    });

    canvas.setZoom(2);
    canvas.add(cObj);

    const originaloCoords = cObj.oCoords;
    const originalaCoords = cObj.aCoords;

    cObj.toCanvasElement();

    expect(cObj.oCoords, 'cObj did not get object coords changed').toEqual(
      originaloCoords,
    );
    expect(cObj.aCoords, 'cObj did not get absolute coords changed').toEqual(
      originalaCoords,
    );
  });

  it('toDataURL', () => {
    const cObj = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
      strokeWidth: 0,
    });

    expect(cObj.toDataURL, 'toDataURL should be a function').toBeTypeOf(
      'function',
    );

    const dataURL = cObj.toDataURL();

    expect(dataURL, 'dataURL should be a string').toBeTypeOf('string');
    expect(dataURL.substring(0, 21), 'dataURL should start with PNG data').toBe(
      'data:image/png;base64',
    );

    try {
      const jpegDataURL = cObj.toDataURL({ format: 'jpeg' });
      expect(
        jpegDataURL.substring(0, 22),
        'JPEG dataURL should start with JPEG data',
      ).toBe('data:image/jpeg;base64');
    } catch {
      // eslint-disable-next-line no-restricted-syntax -- fine in test
      console.log('jpeg toDataURL not supported');
    }
  });

  it('toDataURL & reference to canvas', () => {
    const cObj = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
    });

    canvas.add(cObj);

    const objCanvas = cObj.canvas;

    cObj.toDataURL();

    expect(objCanvas, 'canvas reference should be maintained').toBe(
      cObj.canvas,
    );
  });

  it('isType', () => {
    const cObj = new FabricObject();

    expect(cObj.isType, 'isType should be a function').toBeTypeOf('function');
    expect(
      cObj.isType('FabricObject'),
      'object is a FabricObject',
    ).toBeTruthy();
    expect(cObj.isType('object'), 'object is an object').toBeTruthy();
    expect(cObj.isType('Rect'), 'object is not a Rect').toBeFalsy();

    const rect = new Rect();

    expect(rect.isType('Rect'), 'rect is a Rect').toBeTruthy();
    expect(
      rect.isType('rect'),
      'rect is a rect (case insensitive)',
    ).toBeTruthy();
    expect(rect.isType('Object'), 'rect is not an Object').toBeFalsy();
    expect(
      rect.isType('Object', 'Rect'),
      'rect is a Rect or Object',
    ).toBeTruthy();
    expect(
      rect.isType('Object', 'Circle'),
      'rect is not a Circle or Object',
    ).toBeFalsy();
  });

  it('toggle', () => {
    const object = new FabricObject({
      left: 100,
      top: 124,
      width: 210,
      height: 66,
    });

    expect(object.toggle, 'toggle should be a function').toBeTypeOf('function');

    object.set('flipX', false);

    expect(object.toggle('flipX'), 'toggle should be chainable').toBe(object);
    expect(object.get('flipX'), 'flipX should be toggled to true').toBe(true);

    object.toggle('flipX');

    expect(object.get('flipX'), 'flipX should be toggled back to false').toBe(
      false,
    );

    object.set('left', 112.45);
    object.toggle('left');

    expect(
      object.get('left'),
      'non boolean properties should not be affected',
    ).toBe(112.45);
  });

  it.skip('straighten', () => {
    const object: FabricObject & { straighten?: () => void } = new FabricObject(
      {
        left: 100,
        top: 124,
        width: 210,
        height: 66,
      },
    );

    expect(object.straighten, 'straighten should be a function').toBeTypeOf(
      'function',
    );

    object.rotate(123.456);
    object.straighten!();

    expect(object.get('angle'), 'angle should be straightened to 90').toBe(90);

    object.rotate(97.111);
    object.straighten!();

    expect(object.get('angle'), 'angle should be straightened to 90').toBe(90);

    object.rotate(3.45);
    object.straighten!();

    expect(object.get('angle'), 'angle should be straightened to 0').toBe(0);

    object.rotate(-157);
    object.straighten!();

    expect(object.get('angle'), 'angle should be straightened to -180').toBe(
      -180,
    );

    object.rotate(159);
    object.straighten!();

    expect(object.get('angle'), 'angle should be straightened to 180').toBe(
      180,
    );

    object.rotate(999);
    object.straighten!();

    expect(object.get('angle'), 'angle should be straightened to 270').toBe(
      270,
    );
  });

  it.skip('fxStraighten', async () => {
    const object: FabricObject & {
      fxStraighten?: (cb?: any) => { abort: unknown };
    } = new FabricObject({
      left: 20,
      top: 30,
      width: 40,
      height: 50,
      angle: 43,
    });

    let onCompleteFired = false;
    const onComplete = function () {
      onCompleteFired = true;
    };

    let onChangeFired = false;
    const onChange = function () {
      onChangeFired = true;
    };

    const callbacks = { onComplete: onComplete, onChange: onChange };

    expect(object.fxStraighten, 'fxStraighten should be a function').toBeTypeOf(
      'function',
    );
    expect(
      object.fxStraighten!(callbacks).abort,
      'should return animation context',
    ).toBeTypeOf('function');
    expect(toFixed(object.get('angle'), 0), 'initial angle').toBe('43');

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(onCompleteFired, 'onComplete should fire').toBeTruthy();
    expect(onChangeFired, 'onChange should fire').toBeTruthy();
    expect(
      object.get('angle'),
      'angle should be set to 0 by the end of animation',
    ).toBe(0);
    expect(
      object.fxStraighten!().abort,
      'should work without callbacks',
    ).toBeTypeOf('function');
  });

  it('observable', () => {
    const object = new FabricObject<
      any,
      any,
      { foo: unknown; bar: unknown; baz: unknown } & ObjectEvents
    >({
      left: 20,
      top: 30,
      width: 40,
      height: 50,
      angle: 43,
    });

    let fooFired = false;
    let barFired = false;

    const fooDisposer = object.on('foo', function () {
      fooFired = true;
    });
    const barDisposer = object.on('bar', function () {
      barFired = true;
    });

    expect(fooDisposer, 'should return disposer').toBeTypeOf('function');
    expect(barDisposer, 'should return disposer').toBeTypeOf('function');

    object.fire('foo');

    expect(fooFired, 'foo event should have fired').toBeTruthy();
    expect(barFired, 'bar event should not have fired').toBeFalsy();

    object.fire('bar');

    expect(fooFired, 'foo event should still be fired').toBeTruthy();
    expect(barFired, 'bar event should have fired').toBeTruthy();

    let firedOptions;

    object.on('baz', function (options) {
      firedOptions = options;
    });
    object.fire('baz', { param1: 'abrakadabra', param2: 3.1415 });

    expect(
      firedOptions!.param1,
      'param1 should be passed to event handler',
    ).toBe('abrakadabra');
    expect(
      firedOptions!.param2,
      'param2 should be passed to event handler',
    ).toBe(3.1415);
  });

  it('object:added', () => {
    const object = new Object();
    let addedEventFired = false;

    object.on('added', function (opt) {
      addedEventFired = true;
      expect(opt.target, 'target should equal to canvas').toBe(canvas);
    });

    canvas.add(object);

    expect(addedEventFired, 'added event should have fired').toBeTruthy();
  });

  it('canvas reference', () => {
    const object = new Object();
    const object2 = new Object();

    canvas.add(object);
    canvas.insertAt(0, object2);

    expect(object.canvas, 'object.canvas should reference canvas').toBe(canvas);
    expect(object2.canvas, 'object2.canvas should reference canvas').toBe(
      canvas,
    );
  });

  it('object:removed', () => {
    const object = new Object();
    let removedEventFired = false;

    canvas.add(object);

    object.on('removed', function (opt) {
      removedEventFired = true;
      expect(opt.target, 'target should equal to canvas').toBe(canvas);
      expect(object.canvas, 'canvas should not be referenced').toBeUndefined();
    });

    canvas.remove(object);

    expect(removedEventFired, 'removed event should have fired').toBeTruthy();
  });

  it('getTotalObjectScaling with zoom', () => {
    const object = new Object({ scaleX: 3, scaleY: 2 });

    canvas.setZoom(3);
    canvas.add(object);

    const objectScale = object.getTotalObjectScaling();

    expect(objectScale, 'objectScale should be a Point').toBeInstanceOf(Point);
    expect(objectScale, 'objectScale should include zoom factor').toEqual(
      new Point(object.scaleX * 3, object.scaleY * 3),
    );
  });

  it('getTotalObjectScaling with retina', () => {
    const object = new Object({ scaleX: 3, scaleY: 2 });

    canvas.enableRetinaScaling = true;
    config.configure({ devicePixelRatio: 4 });
    canvas.add(object);

    const objectScale = object.getTotalObjectScaling();

    expect(objectScale, 'objectScale should be a Point').toBeInstanceOf(Point);
    expect(objectScale, 'objectScale should include devicePixelRatio').toEqual(
      new Point(object.scaleX * 4, object.scaleY * 4),
    );
  });

  it('getObjectScaling', () => {
    const object = new FabricObject({ scaleX: 3, scaleY: 2 });

    const objectScale = object.getObjectScaling();

    expect(objectScale, 'objectScale should be a Point').toBeInstanceOf(Point);
    expect(objectScale, 'objectScale should match object scale').toEqual(
      new Point(object.scaleX, object.scaleY),
    );
  });

  it('getObjectScaling in group', () => {
    const object = new FabricObject({ scaleX: 3, scaleY: 2 });
    const group = new Group();

    group.scaleX = 2;
    group.scaleY = 2;
    object.group = group;

    const objectScale = object.getObjectScaling();

    expect(objectScale, 'objectScale should be a Point').toBeInstanceOf(Point);
    expect(objectScale, 'objectScale should include group scale').toEqual(
      new Point(object.scaleX * group.scaleX, object.scaleY * group.scaleY),
    );
  });

  it('getObjectScaling in group with object rotated', () => {
    const object = new FabricObject({ scaleX: 3, scaleY: 2, angle: 45 });
    const group = new Group();

    group.scaleX = 2;
    group.scaleY = 3;
    object.group = group;

    const objectScale = object.getObjectScaling();

    expect(
      new Point(
        Math.round(objectScale.x * 1000) / 1000,
        Math.round(objectScale.y * 1000) / 1000,
      ),
      'objectScale should include rotation effects',
    ).toEqual(new Point(7.649, 4.707));
  });

  it('dirty flag on set property', () => {
    const object = new FabricObject({ scaleX: 3, scaleY: 2 });
    const originalCacheProps = FabricObject.cacheProperties;

    FabricObject.cacheProperties = ['propA', 'propB'];
    object.dirty = false;

    expect(object.dirty, 'object starts with dirty flag disabled').toBe(false);

    object.set('propC', '3');

    expect(
      object.dirty,
      'after setting a property out of cache, dirty flag is still false',
    ).toBe(false);

    object.set('propA', '2');

    expect(
      object.dirty,
      'after setting a property from cache, dirty flag is true',
    ).toBe(true);

    FabricObject.cacheProperties = originalCacheProps;
  });

  it('_createCacheCanvas sets object as dirty', () => {
    const object = new FabricObject({
      scaleX: 3,
      scaleY: 2,
      width: 1,
      height: 2,
    });

    expect(object.dirty, 'object is dirty after creation').toBe(true);

    object.dirty = false;

    expect(object.dirty, 'object is not dirty after specifying it').toBe(false);

    object._createCacheCanvas();

    expect(object.dirty, 'object is dirty again if cache gets created').toBe(
      true,
    );
  });

  it('isCacheDirty', () => {
    const object = new FabricObject({
      scaleX: 3,
      scaleY: 2,
      width: 1,
      height: 2,
    });

    expect(object.dirty, 'object is dirty after creation').toBe(true);

    const originalCacheProps = FabricObject.cacheProperties;

    FabricObject.cacheProperties = ['propA', 'propB'];
    object.dirty = false;

    expect(
      object.isCacheDirty(),
      'object is not dirty if dirty flag is false',
    ).toBe(false);

    object.dirty = true;

    expect(object.isCacheDirty(), 'object is dirty if dirty flag is true').toBe(
      true,
    );

    FabricObject.cacheProperties = originalCacheProps;
  });

  it('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas', () => {
    const object = new FabricObject({ width: 10, height: 10, strokeWidth: 0 });

    const dims = object._getCacheCanvasDimensions();

    expect(dims, 'if no scaling is applied cache is as big as object').toEqual({
      width: 12,
      height: 12,
      zoomX: 1,
      zoomY: 1,
      x: 10,
      y: 10,
    });

    object.strokeWidth = 2;

    const dimsWithStroke = object._getCacheCanvasDimensions();

    expect(dimsWithStroke, 'cache contains the stroke').toEqual({
      width: 14,
      height: 14,
      zoomX: 1,
      zoomY: 1,
      x: 12,
      y: 12,
    });

    object.scaleX = 2;
    object.scaleY = 3;

    const dimsWithScale = object._getCacheCanvasDimensions();

    expect(dimsWithScale, 'cache is as big as the scaled object').toEqual({
      width: 26,
      height: 38,
      zoomX: 2,
      zoomY: 3,
      x: 24,
      y: 36,
    });
  });

  it('_getCacheCanvasDimensions and strokeUniform', () => {
    const object = new FabricObject({ width: 10, height: 10, strokeWidth: 2 });

    const dims = object._getCacheCanvasDimensions();

    expect(
      dims,
      'if no scaling is applied cache is as big as object + strokeWidth',
    ).toEqual({
      width: 14,
      height: 14,
      zoomX: 1,
      zoomY: 1,
      x: 12,
      y: 12,
    });

    object.strokeUniform = true;

    const dimsWithUniform = object._getCacheCanvasDimensions();

    expect(
      dimsWithUniform,
      'if no scaling is applied strokeUniform makes no difference',
    ).toEqual({
      width: 14,
      height: 14,
      zoomX: 1,
      zoomY: 1,
      x: 12,
      y: 12,
    });

    object.scaleX = 2;
    object.scaleY = 3;

    const dimsWithScale = object._getCacheCanvasDimensions();

    expect(dimsWithScale, 'cache is as big as the scaled object').toEqual({
      width: 24,
      height: 34,
      zoomX: 2,
      zoomY: 3,
      x: 22,
      y: 32,
    });
  });

  it('_updateCacheCanvas check if cache canvas should be updated', () => {
    config.configure({
      perfLimitSizeTotal: 10000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 1,
    });

    const object = new FabricObject({ width: 10, height: 10, strokeWidth: 0 });

    object._createCacheCanvas();

    expect(
      object._updateCacheCanvas(),
      'second execution of cache canvas return false',
    ).toBe(false);

    object.scaleX = 2;

    expect(
      object._updateCacheCanvas(),
      'if scale change, it returns true',
    ).toBe(true);
    expect(object.zoomX, 'current scale level is saved').toBe(2);

    object.width = 2;

    expect(
      object._updateCacheCanvas(),
      'if dimension change, it returns true',
    ).toBe(true);

    object.strokeWidth = 2;

    expect(
      object._updateCacheCanvas(),
      'if strokeWidth change, it returns true',
    ).toBe(true);
  });

  it('_limitCacheSize limit min to 256', () => {
    config.configure({
      perfLimitSizeTotal: 50000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256,
    });

    const object = new FabricObject({
      width: 200,
      height: 200,
      strokeWidth: 0,
    });
    const dims = object._getCacheCanvasDimensions();
    const zoomX = dims.zoomX;
    const zoomY = dims.zoomY;

    const limitedDims = object._limitCacheSize(dims);

    expect(dims, 'object is mutated').toBe(limitedDims);
    expect(dims.width, 'width gets minimum to the cacheSideLimit').toBe(256);
    expect(dims.height, 'height gets minimum to the cacheSideLimit').toBe(256);
    expect(zoomX, 'zoom factor X does not need a change').toBe(dims.zoomX);
    expect(zoomY, 'zoom factor Y does not need a change').toBe(dims.zoomY);
  });

  it('_limitCacheSize does not limit if not necessary', () => {
    config.configure({
      perfLimitSizeTotal: 1000000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256,
    });

    const object = new FabricObject({
      width: 400,
      height: 400,
      strokeWidth: 0,
    });
    const dims = object._getCacheCanvasDimensions();
    const zoomX = dims.zoomX;
    const zoomY = dims.zoomY;

    const limitedDims = object._limitCacheSize(dims);

    expect(dims, 'object is mutated').toBe(limitedDims);
    expect(dims.width, 'width is in the middle of limits').toBe(402);
    expect(dims.height, 'height is in the middle of limits').toBe(402);
    expect(zoomX, 'zoom factor X does not need a change').toBe(dims.zoomX);
    expect(zoomY, 'zoom factor Y does not need a change').toBe(dims.zoomY);
  });

  it('_limitCacheSize does cap up minCacheSideLimit', () => {
    config.configure({
      perfLimitSizeTotal: 10000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256,
    });

    const object = new FabricObject({
      width: 400,
      height: 400,
      strokeWidth: 0,
    });
    const dims = object._getCacheCanvasDimensions();
    const width = dims.width;
    const height = dims.height;
    const zoomX = dims.zoomX;
    const zoomY = dims.zoomY;

    const limitedDims = object._limitCacheSize(dims);

    expect(dims, 'object is mutated').toBe(limitedDims);
    expect(dims.width, 'width is capped to min').toBe(256);
    expect(dims.height, 'height is capped to min').toBe(256);
    expect(
      (zoomX * dims.width) / width,
      'zoom factor X gets updated to represent the shrink',
    ).toBe(dims.zoomX);
    expect(
      (zoomY * dims.height) / height,
      'zoom factor Y gets updated to represent the shrink',
    ).toBe(dims.zoomY);
  });

  it('_limitCacheSize does cap up if necessary', () => {
    config.configure({
      perfLimitSizeTotal: 1000000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256,
    });

    const object = new FabricObject({
      width: 2046,
      height: 2046,
      strokeWidth: 0,
    });
    const dims = object._getCacheCanvasDimensions();
    const width = dims.width;
    const height = dims.height;
    const zoomX = dims.zoomX;
    const zoomY = dims.zoomY;

    const limitedDims = object._limitCacheSize(dims);

    expect(dims, 'object is mutated').toBe(limitedDims);
    expect(dims.width, 'width is capped to max allowed by area').toBe(1000);
    expect(dims.height, 'height is capped to max allowed by area').toBe(1000);
    expect(
      (zoomX * dims.width) / width,
      'zoom factor X gets updated to represent the shrink',
    ).toBe(dims.zoomX);
    expect(
      (zoomY * dims.height) / height,
      'zoom factor Y gets updated to represent the shrink',
    ).toBe(dims.zoomY);
  });

  it('_limitCacheSize does cap up if necessary to maxCacheSideLimit', () => {
    config.configure({
      perfLimitSizeTotal: 100000000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256,
    });

    const object = new FabricObject({
      width: 8192,
      height: 8192,
      strokeWidth: 0,
    });
    const dims = object._getCacheCanvasDimensions();
    const zoomX = dims.zoomX;
    const zoomY = dims.zoomY;

    const limitedDims = object._limitCacheSize(dims);

    expect(dims, 'object is mutated').toBe(limitedDims);
    expect(dims.width, 'width is capped to max allowed by fabric').toBe(
      config.maxCacheSideLimit,
    );
    expect(dims.height, 'height is capped to max allowed by fabric').toBe(
      config.maxCacheSideLimit,
    );
    expect(
      dims.zoomX,
      'zoom factor X gets updated to represent the shrink',
    ).toBe((zoomX * 4096) / 8194);
    expect(
      dims.zoomY,
      'zoom factor Y gets updated to represent the shrink',
    ).toBe((zoomY * 4096) / 8194);
  });

  it('_limitCacheSize does cap up if necessary to maxCacheSideLimit, different AR', () => {
    config.configure({
      perfLimitSizeTotal: 100000000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256,
    });

    const object = new FabricObject({
      width: 16384,
      height: 8192,
      strokeWidth: 0,
    });
    const dims = object._getCacheCanvasDimensions();
    const width = dims.width;
    const height = dims.height;
    const zoomX = dims.zoomX;
    const zoomY = dims.zoomY;

    const limitedDims = object._limitCacheSize(dims);

    expect(dims, 'object is mutated').toBe(limitedDims);
    expect(dims.width, 'width is capped to max allowed by fabric').toBe(
      config.maxCacheSideLimit,
    );
    expect(dims.height, 'height is capped to max allowed by fabric').toBe(
      config.maxCacheSideLimit,
    );
    expect(
      dims.zoomX,
      'zoom factor X gets updated to represent the shrink',
    ).toBe((zoomX * config.maxCacheSideLimit) / width);
    expect(
      dims.zoomY,
      'zoom factor Y gets updated to represent the shrink',
    ).toBe((zoomY * config.maxCacheSideLimit) / height);
  });

  it('_setShadow', () => {
    const canvas = new StaticCanvas(undefined, {
      enableRetinaScaling: false,
      width: 600,
      height: 600,
    });
    const context = canvas.contextContainer;
    const object = new FabricObject({ scaleX: 1, scaleY: 1 });
    const group = new Group();

    group.scaleX = 2;
    group.scaleY = 2;

    object.shadow = new Shadow({
      color: 'red',
      blur: 10,
      offsetX: 5,
      offsetY: 15,
    });

    object._setShadow(context);

    expect(context.shadowOffsetX, 'shadow offsetX is set').toBe(
      object.shadow.offsetX,
    );
    expect(context.shadowOffsetY, 'shadow offsetY is set').toBe(
      object.shadow.offsetY,
    );
    expect(context.shadowBlur, 'shadow blur is set').toBe(object.shadow.blur);

    config.configure({ browserShadowBlurConstant: 1.5 });

    object._setShadow(context);

    expect(
      context.shadowOffsetX,
      'shadow offsetX is unchanged with browserConstant',
    ).toBe(object.shadow.offsetX);
    expect(
      context.shadowOffsetY,
      'shadow offsetY is unchanged with browserConstant',
    ).toBe(object.shadow.offsetY);
    expect(
      context.shadowBlur,
      'shadow blur is affected with browserConstant',
    ).toBe(object.shadow.blur * 1.5);

    config.configure({ browserShadowBlurConstant: 1 });

    object.scaleX = 2;
    object.scaleY = 3;

    object._setShadow(context);

    expect(context.shadowOffsetX, 'shadow offsetX is affected by scaleX').toBe(
      object.shadow.offsetX * object.scaleX,
    );
    expect(context.shadowOffsetY, 'shadow offsetY is affected by scaleY').toBe(
      object.shadow.offsetY * object.scaleY,
    );
    expect(
      context.shadowBlur,
      'shadow blur is affected by scaleY and scaleX',
    ).toBe((object.shadow.blur * (object.scaleX + object.scaleY)) / 2);

    object.group = group;

    object._setShadow(context);

    expect(
      context.shadowOffsetX,
      'shadow offsetX is affected by scaleX and group.scaleX',
    ).toBe(object.shadow.offsetX * object.scaleX * group.scaleX);
    expect(
      context.shadowOffsetY,
      'shadow offsetX is affected by scaleX and group.scaleX',
    ).toBe(object.shadow.offsetY * object.scaleY * group.scaleY);
    expect(context.shadowBlur, 'shadow blur is affected by scales').toBe(
      (object.shadow.blur *
        (object.scaleX * group.scaleX + object.scaleY * group.scaleY)) /
        2,
    );
  });

  it('willDrawShadow', () => {
    // @ts-expect-error -- Mock shadow
    const object = new FabricObject({ shadow: { offsetX: 0, offsetY: 0 } });

    expect(object.willDrawShadow(), 'object will not drawShadow').toBe(false);

    object.shadow!.offsetX = 1;

    expect(object.willDrawShadow(), 'object will drawShadow').toBe(true);
  });

  it('_set change a property', () => {
    const object = new FabricObject({ fill: 'blue' });

    object._set('fill', 'red');

    expect(object.fill, 'property changed').toBe('red');
  });

  it('_set can rise the dirty flag', () => {
    const object = new FabricObject({ fill: 'blue' });

    object.dirty = false;
    object._set('fill', 'red');

    expect(object.dirty, 'dirty is raised').toBe(true);
  });

  it('_set rise dirty flag only if value changed', () => {
    const object = new FabricObject({ fill: 'blue' });

    object.dirty = false;
    object._set('fill', 'blue');

    expect(object.dirty, 'dirty is not raised').toBe(false);
  });

  it('isNotVisible', () => {
    const object = new FabricObject({ fill: 'blue', width: 100, height: 100 });

    expect(object.isNotVisible(), 'object is default visible').toBe(false);

    const objectWithStroke = new FabricObject({
      fill: 'blue',
      width: 0,
      height: 0,
      strokeWidth: 1,
    });

    expect(
      objectWithStroke.isNotVisible(),
      'object is visible with width and height equal 0, but strokeWidth 1',
    ).toBe(false);

    const transparentObject = new FabricObject({ opacity: 0, fill: 'blue' });

    expect(
      transparentObject.isNotVisible(),
      'object is not visible with opacity 0',
    ).toBe(true);

    const invisibleObject = new FabricObject({ fill: 'blue', visible: false });

    expect(
      invisibleObject.isNotVisible(),
      'object is not visible with visible false',
    ).toBe(true);

    const zeroSizeObject = new FabricObject({
      fill: 'blue',
      width: 0,
      height: 0,
      strokeWidth: 0,
    });

    expect(
      zeroSizeObject.isNotVisible(),
      'object is not visible with also strokeWidth equal 0',
    ).toBe(true);
  });

  it('shouldCache', () => {
    const object = new FabricObject();

    object.objectCaching = false;

    expect(
      object.shouldCache(),
      'if objectCaching is false, object should not cache',
    ).toBe(false);

    object.objectCaching = true;

    expect(
      object.shouldCache(),
      'if objectCaching is true, object should cache',
    ).toBe(true);

    object.objectCaching = false;
    object.needsItsOwnCache = function () {
      return true;
    };

    expect(
      object.shouldCache(),
      'if objectCaching is false, but we have a clipPath, shouldCache returns true',
    ).toBe(true);

    object.needsItsOwnCache = function () {
      return false;
    };

    object.objectCaching = true;
    // @ts-expect-error -- Mock group
    object.parent = {
      isOnACache: function () {
        return true;
      },
    };

    expect(
      object.shouldCache(),
      'if objectCaching is true, but we are in a group, shouldCache returns false',
    ).toBe(false);

    object.objectCaching = true;
    // @ts-expect-error -- Mock group
    object.parent = {
      isOnACache: function () {
        return false;
      },
    };

    expect(
      object.shouldCache(),
      'if objectCaching is true, but we are in a not cached group, shouldCache returns true',
    ).toBe(true);

    object.objectCaching = false;
    // @ts-expect-error -- Mock group
    object.parent = {
      isOnACache: function () {
        return false;
      },
    };

    expect(
      object.shouldCache(),
      'if objectCaching is false, but we are in a not cached group, shouldCache returns false',
    ).toBe(false);

    object.objectCaching = false;
    // @ts-expect-error -- Mock group
    object.parent = {
      isOnACache: function () {
        return true;
      },
    };

    expect(
      object.shouldCache(),
      'if objectCaching is false, but we are in a cached group, shouldCache returns false',
    ).toBe(false);

    object.needsItsOwnCache = function () {
      return true;
    };

    object.objectCaching = false;
    // @ts-expect-error -- Mock group
    object.parent = {
      isOnACache: function () {
        return true;
      },
    };

    expect(
      object.shouldCache(),
      'if objectCaching is false, but we have a clipPath, group cached, we cache anyway',
    ).toBe(true);

    object.objectCaching = false;
    // @ts-expect-error -- Mock group
    object.parent = {
      isOnACache: function () {
        return false;
      },
    };

    expect(
      object.shouldCache(),
      'if objectCaching is false, but we have a clipPath, group not cached, we cache anyway',
    ).toBe(true);
  });

  it('hasStroke', () => {
    const object = new FabricObject({
      fill: 'blue',
      width: 100,
      height: 100,
      strokeWidth: 3,
      stroke: 'black',
    });

    expect(
      object.hasStroke(),
      'if strokeWidth is present and stroke is black hasStroke is true',
    ).toBe(true);

    object.stroke = '';

    expect(
      object.hasStroke(),
      'if strokeWidth is present and stroke is empty string hasStroke is false',
    ).toBe(false);

    object.stroke = 'transparent';

    expect(
      object.hasStroke(),
      'if strokeWidth is present and stroke is transparent hasStroke is false',
    ).toBe(false);

    object.stroke = 'black';
    object.strokeWidth = 0;

    expect(
      object.hasStroke(),
      'if strokeWidth is 0 and stroke is a color hasStroke is false',
    ).toBe(false);
  });

  it('hasFill', () => {
    const object = new FabricObject({ fill: 'blue', width: 100, height: 100 });

    expect(
      object.hasFill(),
      'with a color that is not transparent, hasFill is true',
    ).toBe(true);

    object.fill = '';

    expect(object.hasFill(), 'without a color, hasFill is false').toBe(false);

    object.fill = 'transparent';

    expect(
      object.hasFill(),
      'with a color that is transparent, hasFill is false',
    ).toBe(false);
  });

  it('dispose', () => {
    const object = new FabricObject({ fill: 'blue', width: 100, height: 100 });
    let off = false;

    object.off = () => {
      off = true;
    };

    object.canvas = canvas;

    expect(object.dispose, 'dispose should be a function').toBeTypeOf(
      'function',
    );

    object.animate({ fill: 'red' });

    const findAnimationsByTarget = (target: FabricObject) =>
      runningAnimations.filter(({ target: t }) => target === t);

    expect(
      findAnimationsByTarget(object).length,
      'runningAnimations should include the animation',
    ).toBe(1);

    object.dispose();

    expect(
      findAnimationsByTarget(object).length,
      'runningAnimations should be empty after dispose',
    ).toBe(0);
    expect(object.canvas, 'canvas should be cleared').toBeFalsy();
    expect(off, 'events should be unsubscribed').toBeTruthy();
  });

  // it('prototype changes', () => {
  //   const object = new FabricObject();
  //   const object2 = new FabricObject();
  //   object2.fill = 'red';
  //
  //   expect(object.fill, 'by default objects have a rgb(0,0,0) fill').toBe('rgb(0,0,0)');
  //   expect(object2.fill, 'once assigned object is red').toBe('red');
  //
  //   Object.prototype.fill = 'green';
  //
  //   expect(object.fill, 'object with no value assigned read from prototype').toBe('green');
  //   expect(object2.fill, 'once assigned object is red, it stays red').toBe('red');
  //
  //   const object3 = new FabricObject();
  //
  //   expect(object3.fill, 'newly created object have now green by default').toBe('green');
  //
  //   Object.prototype.fill = 'rgb(0,0,0)';
  // });
});
