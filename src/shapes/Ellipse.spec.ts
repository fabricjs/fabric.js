import { describe, it, expect } from 'vitest';
import { Ellipse } from './Ellipse';
import { FabricObject } from './Object/Object';
import { version } from '../../fabric';
import { sanitizeSVG } from '../../vitest.extend';
import { createReferenceObject, createSVGElement } from '../../test/utils';

const REFERENCE_ELLIPSE = createReferenceObject('Ellipse', {
  rx: 0,
  ry: 0,
});

describe('Ellipse', () => {
  it('initializes constructor correctly', () => {
    expect(Ellipse).toBeTruthy();

    const ellipse = new Ellipse();

    expect(ellipse).toBeInstanceOf(Ellipse);
    expect(ellipse).toBeInstanceOf(FabricObject);

    expect(ellipse.constructor).toHaveProperty('type', 'Ellipse');
  });

  it('calculates complexity correctly', () => {
    const ellipse = new Ellipse();
    expect(ellipse.complexity).toBeTypeOf('function');
    expect(ellipse.complexity()).toBe(1);
  });

  it('converts to object with correct properties', () => {
    const ellipse = new Ellipse();
    expect(ellipse.toObject).toBeTypeOf('function');
    expect(ellipse.toObject()).toEqual(REFERENCE_ELLIPSE);

    ellipse.set('left', 100);
    ellipse.set('top', 200);
    ellipse.set('rx', 15);
    ellipse.set('ry', 25);

    expect(ellipse.toObject()).toEqual({
      ...REFERENCE_ELLIPSE,
      left: 100,
      top: 200,
      rx: 15,
      ry: 25,
      width: 30,
      height: 50,
    });

    ellipse.set('rx', 30);
    expect(ellipse.width).toBe(ellipse.rx * 2);

    ellipse.set('scaleX', 2);
    expect(ellipse.getRx()).toBe(ellipse.rx * ellipse.scaleX);
  });

  it('generates object without defaults', () => {
    const circle = new Ellipse({
      includeDefaultValues: false,
    });

    expect(circle.toObject()).toEqual({
      type: 'Ellipse',
      version: version,
      left: 0,
      top: 0,
    });
  });

  it('determines visibility correctly', () => {
    const ellipse = new Ellipse();
    ellipse.set('rx', 0);
    ellipse.set('ry', 0);

    expect(ellipse.isNotVisible()).toBe(false);

    ellipse.set('strokeWidth', 0);
    expect(ellipse.isNotVisible()).toBe(true);
  });

  it('generates SVG correctly', () => {
    const ellipse = new Ellipse({
      left: 100.5,
      top: 12.5,
      rx: 100,
      ry: 12,
      fill: 'red',
      stroke: 'blue',
    });

    expect(sanitizeSVG(ellipse.toSVG())).toMatchInlineSnapshot(
      `
      "<g transform="matrix(1 0 0 1 100.5 12.5)"  >
      <ellipse style="stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" rx="100" ry="12" />
      </g>
      "
    `,
    );

    expect(sanitizeSVG(ellipse.toClipPathSVG())).toMatchInlineSnapshot(
      `
      "	<ellipse transform="matrix(1 0 0 1 100.5 12.5)" cx="0" cy="0" rx="100" ry="12" />
      "
    `,
    );
  });

  it('generates SVG with clipPath correctly', () => {
    const ellipse = new Ellipse({
      left: 100.5,
      top: 12.5,
      rx: 100,
      ry: 12,
      fill: 'red',
      stroke: 'blue',
    });
    ellipse.clipPath = new Ellipse({ rx: 12, ry: 100, left: 72.5, top: 50.5 });

    expect(sanitizeSVG(ellipse.toSVG())).toMatchInlineSnapshot(
      `
      "<g transform="matrix(1 0 0 1 100.5 12.5)" clip-path="url(#SVGID)"  >
      <clipPath id="SVGID" >
      	<ellipse transform="matrix(1 0 0 1 72.5 50.5)" cx="0" cy="0" rx="12" ry="100" />
      </clipPath>
      <ellipse style="stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" rx="100" ry="12" />
      </g>
      "
    `,
    );
  });

  it('generates SVG with absolute positioned clipPath correctly', () => {
    const ellipse = new Ellipse({
      left: 100.5,
      top: 12.5,
      rx: 100,
      ry: 12,
      fill: 'red',
      stroke: 'blue',
    });
    ellipse.clipPath = new Ellipse({ rx: 12, ry: 100, left: 72.5, top: 50.5 });
    ellipse.clipPath.absolutePositioned = true;

    expect(sanitizeSVG(ellipse.toSVG())).toMatchInlineSnapshot(
      `
      "<g clip-path="url(#SVGID)"  >
      <g transform="matrix(1 0 0 1 100.5 12.5)"  >
      <clipPath id="SVGID" >
      	<ellipse transform="matrix(1 0 0 1 72.5 50.5)" cx="0" cy="0" rx="12" ry="100" />
      </clipPath>
      <ellipse style="stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" rx="100" ry="12" />
      </g>
      </g>
      "
    `,
    );
  });

  it('creates from SVG element correctly', async () => {
    expect(Ellipse.fromElement).toBeTypeOf('function');

    const elEllipse = createSVGElement('ellipse', {
      rx: 5,
      ry: 7,
      cx: 12,
      cy: 15,
      fill: 'ff5555',
      opacity: 0.5,
      'stroke-width': 2,
      'stroke-dasharray': '5, 2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'bevel',
      'stroke-miterlimit': 5,
    });

    const oEllipse = await Ellipse.fromElement(
      elEllipse as unknown as HTMLElement,
      {},
    );

    expect(oEllipse).toBeInstanceOf(Ellipse);
    expect(oEllipse.get('rx')).toBe(5);
    expect(oEllipse.get('ry')).toBe(7);
    expect(oEllipse.get('left')).toBe(7);
    expect(oEllipse.get('top')).toBe(8);
    expect(oEllipse.get('fill')).toBe('ff5555');
    expect(oEllipse.get('opacity')).toBe(0.5);
    expect(oEllipse.get('strokeWidth')).toBe(2);
    expect(oEllipse.get('strokeDashArray')).toEqual([5, 2]);
    expect(oEllipse.get('strokeLineCap')).toBe('round');
    expect(oEllipse.get('strokeLineJoin')).toBe('bevel');
    expect(oEllipse.get('strokeMiterLimit')).toBe(5);
  });

  it('creates from object correctly', async () => {
    expect(Ellipse).toBeTypeOf('function');

    const left = 112;
    const top = 234;
    const rx = 13.45;
    const ry = 14.78;
    const fill = 'ff5555';

    const ellipse = await Ellipse.fromObject({
      left,
      top,
      rx,
      ry,
      fill,
    });

    expect(ellipse).toBeInstanceOf(Ellipse);
    expect(ellipse.get('left')).toBe(left);
    expect(ellipse.get('top')).toBe(top);
    expect(ellipse.get('rx')).toBe(rx);
    expect(ellipse.get('ry')).toBe(ry);
    expect(ellipse.get('fill')).toBe(fill);

    const expected = ellipse.toObject();
    const actual = await Ellipse.fromObject(expected);

    expect(actual.toObject()).toEqual(expected);
  });
});
