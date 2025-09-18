import { beforeAll, expect, it, describe } from 'vitest';
import { Rect } from '../shapes/Rect';
import { Pattern } from './Pattern';
import { getFabricDocument } from '../env';
import { StaticCanvas } from '../canvas/StaticCanvas';
import type { SerializedPatternOptions } from './types';
import GrayFloralImage from '../../test/fixtures/greyfloral.png';
import { isJSDOM } from '../../vitest.extend';

describe('Pattern', () => {
  const IMG_SRC = isJSDOM() ? 'greyfloral.png' : GrayFloralImage;

  async function setSrc(img: HTMLImageElement, src: string) {
    return new Promise((resolve) => {
      img.onload = resolve;
      img.src = src;
    });
  }

  let img: HTMLImageElement;

  beforeAll(async () => {
    img = getFabricDocument().createElement('img');
    await setSrc(img, IMG_SRC);
  });

  function createPattern() {
    return new Pattern({
      source: img,
    });
  }

  it('constructor initializes correctly', () => {
    const pattern = createPattern();
    expect(pattern).toBeInstanceOf(Pattern);
  });

  it('has correct default properties', () => {
    const pattern = createPattern();
    expect(pattern.source).toBe(img);
    expect(pattern.repeat).toBe('repeat');
    expect(pattern.offsetX).toBe(0);
    expect(pattern.offsetY).toBe(0);
    expect(pattern.crossOrigin).toBe('');
  });

  it('converts to object correctly', () => {
    const pattern = createPattern();

    expect(pattern.toObject).toBeTypeOf('function');

    const object = pattern.toObject();

    expect(object.source.indexOf('fixtures/greyfloral.png')).toBeGreaterThan(
      -1,
    );
    expect(object.repeat).toBe('repeat');
    expect(object.offsetX).toBe(0);
    expect(object.offsetY).toBe(0);
    expect(object.patternTransform).toBeNull();
  });

  it('includes custom props in toObject', () => {
    const pattern = createPattern();
    pattern.patternTransform = [1, 0, 0, 2, 0, 0];
    Object.assign(pattern, { id: 'myId' });
    const object = pattern.toObject(['id']);
    expect(object.id).toBe('myId');
    expect(object.patternTransform).toEqual(pattern.patternTransform);
  });

  it('includes crossOrigin in toObject', () => {
    const pattern = new Pattern({
      source: img,
      crossOrigin: 'anonymous',
    });
    const object = pattern.toObject();
    expect(object.crossOrigin).toBe('anonymous');
  });

  it('preserves crossOrigin when creating from object', async () => {
    const patternEnlived = await Pattern.fromObject({
      source: IMG_SRC,
      crossOrigin: 'anonymous',
      type: 'pattern',
    });

    const object = patternEnlived.toObject() as SerializedPatternOptions;
    const patternAgain = await Pattern.fromObject(object);

    expect(patternAgain.crossOrigin).toBe('anonymous');
  });

  it('produces pattern with toLive', () => {
    const pattern = createPattern();
    const canvas = new StaticCanvas(undefined, { enableRetinaScaling: false });
    const patternHTML = canvas.contextContainer.createPattern(img, 'repeat');

    expect(pattern.toLive).toBeTypeOf('function');

    const created = pattern.toLive(canvas.contextContainer);
    expect(created!.toString()).toBe(patternHTML!.toString());
  });

  it('serializes and deserializes correctly with image source', async () => {
    const pattern = createPattern();
    const obj = pattern.toObject() as SerializedPatternOptions;

    // node-canvas doesn't give <img> "src"
    const patternDeserialized = await Pattern.fromObject(obj);

    expect(typeof patternDeserialized.source).toBe('object');
    expect(patternDeserialized.repeat).toBe('repeat');
  });

  it('converts to SVG with default repeat', () => {
    const pattern = createPattern();
    const rect = new Rect({ width: 500, height: 500 });
    const expectedSVG =
      '<pattern id="SVGID_0" x="0" y="0" width="0.3" height="0.248">\n<image x="0" y="0" width="150" height="124" xlink:href="' +
      img.src +
      '"></image>\n</pattern>\n';

    expect(pattern.toSVG).toBeTypeOf('function');
    expect(pattern.toSVG(rect)).toEqualSVG(expectedSVG);
  });

  it('converts to SVG with repeat-y', () => {
    const pattern = createPattern();
    pattern.repeat = 'repeat-y';
    const rect = new Rect({ width: 500, height: 500 });
    const expectedSVG =
      '<pattern id="SVGID_0" x="0" y="0" width="1" height="0.248">\n<image x="0" y="0" width="150" height="124" xlink:href="' +
      img.src +
      '"></image>\n</pattern>\n';

    expect(pattern.toSVG(rect)).toEqualSVG(expectedSVG);
  });

  it('converts to SVG with repeat-x', () => {
    const pattern = createPattern();
    pattern.repeat = 'repeat-x';
    const rect = new Rect({ width: 500, height: 500 });
    const expectedSVG =
      '<pattern id="SVGID_0" x="0" y="0" width="0.3" height="1">\n<image x="0" y="0" width="150" height="124" xlink:href="' +
      img.src +
      '"></image>\n</pattern>\n';

    expect(pattern.toSVG(rect)).toEqualSVG(expectedSVG);
  });

  it('converts to SVG with no-repeat', () => {
    const pattern = createPattern();
    pattern.repeat = 'no-repeat';
    const rect = new Rect({ width: 500, height: 500 });
    const expectedSVG =
      '<pattern id="SVGID_0" x="0" y="0" width="1" height="1">\n<image x="0" y="0" width="150" height="124" xlink:href="' +
      img.src +
      '"></image>\n</pattern>\n';

    expect(pattern.toSVG(rect)).toEqualSVG(expectedSVG);
  });

  it('converts to SVG with no-repeat and offset', () => {
    const pattern = createPattern();
    pattern.repeat = 'no-repeat';
    pattern.offsetX = 50;
    pattern.offsetY = -50;
    const rect = new Rect({ width: 500, height: 500 });
    const expectedSVG =
      '<pattern id="SVGID_0" x="0.1" y="-0.1" width="1.1" height="1.1">\n<image x="0" y="0" width="150" height="124" xlink:href="' +
      img.src +
      '"></image>\n</pattern>\n';

    expect(pattern.toSVG(rect)).toEqualSVG(expectedSVG);
  });

  it('initializes pattern from object correctly', async () => {
    const rectObj = {
      fill: {
        type: 'Pattern',
        source:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      },
    };

    const obj = await Rect.fromObject(rectObj);
    expect(obj.fill instanceof Pattern).toBeTruthy();
  });
});
