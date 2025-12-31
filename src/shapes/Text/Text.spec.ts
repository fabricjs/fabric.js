import { roundSnapshotOptions } from '../../../vitest.extend';
import { cache } from '../../cache';
import { config } from '../../config';
import { Path } from '../Path';
import { FabricText } from './Text';

import { describe, expect, it, afterEach } from 'vitest';
import {
  FabricObject,
  getFabricDocument,
  IText,
  Textbox,
  version,
} from '../../../fabric';
import { toFixed } from '../../util';

const CHAR_WIDTH = 20;

const REFERENCE_TEXT_OBJECT = {
  version: version,
  type: 'Text',
  originX: 'center',
  originY: 'center',
  left: 0,
  top: 0,
  width: CHAR_WIDTH,
  height: 45.2,
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
  text: 'x',
  fontSize: 40,
  fontWeight: 'normal',
  fontFamily: 'Times New Roman',
  fontStyle: 'normal',
  lineHeight: 1.16,
  underline: false,
  overline: false,
  linethrough: false,
  textAlign: 'left',
  textBackgroundColor: '',
  fillRule: 'nonzero',
  paintFirst: 'fill',
  globalCompositeOperation: 'source-over',
  skewX: 0,
  skewY: 0,
  charSpacing: 0,
  styles: [],
  path: undefined,
  strokeUniform: false,
  direction: 'ltr',
  pathStartOffset: 0,
  pathSide: 'left',
  pathAlign: 'baseline',
  textDecorationThickness: 66.667,
};

function createTextObject() {
  return new FabricText('x');
}

