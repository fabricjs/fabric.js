import { describe, it, expect } from 'vitest';
import { Ellipse } from './Ellipse';
import { FabricObject } from './Object/Object';
import { getFabricDocument, version } from '../../fabric';
import { sanitizeSVG } from '../../vitest.extend';

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
    const defaultProperties = {
      version: version,
      type: 'Ellipse',
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
      skewX: 0,
      skewY: 0,
      rx: 0,
      ry: 0,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      strokeUniform: false,
    };
    expect(ellipse.toObject).toBeTypeOf('function');
    expect(ellipse.toObject()).toEqual(defaultProperties);

    ellipse.set('left', 100);
    ellipse.set('top', 200);
    ellipse.set('rx', 15);
    ellipse.set('ry', 25);

    expect(ellipse.toObject()).toEqual({
      ...defaultProperties,
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

    const namespace = 'http://www.w3.org/2000/svg';
    const elEllipse = getFabricDocument().createElementNS(
      namespace,
      'ellipse',
    ) as unknown as HTMLElement;
    const rx = 5;
    const ry = 7;
    const left = 12;
    const top = 15;
    const fill = 'ff5555';
    const opacity = 0.5;
    const strokeWidth = 2;
    const strokeDashArray = [5, 2];
    const strokeLineCap = 'round';
    const strokeLineJoin = 'bevel';
    const strokeMiterLimit = 5;

    elEllipse.setAttributeNS(namespace, 'rx', String(rx));
    elEllipse.setAttributeNS(namespace, 'ry', String(ry));
    elEllipse.setAttributeNS(namespace, 'cx', String(left));
    elEllipse.setAttributeNS(namespace, 'cy', String(top));
    elEllipse.setAttributeNS(namespace, 'fill', fill);
    elEllipse.setAttributeNS(namespace, 'opacity', String(opacity));
    elEllipse.setAttributeNS(namespace, 'stroke-width', String(strokeWidth));
    elEllipse.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elEllipse.setAttributeNS(namespace, 'stroke-linecap', strokeLineCap);
    elEllipse.setAttributeNS(namespace, 'stroke-linejoin', strokeLineJoin);
    elEllipse.setAttributeNS(
      namespace,
      'stroke-miterlimit',
      String(strokeMiterLimit),
    );

    const oEllipse = await Ellipse.fromElement(elEllipse, {});

    expect(oEllipse).toBeInstanceOf(Ellipse);
    expect(oEllipse.get('rx')).toBe(rx);
    expect(oEllipse.get('ry')).toBe(ry);
    expect(oEllipse.get('left')).toBe(left - rx);
    expect(oEllipse.get('top')).toBe(top - ry);
    expect(oEllipse.get('fill')).toBe(fill);
    expect(oEllipse.get('opacity')).toBe(opacity);
    expect(oEllipse.get('strokeWidth')).toBe(strokeWidth);
    expect(oEllipse.get('strokeDashArray')).toEqual(strokeDashArray);
    expect(oEllipse.get('strokeLineCap')).toBe(strokeLineCap);
    expect(oEllipse.get('strokeLineJoin')).toBe(strokeLineJoin);
    expect(oEllipse.get('strokeMiterLimit')).toBe(strokeMiterLimit);
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
