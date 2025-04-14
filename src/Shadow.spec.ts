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

  it('initializing with string', () => {
    // old text-shadow definition - color offsetX offsetY blur
    const shadow1 = new Shadow('rgba(0,0,255,0.5) 10px 20px 5px');

    expect(shadow1.color).toBe('rgba(0,0,255,0.5)');
    expect(shadow1.offsetX).toBe(10);
    expect(shadow1.offsetY).toBe(20);
    expect(shadow1.blur).toBe(5);

    const shadow2 = new Shadow('rgb(0,0,255) 10px 20px ');

    expect(shadow2.color).toBe('rgb(0,0,255)');
    expect(shadow2.offsetX).toBe(10);
    expect(shadow2.offsetY).toBe(20);
    expect(shadow2.blur).toBe(0);

    const shadow3 = new Shadow('#00FF00 30 10 ');

    expect(shadow3.color).toBe('#00FF00');
    expect(shadow3.offsetX).toBe(30);
    expect(shadow3.offsetY).toBe(10);
    expect(shadow3.blur).toBe(0);

    const shadow4 = new Shadow(' #FF0000 10px');

    expect(shadow4.color).toBe('#FF0000');
    expect(shadow4.offsetX).toBe(10);
    expect(shadow4.offsetY).toBe(0);
    expect(shadow4.blur).toBe(0);

    const shadow5 = new Shadow('#000000');

    expect(shadow5.color).toBe('#000000');
    expect(shadow5.offsetX).toBe(0);
    expect(shadow5.offsetY).toBe(0);
    expect(shadow5.blur).toBe(0);

    // new text-shadow definition - offsetX offsetY blur color
    const shadow6 = new Shadow('10px 20px 5px rgba(0,0,255,0.5)');

    expect(shadow6.color).toBe('rgba(0,0,255,0.5)');
    expect(shadow6.offsetX).toBe(10);
    expect(shadow6.offsetY).toBe(20);
    expect(shadow6.blur).toBe(5);

    const shadow7 = new Shadow('10 20 5px #00FF00');

    expect(shadow7.color).toBe('#00FF00');
    expect(shadow7.offsetX).toBe(10);
    expect(shadow7.offsetY).toBe(20);
    expect(shadow7.blur).toBe(5);

    const shadow8 = new Shadow('10px 20px rgb(0,0,255)');

    expect(shadow8.color).toBe('rgb(0,0,255)');
    expect(shadow8.offsetX).toBe(10);
    expect(shadow8.offsetY).toBe(20);
    expect(shadow8.blur).toBe(0);

    const shadow9 = new Shadow(' 10px #FF0000 ');

    expect(shadow9.color).toBe('#FF0000');
    expect(shadow9.offsetX).toBe(10);
    expect(shadow9.offsetY).toBe(0);
    expect(shadow9.blur).toBe(0);

    const shadow10 = new Shadow('  #FF0000 ');

    expect(shadow10.color).toBe('#FF0000');
    expect(shadow10.offsetX).toBe(0);
    expect(shadow10.offsetY).toBe(0);
    expect(shadow10.blur).toBe(0);

    const shadow11 = new Shadow('');

    expect(shadow11.color).toBe('rgb(0,0,0)');
    expect(shadow11.offsetX).toBe(0);
    expect(shadow11.offsetY).toBe(0);
    expect(shadow11.blur).toBe(0);

    const shadow12 = new Shadow('#FF0000 0.1px 0.1px 0.28px');

    expect(shadow12.color).toBe('#FF0000');
    expect(shadow12.offsetX).toBe(0.1);
    expect(shadow12.offsetY).toBe(0.1);
    expect(shadow12.blur).toBe(0.28);

    const shadow13 = new Shadow('rgba(0,0,255,0.5) -0.1px -0.1px 0.28px');

    expect(shadow13.color).toBe('rgba(0,0,255,0.5)');
    expect(shadow13.offsetX).toBe(-0.1);
    expect(shadow13.offsetY).toBe(-0.1);
    expect(shadow13.blur).toBe(0.28);

    const shadow14 = new Shadow('rgba(0,0,255,0.5) -0.1 -0.1 0.77');

    expect(shadow14.color).toBe('rgba(0,0,255,0.5)');
    expect(shadow14.offsetX).toBe(-0.1);
    expect(shadow14.offsetY).toBe(-0.1);
    expect(shadow14.blur).toBe(0.77);

    const shadow15 = new Shadow('rgba(0,0,255,0.5) 0.1 0.1 1');

    expect(shadow15.color).toBe('rgba(0,0,255,0.5)');
    expect(shadow15.offsetX).toBe(0.1);
    expect(shadow15.offsetY).toBe(0.1);
    expect(shadow15.blur).toBe(1);
  });

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
    expect(
      JSON.stringify(object),
      '{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0,"affectStroke":false,"nonScaling":false,"type":"shadow"}',
    );
  });

  it('clone with affectStroke', () => {
    const shadow = new Shadow({ affectStroke: true, blur: 5 });
    expect(typeof shadow.toObject === 'function');
    const object = shadow.toObject(),
      shadow2 = new Shadow(object),
      object2 = shadow2.toObject();
    expect(shadow.affectStroke).toBe(shadow2.affectStroke);
    expect(object).toEqual(object2);
  });

  it('toObject without default value', () => {
    const shadow = new Shadow();
    shadow.includeDefaultValues = false;

    expect(JSON.stringify(shadow.toObject()), '{"type":"shadow"}');

    shadow.color = 'red';
    expect(
      JSON.stringify(shadow.toObject()),
      '{"color":"red","type":"shadow"}',
    );

    shadow.offsetX = 15;
    expect(
      JSON.stringify(shadow.toObject()),
      '{"color":"red","offsetX":15,"type":"shadow"}',
    );
  });

  it('fromObject', async () => {
    return Shadow.fromObject({ color: 'red', offsetX: 15 }).then((shadow) => {
      expect(shadow instanceof Shadow);
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