describe('FabricText', () => {
  afterEach(() => {
    config.restoreDefaults();
  });

  it('toObject', async () => {
    expect(new FabricText('text').toObject()).toMatchObjectSnapshot();
  });

  it('fromObject', async () => {
    expect((await FabricText.fromObject({ text: 'text' })).toObject()).toEqual(
      new FabricText('text').toObject(),
    );
  });

  describe('measuring, splitting', () => {
    it('measuring', () => {
      cache.clearFontCache();
      const zwc = '\u200b';
      const text = new FabricText('');
      const style = text.getCompleteStyleDeclaration(0, 0);
      const measurement = text._measureChar('a', style, zwc, style);
      expect(measurement).toMatchSnapshot(roundSnapshotOptions);
      expect(measurement).toEqual(text._measureChar('a', style, zwc, style));
    });

    it('splits into lines', () => {
      const text = new FabricText('test foo bar-baz\nqux');
      expect(text._splitTextIntoLines(text.text)).toMatchSnapshot();
    });
  });

  it('toSVG with NUM_FRACTION_DIGITS', async () => {
    const text = await FabricText.fromObject({
      left: 60.5,
      top: 23.1,
      text: 'xxxxxx',
      styles: [
        { fill: 'red' },
        { fill: 'blue' },
        { fill: 'green' },
        { fill: 'yellow' },
        { fill: 'pink' },
      ].map((style, index) => ({ style, start: index, end: index + 1 })),
    });
    config.configure({ NUM_FRACTION_DIGITS: 1 });
    expect(text.toSVG()).toMatchSVGSnapshot();
    config.configure({ NUM_FRACTION_DIGITS: 3 });
    expect(text.toSVG()).toMatchSVGSnapshot();
  });

  it('toSVG with a path', async () => {
    const path = new Path('M 10 10 H 50 V 60', { fill: '', stroke: 'red' });
    const text = new FabricText(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      { scaleX: 2, scaleY: 2, left: 1061, top: 46.2 },
    );
    const plainSvg = text.toSVG();
    text.path = path;
    const svg = text.toSVG();
    expect(text.toSVG()).toMatchSVGSnapshot();
    expect(svg.includes(plainSvg)).toBe(false);
  });

  it('subscript/superscript', async () => {
    const text = await FabricText.fromObject({
      text: 'xxxxxx',
      styles: [
        { stroke: 'black', fill: 'blue' },
        { fill: 'blue' },
        { fontSize: 4, deltaY: 20 },
        { stroke: 'black', fill: 'blue' },
        { fill: 'blue' },
        { fontSize: 4, deltaY: 20 },
      ].map((style, index) => ({ style, start: index, end: index + 1 })),
    });
    text.setSuperscript(1, 2);
    text.setSuperscript(2, 3);
    text.setSubscript(3, 4);
    text.setSubscript(4, 5);
    expect(text.toObject().styles).toMatchSnapshot();
  });

  it('constructor', () => {
    expect(Text, 'Text class should exist').toBeTruthy();

    const text = createTextObject();

    expect(text, 'Text instance should be created').toBeTruthy();
    expect(text, 'should be instance of FabricText').toBeInstanceOf(FabricText);
    expect(text, 'should be instance of FabricObject').toBeInstanceOf(
      FabricObject,
    );
    expect(text.constructor, 'type should be Text').toHaveProperty(
      'type',
      'Text',
    );
    expect(text.get('text'), 'text should be "x"').toBe('x');
  });

  it('toString', () => {
    const text = createTextObject();

    expect(text.toString, 'toString should be a function').toBeTypeOf(
      'function',
    );
    expect(text.toString(), 'toString should return expected string').toBe(
      '#<Text (1): { "text": "x", "fontFamily": "Times New Roman" }>',
    );
  });

  it('_getFontDeclaration', () => {
    const text = createTextObject();

    expect(
      text._getFontDeclaration,
      'has a private method _getFontDeclaration',
    ).toBeTypeOf('function');

    let fontDecl = text._getFontDeclaration();

    expect(fontDecl, 'it returns a string').toBeTypeOf('string');
    expect(fontDecl, 'default font declaration').toBe(
      'normal normal 40px "Times New Roman"',
    );

    text.fontFamily = '"Times New Roman"';
    fontDecl = text._getFontDeclaration();

    expect(fontDecl, 'font declaration with double quotes').toBe(
      'normal normal 40px "Times New Roman"',
    );

    text.fontFamily = "'Times New Roman'";
    fontDecl = text._getFontDeclaration();

    expect(fontDecl, 'font declaration with single quotes').toBe(
      "normal normal 40px 'Times New Roman'",
    );

    fontDecl = text._getFontDeclaration({ fontFamily: 'Arial' });

    expect(fontDecl, 'passed style should take precedence').toBe(
      'normal normal 40px "Arial"',
    );
  });

  it('_getFontDeclaration with coma', () => {
    const text = createTextObject();

    text.fontFamily = 'Arial, sans-serif';
    const fontDecl = text._getFontDeclaration();

    expect(fontDecl, 'if multiple font name detected no quotes added').toBe(
      'normal normal 40px Arial, sans-serif',
    );
  });

  it.each(FabricText.genericFonts)(
    '_getFontDeclaration with genericFont: %s',
    (fontName) => {
      const text = createTextObject();

      text.fontFamily = fontName;
      let fontDecl = text._getFontDeclaration();

      expect(fontDecl, 'it does not quote genericFont').toBe(
        'normal normal 40px ' + fontName,
      );

      text.fontFamily = fontName.toUpperCase();
      fontDecl = text._getFontDeclaration();

      expect(fontDecl, 'it uses a non case sensitive logic').toBe(
        'normal normal 40px ' + fontName.toUpperCase(),
      );
    },
  );

  it('complexity', () => {
    const text = createTextObject();

    expect(text.complexity, 'complexity should be a function').toBeTypeOf(
      'function',
    );
    expect(text.complexity(), 'complexity should be 1').toBe(1);
  });

  it('set', () => {
    const text = createTextObject();

    expect(text.set, 'set should be a function').toBeTypeOf('function');
    expect(text.set('text', 'bar'), 'should be chainable').toBe(text);

    text.set({ left: 1234, top: 2345, angle: 55 });

    expect(text.get('left'), 'left should be set').toBe(1234);
    expect(text.get('top'), 'top should be set').toBe(2345);
    expect(text.get('angle'), 'angle should be set').toBe(55);
  });

  it('lineHeight with single line', () => {
    const text = createTextObject();

    text.text = 'text with one line';
    text.lineHeight = 2;
    text.initDimensions();

    const height = text.height;

    text.lineHeight = 0.5;
    text.initDimensions();

    const heightNew = text.height;

    expect(height, 'text height does not change with one single line').toBe(
      heightNew,
    );
  });

  it('lineHeight with multi line', () => {
    const text = createTextObject();

    text.text = 'text with\ntwo lines';
    text.lineHeight = 0.1;
    text.initDimensions();

    const height = text.height;
    const minimumHeight = text.fontSize * text._fontSizeMult;

    expect(
      height > minimumHeight,
      'text height is always bigger than minimum Height',
    ).toBe(true);
  });

  it('set with "hash"', () => {
    const text = createTextObject();

    text.set({ opacity: 0.123, fill: 'red', fontFamily: 'blah' });

    expect(text.opacity, 'opacity should be set').toBe(0.123);
    expect(text.fill, 'fill should be set').toBe('red');
    expect(text.fontFamily, 'fontFamily should be set').toBe('blah');
  });

  it('get bounding rect after init', () => {
    const string =
      'Some long text, the quick brown fox jumps over the lazy dog etc... blah blah blah';
    const text = new FabricText(string, {
      left: 30,
      top: 30,
      fill: '#ffffff',
      fontSize: 24,
      fontWeight: 'normal',
      fontFamily: 'Arial',
      originY: 'bottom',
    });

    const br = text.getBoundingRect();

    text.setCoords();

    const br2 = text.getBoundingRect();

    expect(
      br,
      'text bounding box is the same before and after calling setCoords',
    ).toEqual(br2);
  });

  it('Text.fromElement', async () => {
    config.configure({ NUM_FRACTION_DIGITS: 2 });

    expect(
      FabricText.fromElement,
      'fromElement should be a function',
    ).toBeTypeOf('function');

    const elText = getFabricDocument().createElement('text');
    elText.textContent = 'x';

    const text = await FabricText.fromElement(elText);
    expect(text, 'should be instance of FabricText').toBeInstanceOf(FabricText);

    const expectedObject = {
      ...REFERENCE_TEXT_OBJECT,
      left: 0,
      top: -14.05,
      width: 8,
      height: 18.08,
      fontSize: 16,
      originX: 'center',
    };

    expect(text.toObject(), 'parsed object is what expected').toEqual(
      expectedObject,
    );
  });

  it('fromElement with custom attributes', async () => {
    config.configure({ NUM_FRACTION_DIGITS: 2 });
    const namespace = 'http://www.w3.org/2000/svg';
    const elTextWithAttrs = getFabricDocument().createElementNS(
      namespace,
      'text',
    );

    elTextWithAttrs.textContent = 'x';
    elTextWithAttrs.setAttributeNS(namespace, 'x', String(10));
    elTextWithAttrs.setAttributeNS(namespace, 'y', String(20));
    elTextWithAttrs.setAttributeNS(namespace, 'fill', 'rgb(255,255,255)');
    elTextWithAttrs.setAttributeNS(namespace, 'opacity', String(0.45));
    elTextWithAttrs.setAttributeNS(namespace, 'stroke', 'blue');
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-width', String(3));
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-miterlimit', String(5));
    elTextWithAttrs.setAttributeNS(namespace, 'font-family', 'Monaco');
    elTextWithAttrs.setAttributeNS(namespace, 'font-style', 'italic');
    elTextWithAttrs.setAttributeNS(namespace, 'font-weight', 'bold');
    elTextWithAttrs.setAttributeNS(namespace, 'font-size', '123');
    elTextWithAttrs.setAttributeNS(namespace, 'letter-spacing', '1em');
    elTextWithAttrs.setAttributeNS(namespace, 'text-decoration', 'underline');
    elTextWithAttrs.setAttributeNS(namespace, 'text-anchor', 'middle');

    const textWithAttrs = await FabricText.fromElement(elTextWithAttrs);

    // temp workaround for text objects not obtaining width under node
    textWithAttrs.width = CHAR_WIDTH;

    expect(textWithAttrs, 'should be instance of FabricText').toBeInstanceOf(
      FabricText,
    );

    const expectedObject = {
      ...REFERENCE_TEXT_OBJECT,
      /* left varies slightly due to node-canvas rendering */
      left: toFixed(textWithAttrs.left + '', 2),
      top: -88.03,
      width: CHAR_WIDTH,
      height: 138.99,
      fill: 'rgb(255,255,255)',
      opacity: 0.45,
      stroke: 'blue',
      strokeWidth: 3,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeLineJoin: 'bevel',
      strokeMiterLimit: 5,
      fontFamily: 'Monaco',
      paintFirst: 'fill',
      fontStyle: 'italic',
      charSpacing: 1000,
      fontWeight: 'bold',
      fontSize: 123,
      underline: true,
    };

    expect(
      textWithAttrs.toObject(),
      'textWithAttrs should match expected object',
    ).toEqual(expectedObject);
  });

  it('dimensions after text change', () => {
    const text = new FabricText('x');

    expect(text.width, 'initial width should be CHAR_WIDTH').toBe(CHAR_WIDTH);

    text.set('text', 'xx');

    expect(text.width, 'width after change should be 2 * CHAR_WIDTH').toBe(
      CHAR_WIDTH * 2,
    );
  });

  it('dimensions without text', () => {
    const text = new FabricText('');

    expect(text.width, 'width should be 2').toBe(2);
  });

  it('setting fontFamily', () => {
    const text = new FabricText('x');

    text.set('fontFamily', 'foobar');

    expect(text.get('fontFamily'), 'fontFamily should be foobar').toBe(
      'foobar',
    );

    text.set('fontFamily', '"Arial Black", Arial');

    expect(
      text.get('fontFamily'),
      'fontFamily with quotes should be preserved',
    ).toBe('"Arial Black", Arial');
  });

  it('text styleHas', () => {
    const text = new FabricText('xxxxxx\nx y');

    text.styles = {};

    expect(text.styleHas, 'styleHas should be a function').toBeTypeOf(
      'function',
    );
    expect(text.styleHas('stroke'), 'the text style has no stroke').toBe(false);

    text.styles = { 1: { 0: { stroke: 'red' } } };

    expect(text.styleHas('stroke'), 'the text style has stroke').toBe(true);
  });

  it('text cleanStyle', () => {
    const text = new FabricText('xxxxxx\nx y');

    text.styles = { 1: { 0: { stroke: 'red' } } };
    text.stroke = 'red';

    expect(text.cleanStyle, 'cleanStyle should be a function').toBeTypeOf(
      'function',
    );

    text.cleanStyle('stroke');

    expect(
      text.styles[1],
      'the style has been cleaned since stroke was equal to text property',
    ).toBe(undefined);

    text.styles = { 1: { 0: { stroke: 'blue' } } };
    text.stroke = 'red';

    text.cleanStyle('stroke');

    expect(text.styles[1][0].stroke, 'nothing to clean, style untouched').toBe(
      'blue',
    );
  });

  it('text cleanStyle with different sub styles styles', () => {
    const text = new FabricText('xxxxxx\nx y');

    text.styles = {
      1: { 0: { fill: 'red' }, 1: { stroke: 'red' }, 2: { stroke: 'blue' } },
    };
    text.stroke = 'red';

    text.cleanStyle('stroke');

    expect(text.stroke, 'the stroke stays red').toBe('red');
    expect(
      text.styles[1][0].fill,
      "the style has not been changed since it's a different property",
    ).toBe('red');
    expect(
      text.styles[1][0].stroke,
      'the style has been cleaned since stroke was equal to text property',
    ).toBe(undefined);
    expect(text.styles[1][1], 'the style remains undefined').toBe(undefined);
    expect(text.styles[1][2].stroke, 'the style remains unchanged').toBe(
      'blue',
    );
  });

  it('text cleanStyle with undefined and set styles', () => {
    const text = new FabricText('xxxxxx\nx y');

    text.styles = { 1: { 1: { stroke: 'red' }, 3: { stroke: 'red' } } };
    text.stroke = 'red';

    text.cleanStyle('stroke');

    expect(text.stroke, 'the stroke stays red').toBe('red');
    expect(
      text.styles[1],
      'the style has been cleaned since stroke was equal to text property',
    ).toBe(undefined);
  });

  it('text cleanStyle with empty styles', () => {
    const text = new FabricText('xxxxxx\nx y');

    text.styles = { 1: { 0: {}, 1: {} }, 2: {}, 3: { 4: {} } };

    // @ts-expect-error -- intentional
    text.cleanStyle('any');

    expect(
      text.styles[1],
      'the style has been cleaned since there was no useful information',
    ).toBe(undefined);
    expect(
      text.styles[2],
      'the style has been cleaned since there was no useful information',
    ).toBe(undefined);
    expect(
      text.styles[3],
      'the style has been cleaned since there was no useful information',
    ).toBe(undefined);
  });

  it('text cleanStyle with full style', () => {
    const text = new FabricText('xxx');

    text.styles = {
      0: { 0: { fill: 'blue' }, 1: { fill: 'blue' }, 2: { fill: 'blue' } },
    };
    text.fill = 'black';

    text.cleanStyle('fill');

    expect(text.fill, 'the fill has been changed to blue').toBe('blue');
    expect(text.styles[0], 'all the style has been removed').toBe(undefined);
  });

  it('text cleanStyle with no relevant style', () => {
    const text = new FabricText('xxx');

    text.styles = {
      0: {
        // @ts-expect-error -- dummy value
        0: { other: 'value1' },
        // @ts-expect-error -- dummy value
        1: { other: 'value2' },
        // @ts-expect-error -- dummy value
        2: { other: 'value3' },
      },
    };
    text.fill = 'black';

    text.cleanStyle('fill');

    expect(text.fill, 'the fill remains black').toBe('black');
    expect(text.styles[0][0], 'style remains the same').toHaveProperty(
      'other',
      'value1',
    );
    expect(text.styles[0][0], 'style remains undefined').not.toHaveProperty(
      'full',
    );
    expect(text.styles[0][1], 'style remains the same').toHaveProperty(
      'other',
      'value2',
    );
    expect(text.styles[0][1], 'style remains undefined').not.toHaveProperty(
      'full',
    );
    expect(text.styles[0][2], 'style remains the same').toHaveProperty(
      'other',
      'value3',
    );
    expect(text.styles[0][2], 'style remains undefined').not.toHaveProperty(
      'full',
    );
  });

  it('text removeStyle with some style', () => {
    const text = new FabricText('xxx');

    text.styles = {
      0: {
        0: { stroke: 'black', fill: 'blue' },
        1: { fill: 'blue' },
        2: { fill: 'blue' },
      },
    };

    expect(text.removeStyle, 'removeStyle should be a function').toBeTypeOf(
      'function',
    );

    text.fill = 'red';
    text.removeStyle('fill');

    expect(text.fill, 'the fill has not been changed').toBe('red');
    expect(
      text.styles[0][0].stroke,
      'the non fill part of the style is still there',
    ).toBe('black');
    expect(
      text.styles[0][0].fill,
      'the fill part of the style has been removed',
    ).toBe(undefined);

    text.styles = {
      0: { 0: { fill: 'blue' }, 1: { fill: 'blue' }, 2: { fill: 'blue' } },
    };
    text.removeStyle('fill');

    expect(text.styles[0], 'the styles got empty and has been removed').toBe(
      undefined,
    );
  });

  it('text toObject removes empty style object', () => {
    const text = new FabricText('xxx');

    text.styles = { 0: { 0: {} } };

    const obj = text.toObject();

    expect(obj.styles, 'empty style object has been removed').toEqual([]);
  });

  it('text toObject can handle style objects with only a textBackgroundColor property', () => {
    const text = new FabricText('xxx');

    text.styles = { 0: { 0: { textBackgroundColor: 'blue' } } };

    const obj = text.toObject();

    expect(
      obj.styles,
      'styles with only a textBackgroundColor property do not throw an error',
    ).toEqual([{ start: 0, end: 1, style: { textBackgroundColor: 'blue' } }]);
  });

  it('getFontCache works with fontWeight numbers', () => {
    const text = new FabricText('xxx', { fontWeight: 400 });

    text.initDimensions();

    const charCache = cache.charWidthsCache.get(text.fontFamily.toLowerCase());
    const cacheProp = text.fontStyle + '_400';

    expect(
      charCache && charCache.has(cacheProp),
      '400 is converted to string',
    ).toBe(true);
  });

  it('getFontCache is case insensitive', () => {
    const text = new FabricText('xxx', {
      fontWeight: 'BOld',
      fontStyle: 'NormaL',
    });
    const text2 = new FabricText('xxx', {
      fontWeight: 'bOLd',
      fontStyle: 'nORMAl',
    });

    text.initDimensions();
    text2.initDimensions();

    const fothCache = cache.getFontCache(text);
    const cache2 = cache.getFontCache(text2);

    expect(fothCache, 'you get the same cache').toBe(cache2);
  });

  it('getSelectionStyles with no arguments', () => {
    const iText = new FabricText('test foo bar-baz\nqux', {
      styles: {
        0: {
          // @ts-expect-error -- typescript does not recognize textDecoration prop
          0: { textDecoration: 'underline' },
          // @ts-expect-error -- typescript does not recognize textDecoration prop
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' },
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' },
        },
      },
    });

    expect(
      iText.getSelectionStyles,
      'getSelectionStyles should be a function',
    ).toBeTypeOf('function');
    expect(
      iText.getSelectionStyles(0),
      'should return empty array with no selection',
    ).toEqual([]);
  });

  it('getSelectionStyles with 2 args', () => {
    const iText = new FabricText('test foo bar-baz\nqux', {
      styles: {
        0: {
          // @ts-expect-error -- typescript does not recognize textDecoration prop
          0: { textDecoration: 'underline' },
          // @ts-expect-error -- typescript does not recognize textDecoration prop
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' },
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' },
        },
      },
    });

    expect(
      iText.getSelectionStyles(0, 5),
      'should return correct styles',
    ).toEqual([
      { textDecoration: 'underline' },
      {},
      { textDecoration: 'overline' },
      {},
      { textBackgroundColor: '#ffc' },
    ]);

    expect(
      iText.getSelectionStyles(2, 2),
      'should return empty array when no styles defined',
    ).toEqual([]);
  });

  it('setSelectionStyles', () => {
    const iText = new FabricText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: '#112233' },
          2: { stroke: '#223344' },
        },
      },
    });

    expect(
      iText.setSelectionStyles,
      'setSelectionStyles should be a function',
    ).toBeTypeOf('function');

    iText.setSelectionStyles(
      {
        fill: 'red',
        stroke: 'yellow',
      },
      0,
    );

    expect(
      iText.styles[0][0],
      'styles should not be changed without selection',
    ).toEqual({
      fill: '#112233',
    });

    iText.setSelectionStyles(
      {
        fill: 'red',
        stroke: 'yellow',
      },
      0,
      1,
    );

    expect(
      iText.styles[0][0],
      'styles should be changed with selection',
    ).toEqual({
      fill: 'red',
      stroke: 'yellow',
    });

    iText.setSelectionStyles(
      {
        fill: '#998877',
        stroke: 'yellow',
      },
      2,
      3,
    );

    expect(
      iText.styles[0][2],
      'styles should be changed with another selection',
    ).toEqual({
      fill: '#998877',
      stroke: 'yellow',
    });
  });

  it('getStyleAtPosition', () => {
    const iText = new FabricText('test foo bar-baz\nqux', {
      styles: {
        0: {
          // @ts-expect-error -- typescript does not recognize textDecoration prop
          0: { textDecoration: 'underline' },
          // @ts-expect-error -- typescript does not recognize textDecoration prop
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' },
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' },
        },
      },
    });

    expect(
      iText.getStyleAtPosition,
      'getStyleAtPosition should be a function',
    ).toBeTypeOf('function');
    expect(
      iText.getStyleAtPosition(2),
      'should return style at position 2',
    ).toEqual({ textDecoration: 'overline' });
    expect(
      iText.getStyleAtPosition(1),
      'should return empty object at position 1',
    ).toEqual({});
    expect(
      iText.getStyleAtPosition(18),
      'should return style at position 18',
    ).toEqual({ fill: 'green' });
  });

  it('getStyleAtPosition complete', () => {
    const iText = new FabricText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { underline: true },
          2: { overline: true },
          4: { textBackgroundColor: '#ffc' },
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' },
        },
      },
    });

    const expectedStyle0 = {
      stroke: null,
      strokeWidth: 1,
      fill: 'rgb(0,0,0)',
      fontFamily: 'Times New Roman',
      fontSize: 40,
      fontWeight: 'normal',
      fontStyle: 'normal',
      underline: true,
      overline: false,
      linethrough: false,
      textBackgroundColor: '',
      deltaY: 0,
      textDecorationThickness: 66.667,
    };

    const expectedStyle2 = {
      stroke: null,
      strokeWidth: 1,
      fill: 'rgb(0,0,0)',
      fontFamily: 'Times New Roman',
      fontSize: 40,
      fontWeight: 'normal',
      fontStyle: 'normal',
      underline: false,
      overline: true,
      linethrough: false,
      textBackgroundColor: '',
      deltaY: 0,
      textDecorationThickness: 66.667,
    };

    expect(
      iText.getStyleAtPosition,
      'getStyleAtPosition should be a function',
    ).toBeTypeOf('function');
    expect(iText.getStyleAtPosition(0, true), 'styles do match at 0').toEqual(
      expectedStyle0,
    );
    expect(iText.getStyleAtPosition(2, true), 'styles do match at 2').toEqual(
      expectedStyle2,
    );
  });

  it('getSvgSpanStyles produces correct output', () => {
    const iText = new IText('test foo bar-baz');
    const styleObject = {
      fill: 'red',
      strokeWidth: 30,
      fontFamily: 'Verdana',
      fontSize: 25,
    };
    // @ts-expect-error -- TODO: this is added by the mixing, can the types be improved here?
    const styleString = iText.getSvgSpanStyles(styleObject);
    const expected =
      "stroke-width: 30; font-family: 'Verdana'; font-size: 25px; fill: rgb(255,0,0); ";

    expect(styleString, 'style is as expected').toBe(expected);
  });

  it('getSvgSpanStyles produces correct output with useWhiteSpace', () => {
    const iText = new IText('test foo bar-baz');
    const styleObject = {
      fill: 'red',
      strokeWidth: 30,
      fontFamily: 'Verdana',
      fontSize: 25,
    };
    // @ts-expect-error -- TODO: this is added by the mixing, can the types be improved here?
    const styleString = iText.getSvgSpanStyles(styleObject, true);
    const expected =
      "stroke-width: 30; font-family: 'Verdana'; font-size: 25px; fill: rgb(255,0,0); white-space: pre; ";

    expect(styleString, 'style is as expected').toBe(expected);
  });

  it('getSvgTextDecoration with overline true produces correct output', () => {
    const iText = new IText('test foo bar-baz');
    const styleObject = {
      overline: true,
    };
    // @ts-expect-error -- TODO: this is added by the mixing, can the types be improved here?
    const styleString = iText.getSvgTextDecoration(styleObject);
    const expected = 'overline';

    expect(styleString, 'style is as expected').toBe(expected);
  });

  it('getSvgTextDecoration with overline underline true produces correct output', () => {
    const iText = new IText('test foo bar-baz');
    const styleObject = {
      overline: true,
      underline: true,
    };
    // @ts-expect-error -- TODO: this is added by the mixing, can the types be improved here?
    const styleString = iText.getSvgTextDecoration(styleObject);
    const expected = 'overline underline';

    expect(styleString, 'style is as expected with overline underline').toBe(
      expected,
    );
  });

  it('getSvgTextDecoration with overline underline linethrough true produces correct output', () => {
    const iText = new IText('test foo bar-baz');
    const styleObject = {
      overline: true,
      underline: true,
      linethrough: true,
    };

    // @ts-expect-error -- TODO: this is added by the mixing, can the types be improved here?
    const styleString = iText.getSvgTextDecoration(styleObject);
    const expected = 'overline underline line-through';

    expect(styleString, 'style is as expected with all decorations').toBe(
      expected,
    );
  });

  it('getHeightOfLine measures height of a line', () => {
    const text = new FabricText('xxx\n');

    const height1 = text.getHeightOfLine(0);
    const height2 = text.getHeightOfLine(1);

    expect(Math.round(height1), 'height of line with text').toBe(52);
    expect(Math.round(height2), 'height of empty line').toBe(52);
    expect(height1, 'both lines should have same height').toBe(height2);
  });

  it('_measureChar handles 0 width chars', () => {
    cache.clearFontCache();

    const zwc = '\u200b';
    const text = new FabricText('');
    const style = text.getCompleteStyleDeclaration(0, 0);
    const box = text._measureChar('a', style, zwc, style);
    const box2 = text._measureChar('a', style, zwc, style);

    expect(
      cache.charWidthsCache
        .get(text.fontFamily.toLowerCase())
        ?.get('normal_normal')
        ?.get(zwc),
      'zwc is a 0 width char',
    ).toBe(0);
    expect(box.kernedWidth, 'measurements should be consistent').toBe(
      box2.kernedWidth,
    );
  });

  it('_deleteStyleDeclaration', () => {
    const text = new FabricText('aaa aaq ggg gg oee eee', {
      styles: {
        0: {
          0: { fontSize: 4 },
          1: { fontSize: 4 },
          2: { fontSize: 4 },
          3: { fontSize: 4 },
          4: { fontSize: 4 },
          5: { fontSize: 4 },
          6: { fontSize: 4 },
          7: { fontSize: 4 },
          8: { fontSize: 4 },
          9: { fontSize: 4 },
          10: { fontSize: 4 },
          11: { fontSize: 4 },
          12: { fontSize: 4 },
          13: { fontSize: 4 },
          14: { fontSize: 4 },
          15: { fontSize: 4 },
          16: { fontSize: 4 },
        },
      },
      width: 5,
    });
    // @ts-expect-error -- protected member
    text._deleteStyleDeclaration(0, 10);

    expect(text.styles[0][10], 'style has been removed').toBe(undefined);
  });

  it('_setStyleDeclaration', () => {
    const text = new FabricText('aaa aaq ggg gg oee eee', {
      styles: {
        0: {
          0: { fontSize: 4 },
          1: { fontSize: 4 },
          2: { fontSize: 4 },
          3: { fontSize: 4 },
          4: { fontSize: 4 },
          5: { fontSize: 4 },
          6: { fontSize: 4 },
          7: { fontSize: 4 },
          8: { fontSize: 4 },
          9: { fontSize: 4 },
          10: { fontSize: 4 },
          11: { fontSize: 4 },
          12: { fontSize: 4 },
          13: { fontSize: 4 },
          14: { fontSize: 4 },
          15: { fontSize: 4 },
          16: { fontSize: 4 },
        },
      },
      width: 5,
    });
    // @ts-expect-error -- protected member
    expect(text._setStyleDeclaration, 'function exists').toBeTypeOf('function');

    const newStyle = { fontSize: 10 };

    // @ts-expect-error -- protected member
    text._setStyleDeclaration(0, 10, newStyle);

    expect(text.styles[0][10], 'style has been changed').toBe(newStyle);
  });

  it('styleHas', () => {
    const textbox = new Textbox('aaa\naaq ggg gg oee eee', {
      styles: {
        0: {
          0: { fontSize: 4 },
          1: { fontSize: 4 },
          2: { fontSize: 4 },
        },
        1: {
          0: { fontFamily: 'Arial' },
          1: { fontFamily: 'Arial' },
          2: { fontFamily: 'Arial' },
        },
      },
      width: 5,
    });

    // @ts-expect-error -- TODO: should lineIndex be made an optional argument? test fails if it is provided but it is mandatory according to the types
    expect(textbox.styleHas('fontSize'), 'style has fontSize').toBe(true);
    expect(
      textbox.styleHas('fontSize', 0),
      'style has fontSize on line 0',
    ).toBe(true);
    expect(
      textbox.styleHas('fontSize', 1),
      'style does not have fontSize on line 1',
    ).toBe(false);
    // @ts-expect-error -- TODO: should lineIndex be made an optional argument? test fails if it is provided but it is mandatory according to the types
    expect(textbox.styleHas('fontFamily'), 'style has fontFamily').toBe(true);
    expect(
      textbox.styleHas('fontFamily', 0),
      'style does not have fontFamily on line 0',
    ).toBe(false);
    expect(
      textbox.styleHas('fontFamily', 1),
      'style has fontFamily on line 1',
    ).toBe(true);
  });

  it('text with a path', () => {
    const text = new FabricText('a', {
      path: new Path('M0 0 h 100 v 100 h -100 z'),
    });

    expect(text.path, 'text has a path').toBeTruthy();
    expect(
      text.path!.segmentsInfo,
      'text has segmentsInfo calculated',
    ).toBeTruthy();
    expect(text.width, 'text width equals path width').toBe(100);
    expect(text.height, 'text height equals path height').toBe(100);
  });

  it('text with a path toObject', () => {
    const text = new FabricText('a', {
      path: new Path('M0 0 h 100 v 100 h -100 z'),
    });

    const toObject = text.toObject();

    expect(toObject.path, 'export has a path').toBeTruthy();
  });

  it('text with a path fromObject', async () => {
    const text = new FabricText('a', {
      path: new Path('M0 0 h 100 v 100 h -100 z'),
    });

    const toObject = text.toObject();
    const text2 = await FabricText.fromObject(toObject);

    expect(text2.path!.constructor, 'the path is restored').toHaveProperty(
      'type',
      'Path',
    );
    expect(text2.path, 'the path is a path').toBeInstanceOf(Path);
    expect(toObject.path, 'the input has still a path property').toBeTruthy();
  });

  it('cacheProperties for text', () => {
    expect(
      FabricText.cacheProperties.join('-'),
      'cache properties include text-specific ones',
    ).toBe(
      'fill-stroke-strokeWidth-strokeDashArray-width-height-paintFirst-strokeUniform-strokeLineCap-strokeDashOffset-strokeLineJoin-strokeMiterLimit-backgroundColor-clipPath-fontSize-fontWeight-fontFamily-fontStyle-lineHeight-text-charSpacing-textAlign-styles-path-pathStartOffset-pathSide-pathAlign-underline-overline-linethrough-textBackgroundColor-direction-textDecorationThickness',
    );
  });

  it('_getLineLeftOffset', () => {
    const text = new FabricText('long line of text\nshort');

    expect(text._getLineLeftOffset(1), 'with align left is 0').toBe(0);

    text.textAlign = 'right';

    expect(
      Math.round(text._getLineLeftOffset(1)),
      'with align right is diff between width and lineWidth',
    ).toBe(174);

    text.textAlign = 'center';

    expect(
      Math.round(text._getLineLeftOffset(1)),
      'with align center is split in 2',
    ).toBe(87);

    text.textAlign = 'justify';

    expect(text._getLineLeftOffset(1), 'with align justify is 0').toBe(0);

    text.textAlign = 'justify-center';

    expect(
      text._getLineLeftOffset(0),
      'is zero for any line but not the last center',
    ).toBe(0);
    expect(Math.round(text._getLineLeftOffset(1)), 'like align center').toBe(
      87,
    );

    text.textAlign = 'justify-left';

    expect(
      text._getLineLeftOffset(0),
      'is zero for any line but not the last left',
    ).toBe(0);
    expect(text._getLineLeftOffset(1), 'like align left').toBe(0);

    text.textAlign = 'justify-right';

    expect(
      text._getLineLeftOffset(0),
      'is zero for any line but not the last right',
    ).toBe(0);
    expect(Math.round(text._getLineLeftOffset(1)), 'like align right').toBe(
      174,
    );
  });

  it('_getLineLeftOffset with direction rtl', () => {
    const text = new FabricText('long line of text\nshort');

    text.direction = 'rtl';

    expect(
      Math.round(text._getLineLeftOffset(1)),
      'with align left is diff between width and lineWidth, negative',
    ).toBe(-174);

    text.textAlign = 'right';

    expect(text._getLineLeftOffset(1), 'with align right is 0').toBe(0);

    text.textAlign = 'center';

    expect(
      Math.round(text._getLineLeftOffset(1)),
      'with align center is split in 2',
    ).toBe(-87);

    text.textAlign = 'justify';

    expect(text._getLineLeftOffset(1), 'with align justify is 0').toBe(0);

    text.textAlign = 'justify-center';

    expect(
      text._getLineLeftOffset(0),
      'is zero for any line but not the last center',
    ).toBe(0);
    expect(Math.round(text._getLineLeftOffset(1)), 'like align center').toBe(
      -87,
    );

    text.textAlign = 'justify-left';

    expect(
      text._getLineLeftOffset(0),
      'is zero for any line but not the last left',
    ).toBe(0);
    expect(
      Math.round(text._getLineLeftOffset(1)),
      'like align left with rtl',
    ).toBe(-174);

    text.textAlign = 'justify-right';

    expect(
      text._getLineLeftOffset(0),
      'is zero for any line but not the last right',
    ).toBe(0);
    expect(text._getLineLeftOffset(1), 'like align right with rtl').toBe(0);
  });

  describe('measuring, splitting', () => {
    it('measuring a single char', () => {
      cache.clearFontCache();
      const text = new FabricText('');
      const style = text.getCompleteStyleDeclaration(0, 0);
      const measurement1 = text._measureChar('a', style, '', style);
      const measurement2 = text._measureChar('a', style, '', style);
      expect(measurement1).toEqual(measurement2);
      const cacheKeys = cache.charWidthsCache
        .get(text.fontFamily.toLowerCase())
        ?.get('normal_normal')
        ?.keys();
      expect(cacheKeys?.next().value).not.toBe('undefineda');
      expect(cacheKeys?.next().done).toBe(true);
    });
  });
});
