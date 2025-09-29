import { describe, expect, it } from 'vitest';
import { Circle } from './Circle';
import { FabricObject } from './Object/FabricObject';
import { getFabricDocument, version } from '../../fabric';

describe('Circle', () => {
  it('constructor', () => {
    const circle = new Circle();

    expect(circle, 'should inherit from fabric.Circle').toBeInstanceOf(Circle);
    expect(circle, 'should inherit from fabric.Object').toBeInstanceOf(
      FabricObject,
    );
    // @ts-expect-error -- it is a constructor not an ordinary function
    expect(circle.constructor.type).toBe('Circle');
  });

  it('constructor with radius', () => {
    const circle = new Circle({ radius: 20 });
    expect(circle.width, 'width is set').toBe(40);
    expect(circle.height, 'height is set').toBe(40);
  });

  it('getRadiusX, getRadiusY', () => {
    const circle = new Circle({ radius: 10 });

    expect(circle.getRadiusX, 'getRadiusX should exist').toBeTypeOf('function');
    expect(circle.getRadiusY, 'getRadiusY should exist').toBeTypeOf('function');

    expect(circle.getRadiusX()).toBe(10);
    expect(circle.getRadiusY()).toBe(10);

    circle.scale(2);

    expect(circle.getRadiusX()).toBe(20);
    expect(circle.getRadiusY()).toBe(20);

    circle.set('scaleX', 3);

    expect(circle.getRadiusX()).toBe(30);
    expect(circle.getRadiusY()).toBe(20);

    circle.set('scaleY', 4);

    expect(circle.getRadiusX()).toBe(30);
    expect(circle.getRadiusY()).toBe(40);
  });

  it('setRadius', () => {
    const circle = new Circle({ radius: 10, strokeWidth: 0 });

    expect(circle.setRadius).toBeTypeOf('function');

    expect(circle.getRadiusX()).toBe(10);
    expect(circle.getRadiusY()).toBe(10);

    expect(circle.width).toBe(20);
    expect(circle.height).toBe(20);

    circle.setRadius(20);

    expect(circle.getRadiusX()).toBe(20);
    expect(circle.getRadiusY()).toBe(20);

    expect(circle.width).toBe(40);
    expect(circle.height).toBe(40);
  });

  it('set radius', () => {
    const circle = new Circle({ strokeWidth: 0 });

    circle.set('radius', 20);

    expect(circle.getRadiusX()).toBe(20);
    expect(circle.getRadiusY()).toBe(20);

    expect(circle.width).toBe(40);
    expect(circle.height).toBe(40);
  });

  it('complexity', () => {
    const circle = new Circle();
    expect(circle.complexity).toBeTypeOf('function');
    expect(circle.complexity()).toBe(1);
  });

  it('toObject', () => {
    const circle = new Circle();
    const defaultProperties = {
      version: version,
      type: 'Circle',
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
      radius: 0,
      startAngle: 0,
      endAngle: 360,
      counterClockwise: false,
      skewX: 0,
      skewY: 0,
      strokeUniform: false,
    };
    expect(circle.toObject).toBeTypeOf('function');
    expect(circle.toObject()).toStrictEqual(defaultProperties);

    circle.set('left', 100);
    circle.set('top', 200);
    circle.set('radius', 15);

    expect(circle.toObject()).toStrictEqual({
      ...defaultProperties,
      left: 100,
      top: 200,
      width: 30,
      height: 30,
      radius: 15,
    });
  });

  it('toObject without defaults', () => {
    const circle = new Circle({
      includeDefaultValues: false,
    });
    expect(circle.toObject()).toStrictEqual({
      type: 'Circle',
      version: version,
      left: 0,
      top: 0,
    });
  });

  it('toSVG with full circle', () => {
    const circle = new Circle({
      width: 100,
      height: 100,
      radius: 10,
      left: 10.5,
      top: 10.5,
    });
    const svg = circle.toSVG();
    const svgClipPath = circle.toClipPathSVG();
    expect(svg).toBe(
      '<g transform="matrix(1 0 0 1 10.5 10.5)"  >\n<circle style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" r="10" />\n</g>\n',
    );
    expect(svgClipPath, 'circle as clipPath').toBe(
      '\t<circle transform="matrix(1 0 0 1 10.5 10.5)" cx="0" cy="0" r="10" />\n',
    );
  });

  it('toSVG with half circle', () => {
    const circle = new Circle({
      width: 100,
      height: 100,
      radius: 10,
      left: 10.5,
      top: 10.5,
      endAngle: 180,
    });
    const svg = circle.toSVG();
    const svgClipPath = circle.toClipPathSVG();
    expect(svg).toBe(
      '<g transform="matrix(1 0 0 1 10.5 10.5)"  >\n<path d="M 10 0 A 10 10 0 0 1 -10 0" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"   />\n</g>\n',
    );
    expect(svgClipPath, 'half circle as clipPath').toBe(
      '\t<path d="M 10 0 A 10 10 0 0 1 -10 0" transform="matrix(1 0 0 1 10.5 10.5)"  />\n',
    );
  });

  it('toSVG with counterclockwise half circle', () => {
    const circle = new Circle({
      width: 100,
      height: 100,
      radius: 10,
      left: 10.5,
      top: 10.5,
      endAngle: 180,
      counterClockwise: true,
    });
    const svg = circle.toSVG();
    const svgClipPath = circle.toClipPathSVG();
    expect(svg).toBe(
      '<g transform="matrix(1 0 0 1 10.5 10.5)"  >\n<path d="M 10 0 A 10 10 0 0 0 -10 0" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"   />\n</g>\n',
    );
    expect(svgClipPath, 'half circle as clipPath').toBe(
      '\t<path d="M 10 0 A 10 10 0 0 0 -10 0" transform="matrix(1 0 0 1 10.5 10.5)"  />\n',
    );
  });

  it('fromElement', async () => {
    expect(Circle.fromElement).toBeTypeOf('function');

    const namespace = 'http://www.w3.org/2000/svg';
    const elCircle = getFabricDocument().createElementNS(namespace, 'circle'),
      radius = 10,
      left = 12,
      top = 15,
      fill = 'ff5555',
      opacity = 0.5,
      strokeWidth = 2,
      strokeDashArray = [5, 2],
      strokeLineCap = 'round',
      strokeLineJoin = 'bevel',
      strokeMiterLimit = 5;

    elCircle.setAttributeNS(namespace, 'r', String(radius));
    elCircle.setAttributeNS(namespace, 'cx', String(left));
    elCircle.setAttributeNS(namespace, 'cy', String(top));
    elCircle.setAttributeNS(namespace, 'fill', fill);
    elCircle.setAttributeNS(namespace, 'opacity', String(opacity));
    elCircle.setAttributeNS(namespace, 'stroke-width', String(strokeWidth));
    elCircle.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elCircle.setAttributeNS(namespace, 'stroke-linecap', strokeLineCap);
    elCircle.setAttributeNS(namespace, 'stroke-linejoin', strokeLineJoin);
    elCircle.setAttributeNS(
      namespace,
      'stroke-miterlimit',
      String(strokeMiterLimit),
    );

    // @ts-expect-error -- svg circle element is not an HTMLElement
    const oCircle = await Circle.fromElement(elCircle, {});
    expect(oCircle).toBeInstanceOf(Circle);
    expect(oCircle.get('radius')).toBe(radius);
    expect(oCircle.get('left')).toBe(left - radius);
    expect(oCircle.get('top')).toBe(top - radius);
    expect(oCircle.get('fill')).toBe(fill);
    expect(oCircle.get('opacity')).toBe(opacity);
    expect(oCircle.get('strokeWidth')).toBe(strokeWidth);
    expect(oCircle.get('strokeDashArray')).toStrictEqual(strokeDashArray);
    expect(oCircle.get('strokeLineCap')).toBe(strokeLineCap);
    expect(oCircle.get('strokeLineJoin')).toBe(strokeLineJoin);
    expect(oCircle.get('strokeMiterLimit')).toBe(strokeMiterLimit);

    {
      const elFaultyCircle = getFabricDocument().createElementNS(
        namespace,
        'circle',
      );
      elFaultyCircle.setAttributeNS(namespace, 'r', '-10');
      // @ts-expect-error -- svg circle element is not an HTMLElement
      const circle = await Circle.fromElement(elFaultyCircle, {});
      expect(circle.radius, 'radius will default to -10').toBe(-10);
    }

    {
      const elFaultyCircle = getFabricDocument().createElementNS(
        namespace,
        'circle',
      );
      elFaultyCircle.removeAttribute('r');
      // @ts-expect-error -- svg circle element is not an HTMLElement
      const circle = await Circle.fromElement(elFaultyCircle, {});
      expect(circle.radius, 'radius will default to 0').toBe(0);
    }
  });

  it('fromObject', async () => {
    expect(Circle.fromObject).toBeTypeOf('function');

    const left = 112,
      top = 234,
      radius = 13.45,
      fill = 'ff5555';

    const circle = await Circle.fromObject({
      left: left,
      top: top,
      radius: radius,
      fill: fill,
    });
    expect(circle).toBeInstanceOf(Circle);

    expect(circle.get('left')).toBe(left);
    expect(circle.get('top')).toBe(top);
    expect(circle.get('radius')).toBe(radius);
    expect(circle.get('fill')).toBe(fill);

    const expected = circle.toObject();
    const actual = await Circle.fromObject(expected);
    expect(actual.toObject()).toStrictEqual(expected);
  });

  it('cloning and radius, width, height', async () => {
    const circle = new Circle({ radius: 10, strokeWidth: 0 });
    circle.scale(2);

    const clone = await circle.clone();
    expect(clone.width).toBe(20);
    expect(clone.getScaledWidth()).toBe(40);
    expect(clone.height).toBe(20);
    expect(clone.getScaledHeight()).toBe(40);
    expect(clone.radius).toBe(10);
  });
});
