import { Shadow } from './Shadow';
import { FabricObject } from './shapes/Object/FabricObject';
import { describe, expect, it, beforeAll } from 'vitest';
import { config } from './config';

const REFERENCE_SHADOW_OBJECT = {
  color: 'rgb(0,255,0)',
  blur: 10,
  offsetX: 20,
  offsetY: 5,
};

describe('Shadow', () => {
  beforeAll(() => {
    config.NUM_FRACTION_DIGITS = 2;
  });
  it('fromObject', async () => {
    const shadow = await Shadow.fromObject({ color: 'red', offsetX: 10 });
    expect(shadow).toMatchObjectSnapshot();
    expect(shadow).toMatchObjectSnapshot({ includeDefaultValues: false });
  });

  it('constructor', () => {
    const shadow = new Shadow();
    expect(shadow instanceof Shadow, 'should inherit from Shadow').toBe(true);
  });

  it('initializing with object', () => {
    const shadow = new Shadow(REFERENCE_SHADOW_OBJECT);
    expect(shadow.color).toBe('rgb(0,255,0)');
    expect(shadow.offsetX).toBe(20);
    expect(shadow.offsetY).toBe(5);
    expect(shadow.blur).toBe(10);
  });

  it.each([
    // old text-shadow definition - color offsetX offsetY blur
    {
      input: 'rgba(0,0,255,0.5) 10px 20px 5px',
      color: 'rgba(0,0,255,0.5)',
      offsetX: 10,
      offsetY: 20,
      blur: 5,
    },
    {
      input: 'rgb(0,0,255) 10px 20px ',
      color: 'rgb(0,0,255)',
      offsetX: 10,
      offsetY: 20,
      blur: 0,
    },
    {
      input: '#00FF00 30 10 ',
      color: '#00FF00',
      offsetX: 30,
      offsetY: 10,
      blur: 0,
    },
    {
      input: ' #FF0000 10px',
      color: '#FF0000',
      offsetX: 10,
      offsetY: 0,
      blur: 0,
    },
    { input: '#000000', color: '#000000', offsetX: 0, offsetY: 0, blur: 0 },
    // new text-shadow definition - offsetX offsetY blur color
    {
      input: '10px 20px 5px rgba(0,0,255,0.5)',
      color: 'rgba(0,0,255,0.5)',
      offsetX: 10,
      offsetY: 20,
      blur: 5,
    },
    {
      input: '10 20 5px #00FF00',
      color: '#00FF00',
      offsetX: 10,
      offsetY: 20,
      blur: 5,
    },
    {
      input: '10px 20px rgb(0,0,255)',
      color: 'rgb(0,0,255)',
      offsetX: 10,
      offsetY: 20,
      blur: 0,
    },
    {
      input: ' 10px #FF0000 ',
      color: '#FF0000',
      offsetX: 10,
      offsetY: 0,
      blur: 0,
    },
    { input: '  #FF0000 ', color: '#FF0000', offsetX: 0, offsetY: 0, blur: 0 },
    // empty string
    { input: '', color: 'rgb(0,0,0)', offsetX: 0, offsetY: 0, blur: 0 },
    // decimal and negative values
    {
      input: '#FF0000 0.1px 0.1px 0.28px',
      color: '#FF0000',
      offsetX: 0.1,
      offsetY: 0.1,
      blur: 0.28,
    },
    {
      input: 'rgba(0,0,255,0.5) -0.1px -0.1px 0.28px',
      color: 'rgba(0,0,255,0.5)',
      offsetX: -0.1,
      offsetY: -0.1,
      blur: 0.28,
    },
    {
      input: 'rgba(0,0,255,0.5) -0.1 -0.1 0.77',
      color: 'rgba(0,0,255,0.5)',
      offsetX: -0.1,
      offsetY: -0.1,
      blur: 0.77,
    },
    {
      input: 'rgba(0,0,255,0.5) 0.1 0.1 1',
      color: 'rgba(0,0,255,0.5)',
      offsetX: 0.1,
      offsetY: 0.1,
      blur: 1,
    },
  ])(
    'initializing with string "$input"',
    ({ input, color, offsetX, offsetY, blur }) => {
      const shadow = new Shadow(input);
      expect(shadow.color).toBe(color);
      expect(shadow.offsetX).toBe(offsetX);
      expect(shadow.offsetY).toBe(offsetY);
      expect(shadow.blur).toBe(blur);
    },
  );

  it('properties', () => {
    const shadow = new Shadow();

    expect(shadow.blur).toBe(0);
    expect(shadow.color).toBe('rgb(0,0,0)');
    expect(shadow.offsetX).toBe(0);
    expect(shadow.offsetY).toBe(0);
  });

  it('toString', () => {
    const shadow = new Shadow();

    expect(shadow.toString()).toBe('0px 0px 0px rgb(0,0,0)');
  });

  it('toObject', () => {
    const shadow = new Shadow();

    const object = shadow.toObject();
    expect(JSON.stringify(object)).toBe(
      '{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0,"affectStroke":false,"nonScaling":false,"type":"shadow"}',
    );
  });

  it('clone with affectStroke', () => {
    const shadow = new Shadow({ affectStroke: true, blur: 5 });
    expect(shadow.toObject).toBeTypeOf('function');
    const object = shadow.toObject(),
      shadow2 = new Shadow(object),
      object2 = shadow2.toObject();
    expect(shadow.affectStroke).toBe(shadow2.affectStroke);
    expect(object).toEqual(object2);
  });

  it('toObject without default value', () => {
    const shadow = new Shadow();
    shadow.includeDefaultValues = false;

    expect(JSON.stringify(shadow.toObject())).toBe('{"type":"shadow"}');

    shadow.color = 'red';
    expect(JSON.stringify(shadow.toObject())).toBe(
      '{"color":"red","type":"shadow"}',
    );

    shadow.offsetX = 15;
    expect(JSON.stringify(shadow.toObject())).toBe(
      '{"color":"red","offsetX":15,"type":"shadow"}',
    );
  });

  it('fromObject', async () => {
    return Shadow.fromObject({ color: 'red', offsetX: 15 }).then((shadow) => {
      expect(shadow).toBeInstanceOf(Shadow);
    });
  });

  it('toSVG', () => {
    const shadow = new Shadow({
      color: '#FF0000',
      offsetX: 10,
      offsetY: -10,
      blur: 2,
    });
    const object = new FabricObject({ fill: '#FF0000' });

    expect(shadow.toSVG(object)).toEqualSVG(
      '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="10" dy="-10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n',
    );

    shadow.color = 'rgba(255,0,0,0.5)';
    expect(shadow.toSVG(object)).toEqualSVG(
      '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="10" dy="-10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="0.5"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n',
    );

    shadow.color = '#000000';
    expect(shadow.toSVG(object)).toEqualSVG(
      '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="10" dy="-10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(0,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n',
    );
  });

  it('toSVG with flipped object', () => {
    const shadow = new Shadow({
      color: '#FF0000',
      offsetX: 10,
      offsetY: -10,
      blur: 2,
    });
    const object = new FabricObject({
      fill: '#FF0000',
      flipX: true,
      flipY: true,
    });

    expect(shadow.toSVG(object)).toEqualSVG(
      '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="-10" dy="10" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n',
    );
  });

  it('toSVG with rotated object', () => {
    const shadow = new Shadow({
      color: '#FF0000',
      offsetX: 10,
      offsetY: 10,
      blur: 2,
    });
    const object = new FabricObject({ fill: '#FF0000', angle: 45 });

    expect(shadow.toSVG(object)).toEqualSVG(
      '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="14.14" dy="0" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n',
    );
  });

  it('toSVG with rotated flipped object', () => {
    const shadow = new Shadow({
      color: '#FF0000',
      offsetX: 10,
      offsetY: 10,
      blur: 2,
    });
    const object = new FabricObject({
      fill: '#FF0000',
      angle: 45,
      flipX: true,
    });

    expect(shadow.toSVG(object)).toEqualSVG(
      '<filter id="SVGID_0" y="-40%" height="180%" x="-40%" width="180%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>\n\t<feOffset dx="-14.14" dy="0" result="oBlur" ></feOffset>\n\t<feFlood flood-color="rgb(255,0,0)" flood-opacity="1"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n',
    );
  });

  it('fromObject is a promise', async () => {
    const promise = Shadow.fromObject({});
    expect(promise.then).toBeDefined();
  });
});
