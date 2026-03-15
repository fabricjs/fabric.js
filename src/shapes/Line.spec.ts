import { describe, expect, it } from 'vitest';
import { Line } from './Line';
import { FabricObject } from './Object/Object';
import { createReferenceObject, createSVGElement } from '../../test/utils';

describe('Line', () => {
  const LINE_OBJECT = createReferenceObject('Line', {
    left: 12,
    top: 13,
    width: 2,
    height: 2,
    x1: -1,
    y1: -1,
    x2: 1,
    y2: 1,
  });

  it('initializes constructor correctly', () => {
    expect(Line).toBeTruthy();
    const line = new Line([10, 11, 20, 21]);

    expect(line).toBeInstanceOf(Line);
    expect(line).toBeInstanceOf(FabricObject);

    expect(line.constructor).toHaveProperty('type', 'Line');

    expect(line.get('x1')).toBe(10);
    expect(line.get('y1')).toBe(11);
    expect(line.get('x2')).toBe(20);
    expect(line.get('y2')).toBe(21);

    const lineWithoutPoints = new Line();

    expect(lineWithoutPoints.get('x1')).toBe(0);
    expect(lineWithoutPoints.get('y1')).toBe(0);
    expect(lineWithoutPoints.get('x2')).toBe(0);
    expect(lineWithoutPoints.get('y2')).toBe(0);
  });

  it('has complexity function', () => {
    const line = new Line();
    expect(line.complexity).toBeTypeOf('function');
  });

  it('generates SVG correctly', () => {
    const line = new Line([11, 12, 13, 14]);
    const EXPECTED_SVG =
      '<g transform="matrix(1 0 0 1 12 13)"  >\n<line style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x1="-1" y1="-1" x2="1" y2="1" />\n</g>\n';
    expect(line.toSVG()).toEqual(EXPECTED_SVG);
  });

  it('converts to object correctly', () => {
    const line = new Line([11, 12, 13, 14]);
    expect(line.toObject).toBeTypeOf('function');
    expect(line.toObject()).toEqual(LINE_OBJECT);
  });

  it('creates from object correctly', async () => {
    expect(Line.fromObject).toBeTypeOf('function');
    const line = await Line.fromObject(LINE_OBJECT);
    expect(line).toBeInstanceOf(Line);
    expect(line.toObject()).toEqual(LINE_OBJECT);
  });

  it('creates from SVG element correctly', async () => {
    expect(Line.fromElement).toBeTypeOf('function');

    // TODO: should fromElement also accept SVGElement since test is doing it?
    const lineEl = createSVGElement('line', {
      x1: 11,
      x2: 34,
      y1: 23,
      y2: 7,
      stroke: 'ff5555',
      'stroke-width': 2,
      'stroke-dasharray': '5, 2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'bevel',
      'stroke-miterlimit': 5,
    });

    const oLine = await Line.fromElement(lineEl as unknown as HTMLElement);
    expect(oLine).toBeInstanceOf(Line);

    expect(oLine.get('x1')).toBe(11);
    expect(oLine.get('y1')).toBe(23);
    expect(oLine.get('x2')).toBe(34);
    expect(oLine.get('y2')).toBe(7);
    expect(oLine.get('stroke')).toBe('ff5555');
    expect(oLine.get('strokeWidth')).toBe(2);
    expect(oLine.get('strokeDashArray')).toEqual([5, 2]);
    expect(oLine.get('strokeLineCap')).toBe('round');
    expect(oLine.get('strokeLineJoin')).toBe('bevel');
    expect(oLine.get('strokeMiterLimit')).toBe(5);

    const lineElWithMissingAttributes = createSVGElement('line', {
      x1: 10,
      y1: 20,
    });

    const oLine2 = await Line.fromElement(
      lineElWithMissingAttributes as unknown as HTMLElement,
    );
    expect(oLine2.get('x2')).toBe(0);
    expect(oLine2.get('y2')).toBe(0);
  });

  it('allows straight lines to have 0 width or height', () => {
    const line1 = new Line([10, 10, 100, 10]);
    const line2 = new Line([10, 10, 10, 100]);

    expect(line1.get('height')).toBe(0);
    expect(line2.get('width')).toBe(0);
  });

  it('updates width/height when changing x/y coordinates', () => {
    const line = new Line([50, 50, 100, 100]);

    expect(line.width).toBe(50);

    line.set({ x1: 75, y1: 75, x2: 175, y2: 175 });

    expect(line.width).toBe(100);
    expect(line.height).toBe(100);
  });

  it('parses stroke width from style attribute', async () => {
    const lineEl = createSVGElement('line');
    lineEl.setAttribute('style', 'stroke-width:4');

    const oLine = await Line.fromElement(lineEl as unknown as HTMLElement);
    expect(oLine.strokeWidth).toBe(4);
  });

  describe('line positioning', () => {
    (['left', 'center', 'right'] as const).forEach((originX) => {
      (['top', 'center', 'bottom'] as const).forEach((originY) => {
        [0, 7].forEach((strokeWidth) => {
          [0, 33, 90].forEach((angle) => {
            (['butt', 'round', 'square'] as const).forEach((strokeLineCap) => {
              it(`positions on center regardless of strokeWidth or origin (${originX}/${originY} stroke:${strokeWidth} angle:${angle} cap:${strokeLineCap})`, () => {
                const line = new Line([1, 1, 15, 7], {
                  strokeWidth,
                  originX,
                  originY,
                  angle,
                  strokeLineCap,
                });
                const center = line.getCenterPoint();
                expect(Math.round(center.x)).toBe(8);
                expect(Math.round(center.y)).toBe(4);
              });
            });
          });
        });
      });
    });
  });
});
