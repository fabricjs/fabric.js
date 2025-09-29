import '../../vitest.extend';
import { Textbox } from './Textbox';

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Canvas } from '../canvas/Canvas';
import { stylesFromArray } from '../util';
import { FabricText } from './Text/Text';
import { IText } from './IText/IText';
import type { TPointerEvent } from '../EventTypeDefs';
import { Point } from '../Point';

describe('Textbox', () => {
  let canvas: Canvas;

  beforeAll(() => {
    canvas = new Canvas();
  });

  afterEach(() => {
    canvas.clear();
  });

  it('fromObject', async () => {
    const textbox = await Textbox.fromObject({
      text: 'The quick \nbrown \nfox',
    });
    expect(textbox).toMatchObjectSnapshot();
    expect(textbox).toMatchObjectSnapshot({ includeDefaultValues: false });
  });

  it('toObject with styles', () => {
    const textbox = new Textbox('The quick \nbrown \nfox', {
      width: 120,
      styles: {
        '0': {
          '5': { fill: 'red' },
          '6': { fill: 'red' },
          '7': { fill: 'red' },
          '8': { fill: 'red' },
        },
        '1': {
          '3': { underline: true },
          '4': { underline: true },
          '5': { underline: true },
        },
        '2': {
          '0': { underline: true },
          '1': { underline: true },
        },
      },
    });
    expect(textbox).toMatchObjectSnapshot();
  });

  it('stylesToArray edge case', () => {
    const textbox = new Textbox('The quick \nbrown \nfox', {
      width: 120,
      styles: {
        '0': {
          '5': { fill: 'red' },
          '6': { fill: 'red' },
          '7': { fill: 'red' },
          '8': { fill: 'red' },
          '9': { fill: 'red' },
          '10': { fill: 'red' },
        },
        '2': {
          '0': { fill: 'red' },
        },
      },
    });
    expect(textbox.toObject().styles).toMatchSnapshot();
  });

  it('fromObject with styles', async () => {
    const textbox = new Textbox('The quick \nbrown \nfox', {
      width: 120,
      styles: {
        '0': {
          '5': { fill: 'red' },
          '6': { fill: 'red' },
          '7': { fill: 'red' },
          '8': { fill: 'red' },
        },
        '1': {
          '3': { underline: true },
          '4': { underline: true },
          '5': { underline: true },
        },
        '2': {
          '0': { underline: true },
          '1': { underline: true },
        },
      },
    });
    const textbox2 = await Textbox.fromObject(textbox.toObject());
    expect(textbox2.toObject()).toEqual(textbox.toObject());
    expect(textbox2.styles !== textbox.styles).toBeTruthy();
    for (const a in textbox2.styles) {
      for (const b in textbox2.styles[a]) {
        expect(textbox2.styles[a][b] !== textbox.styles[a][b]).toBeTruthy();
        expect(textbox2.styles[a][b]).toEqual(textbox.styles[a][b]);
      }
    }
  });

  it('constructor', () => {
    const textbox = new Textbox('test');

    expect(textbox, 'should be instance of Textbox').toBeInstanceOf(Textbox);
    expect(textbox, 'should be instance of IText').toBeInstanceOf(IText);
    expect(textbox, 'should be instance of FabricText').toBeInstanceOf(
      FabricText,
    );
  });

  it('constructor with width', () => {
    const textbox = new Textbox('test', { width: 400 });

    expect(textbox.width, 'width is taken by contstructor').toBe(400);
  });

  it('constructor with width too small', () => {
    const textbox = new Textbox('test', { width: 5 });

    expect(
      Math.round(textbox.width),
      'width is calculated by constructor',
    ).toBe(56);
  });

  it('initial properties', () => {
    const textbox = new Textbox('test');

    expect(textbox.text, 'text value should be set').toBe('test');
    expect(
      textbox.constructor,
      'constructor type should be Textbox',
    ).toHaveProperty('type', 'Textbox');
    expect(textbox.styles, 'styles should be empty object').toEqual({});
    expect(
      Textbox.cacheProperties.indexOf('width') > -1,
      'width is in cacheProperties',
    ).toBeTruthy();
  });

  it('isEndOfWrapping', () => {
    const textbox = new Textbox('a q o m s g\np q r s t w', {
      width: 70,
    });

    expect(
      textbox.isEndOfWrapping(0),
      'first line is not end of wrapping',
    ).toBe(false);
    expect(
      textbox.isEndOfWrapping(1),
      'second line is not end of wrapping',
    ).toBe(false);
    expect(
      textbox.isEndOfWrapping(2),
      'line before an hard break is end of wrapping',
    ).toBe(true);
    expect(textbox.isEndOfWrapping(3), 'line 3 is not end of wrapping').toBe(
      false,
    );
    expect(textbox.isEndOfWrapping(4), 'line 4 is not end of wrapping').toBe(
      false,
    );
    expect(textbox.isEndOfWrapping(5), 'last line is end of wrapping').toBe(
      true,
    );
  });

  it('_removeExtraneousStyles', () => {
    const textbox = new Textbox('a q o m s g\np q r s t w', {
      width: 40,
      styles: {
        0: { 0: { fontSize: 4 } },
        1: { 0: { fontSize: 4 } },
        2: { 0: { fontSize: 4 } },
        3: { 0: { fontSize: 4 } },
        4: { 0: { fontSize: 4 } },
        5: { 0: { fontSize: 4 } },
      },
    });

    expect(textbox.styles[3], 'style line 3 exists').toEqual({
      0: { fontSize: 4 },
    });
    expect(textbox.styles[4], 'style line 4 exists').toEqual({
      0: { fontSize: 4 },
    });
    expect(textbox.styles[5], 'style line 5 exists').toEqual({
      0: { fontSize: 4 },
    });

    textbox._removeExtraneousStyles();

    expect(textbox.styles[2], 'style line 2 has been removed').toBeUndefined();
    expect(textbox.styles[3], 'style line 3 has been removed').toBeUndefined();
    expect(textbox.styles[4], 'style line 4 has been removed').toBeUndefined();
    expect(textbox.styles[5], 'style line 5 has been removed').toBeUndefined();
  });

  it('isEmptyStyles', () => {
    const textbox = new Textbox('x x', {
      width: 5,
      styles: { 0: { 0: { fill: 'red' } } },
    });

    expect(textbox._textLines.length, 'lines are wrapped').toBe(2);
    expect(
      textbox._unwrappedTextLines.length,
      'there is only one text line',
    ).toBe(1);
    // @ts-expect-error -- TODO: check if lineIndex should be optional?
    expect(textbox.isEmptyStyles(), 'style is not empty').toBe(false);
    expect(textbox.isEmptyStyles(0), 'style is not empty at line 0').toBe(
      false,
    );
    expect(textbox.isEmptyStyles(1), 'style is empty at line 1').toBe(true);
  });

  it('isEmptyStyles does not crash on null styles', () => {
    const textbox = new Textbox('x x', { width: 5 });

    textbox.styles = {};

    expect(textbox._textLines.length, 'lines are wrapped').toBe(2);
    expect(
      textbox._unwrappedTextLines.length,
      'there is only one text line',
    ).toBe(1);
    expect(textbox.isEmptyStyles(1), 'style is empty').toBe(true);
  });

  it('isEmptyStyles alternate lines', () => {
    const textbox = new Textbox('xa xb xc xd xe\nya yb', {
      width: 5,
      styles: {
        0: {
          0: { fill: 'red' },
          1: { fill: 'blue' },
          9: { fill: 'red' },
          10: { fill: 'blue' },
        },
        1: { 3: { fill: 'red' }, 4: { fill: 'blue' } },
      },
    });

    expect(textbox._textLines.length, 'lines are wrapped').toBe(7);
    expect(
      textbox._unwrappedTextLines.length,
      'there is only one text line',
    ).toBe(2);
    // @ts-expect-error -- TODO: check why lineIndex is mandatory but test doesn't provide it
    expect(textbox.isEmptyStyles(), 'style is not empty').toBe(false);
    expect(textbox.isEmptyStyles(0), 'style is not empty at line 0').toBe(
      false,
    );
    expect(textbox.isEmptyStyles(1), 'style is empty at line 1').toBe(true);
    expect(textbox.isEmptyStyles(2), 'style is empty at line 2').toBe(true);
    expect(textbox.isEmptyStyles(3), 'style is empty at line 3').toBe(false);
    expect(textbox.isEmptyStyles(4), 'style is empty at line 4').toBe(true);
    expect(textbox.isEmptyStyles(5), 'style is empty at line 5').toBe(true);
    expect(textbox.isEmptyStyles(6), 'style is empty at line 6').toBe(false);
  });

  it('wrapping with charspacing', () => {
    const textbox = new Textbox('xa xb xc xd xe ya yb id', {
      width: 190,
    });

    expect(textbox.textLines[0], 'first line match expectations').toBe(
      'xa xb xc xd',
    );

    textbox.charSpacing = 100;
    textbox.initDimensions();

    expect(
      textbox.textLines[0],
      'first line match expectations spacing 100',
    ).toBe('xa xb xc');

    textbox.charSpacing = 300;
    textbox.initDimensions();

    expect(
      textbox.textLines[0],
      'first line match expectations spacing 300',
    ).toBe('xa xb');

    textbox.charSpacing = 800;
    textbox.initDimensions();

    expect(
      textbox.textLines[0],
      'first line match expectations spacing 800',
    ).toBe('xa');
  });

  it('wrapping with splitByGrapheme and styles', () => {
    const value = 'xaxbxcxdeyaybid';
    const textbox = new Textbox(value, {
      width: 190,
      splitByGrapheme: true,
      styles: stylesFromArray(
        [
          {
            style: {
              fontWeight: 'bold',
              fontSize: 64,
            },
            start: 0,
            end: 9,
          },
        ],
        value,
      ),
    });

    expect(
      textbox.textLines,
      'lines match splitByGrapheme with styles',
    ).toEqual(['xaxbx', 'cxdeyay', 'bid']);
  });

  it('wrapping with largestWordWidth and styles', () => {
    const value = 'xaxbxc xdeyayb id sdgjhgsdg';
    const textbox = new Textbox(value, {
      width: 190,
      styles: stylesFromArray(
        [
          {
            style: {
              fontWeight: 'bold',
              fontSize: 64,
            },
            start: 0,
            end: 10,
          },
        ],
        value,
      ),
    });

    expect(
      textbox.textLines,
      'lines match largestWordWidth with styles',
    ).toEqual(['xaxbxc', 'xdeyayb', 'id', 'sdgjhgsdg']);
  });

  it('wrapping with charspacing and splitByGrapheme positive', () => {
    const textbox = new Textbox('xaxbxcxdeyaybid', {
      width: 190,
      splitByGrapheme: true,
      charSpacing: 400,
    });

    expect(
      textbox.textLines,
      'lines match splitByGrapheme charSpacing 400',
    ).toEqual(['xaxbx', 'cxdey', 'aybid']);
  });

  it('wrapping with charspacing and splitByGrapheme negative', () => {
    const textbox = new Textbox('xaxbxcxdeyaybid', {
      width: 190,
      splitByGrapheme: true,
      charSpacing: -100,
    });

    expect(
      textbox.textLines,
      'lines match splitByGrapheme charSpacing -100',
    ).toEqual(['xaxbxcxdeyay', 'bid']);
  });

  it('Measure words', () => {
    const textbox = new Textbox('word word\nword\nword', { width: 300 });
    const { wordsData, largestWordWidth } = textbox.getGraphemeDataForRender(
      textbox.textLines,
    );

    expect(wordsData[0], 'All words have the same length line 0').toEqual([
      { word: ['w', 'o', 'r', 'd'], width: largestWordWidth },
      { word: ['w', 'o', 'r', 'd'], width: largestWordWidth },
    ]);
    expect(wordsData[1], 'All words have the same length line1').toEqual([
      { word: ['w', 'o', 'r', 'd'], width: largestWordWidth },
    ]);
    expect(Math.round(largestWordWidth), 'largest word is 82').toBe(82);
  });

  it('Measure words with styles', () => {
    const textbox = new Textbox('word word\nword\nword', { width: 300 });

    textbox.styles = {
      0: {
        5: {
          fontSize: 100,
        },
        6: {
          fontSize: 100,
        },
        7: {
          fontSize: 100,
        },
        8: {
          fontSize: 100,
        },
      },
      2: {
        0: {
          fontSize: 200,
        },
        1: {
          fontSize: 200,
        },
        2: {
          fontSize: 200,
        },
        3: {
          fontSize: 200,
        },
      },
    };

    const { wordsData, largestWordWidth } = textbox.getGraphemeDataForRender(
      textbox.textLines,
    );

    expect(Math.round(wordsData[0][0].width), 'unstyle word is 82 wide').toBe(
      82,
    );
    expect(Math.round(wordsData[0][1].width), 'unstyle word is 206 wide').toBe(
      206,
    );
    expect(wordsData[2], 'All words have the same length line1').toEqual([
      { word: ['w', 'o', 'r', 'd'], width: largestWordWidth },
    ]);
    expect(Math.round(largestWordWidth), 'largest word is 411').toBe(411);
  });

  it('wrapping with different things', () => {
    const textbox = new Textbox('xa xb\txc\rxd xe ya yb id', {
      width: 16,
    });

    expect(textbox.textLines[0], '0 line match expectations').toBe('xa');
    expect(textbox.textLines[1], '1 line match expectations').toBe('xb');
    expect(textbox.textLines[2], '2 line match expectations').toBe('xc');
    expect(textbox.textLines[3], '3 line match expectations').toBe('xd');
    expect(textbox.textLines[4], '4 line match expectations').toBe('xe');
    expect(textbox.textLines[5], '5 line match expectations').toBe('ya');
    expect(textbox.textLines[6], '6 line match expectations').toBe('yb');
  });

  it('wrapping with splitByGrapheme', () => {
    const textbox = new Textbox('xaxbxcxdxeyaybid', {
      width: 1,
      splitByGrapheme: true,
    });

    expect(
      textbox.textLines[0],
      '0 line match expectations splitByGrapheme',
    ).toBe('x');
    expect(
      textbox.textLines[1],
      '1 line match expectations splitByGrapheme',
    ).toBe('a');
    expect(
      textbox.textLines[2],
      '2 line match expectations splitByGrapheme',
    ).toBe('x');
    expect(
      textbox.textLines[3],
      '3 line match expectations splitByGrapheme',
    ).toBe('b');
    expect(
      textbox.textLines[4],
      '4 line match expectations splitByGrapheme',
    ).toBe('x');
    expect(
      textbox.textLines[5],
      '5 line match expectations splitByGrapheme',
    ).toBe('c');
  });

  it('wrapping with custom space', () => {
    const textbox = new Textbox('xa xb xc xd xe ya yb id', {
      width: 2000,
    });

    const wordsData = textbox.getGraphemeDataForRender([
      'xa xb xc xd xe ya yb id',
    ]);
    const line1 = textbox._wrapLine(0, 100, wordsData, 0);
    const expected1 = [
      ['x', 'a', ' ', 'x', 'b'],
      ['x', 'c', ' ', 'x', 'd'],
      ['x', 'e', ' ', 'y', 'a'],
      ['y', 'b', ' ', 'i', 'd'],
    ];

    expect(line1, 'line1 match expected').toEqual(expected1);
    expect(textbox.dynamicMinWidth, 'texbox width is 40').toBe(40);

    const line2 = textbox._wrapLine(0, 100, wordsData, 50);
    const expected2 = [
      ['x', 'a'],
      ['x', 'b'],
      ['x', 'c'],
      ['x', 'd'],
      ['x', 'e'],
      ['y', 'a'],
      ['y', 'b'],
      ['i', 'd'],
    ];

    expect(line2, 'line2 match expected').toEqual(expected2);
    expect(textbox.dynamicMinWidth, 'texbox width is 90').toBe(90);
  });

  it('wrapping an empty line', () => {
    const textbox = new Textbox('', {
      width: 10,
    });

    const wordsData = textbox.getGraphemeDataForRender(['']);
    const line1 = textbox._wrapLine(0, 100, wordsData, 0);

    expect(line1, 'wrapping without splitByGrapheme').toEqual([[]]);

    textbox.splitByGrapheme = true;
    const line2 = textbox._wrapLine(0, 100, wordsData, 0);

    expect(line2, 'wrapping with splitByGrapheme').toEqual([[]]);
  });

  it('wrapping respects max line width', () => {
    const a = 'xaxbxc xdxeyaybid xaxbxc';
    const b = 'xaxbxcxdxeyaybidxaxbxcxdxeyaybid';

    [true, false].forEach((order) => {
      [true, false].forEach((space) => {
        const ordered = order ? [a, b] : [b, a];
        const text = ordered.join(space ? ' ' : '\n');
        const { _textLines: lines } = new Textbox(text);

        expect(lines, `max line width should be respected for ${text}`).toEqual(
          ordered.map((line) => line.split('')),
        );
      });
    });
  });

  it('texbox will change width from the mr corner', () => {
    const text = new Textbox('xa xb xc xd xe ya yb id', { strokeWidth: 0 });
    text.setPositionByOrigin(new Point(0, 0), 'left', 'top');
    canvas.add(text);
    canvas.setActiveObject(text);

    const eventStub = {
      clientX: text.width,
      clientY: text.oCoords.mr.corner.tl.y + 1,
      type: 'mousedown',
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent & { clientX: number; clientY: number };

    const originalWidth = text.width;

    canvas._onMouseDown(eventStub);
    canvas._onMouseMove({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mousemove',
    });
    canvas._onMouseUp({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mouseup',
    });

    expect(text.width, 'width increased').toBe(originalWidth + 20);
  });

  it('texbox will change width from the ml corner', () => {
    const text = new Textbox('xa xb xc xd xe ya yb id', {
      strokeWidth: 0,
      left: 40,
    });
    text.setPositionByOrigin(new Point(40, 0), 'left', 'top');
    canvas.add(text);
    canvas.setActiveObject(text);

    const eventStub = {
      clientX: text.left - text.width / 2,
      clientY: text.oCoords.ml.corner.tl.y + 2,
      type: 'mousedown',
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent & { clientX: number; clientY: number };

    const originalWidth = text.width;

    canvas._onMouseDown(eventStub);
    canvas._onMouseMove({
      ...eventStub,
      clientX: eventStub.clientX - 20,
      clientY: eventStub.clientY,
      type: 'mousemove',
    });
    canvas._onMouseUp({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mouseup',
    });

    expect(text.width, 'width increased').toBe(originalWidth + 20);
  });

  it('_removeExtraneousStyles for textbox', () => {
    const iText = new Textbox('a\nqqo', {
      styles: {
        0: { 0: { fontSize: 4 } },
        1: { 0: { fontSize: 4 } },
        2: { 0: { fontSize: 4 } },
        3: { 0: { fontSize: 4 } },
        4: { 0: { fontSize: 4 } },
      },
    });

    expect(iText.styles[3], 'style line 3 exists').toEqual({
      0: { fontSize: 4 },
    });
    expect(iText.styles[4], 'style line 4 exists').toEqual({
      0: { fontSize: 4 },
    });

    iText._removeExtraneousStyles();

    expect(iText.styles[3], 'style line 3 has been removed').toBeUndefined();
    expect(iText.styles[4], 'style line 4 has been removed').toBeUndefined();
  });

  it('get2DCursorLocation with splitByGrapheme', () => {
    const iText = new Textbox('aaaaaaaaaaaaaaaaaaaaaaaa', {
      width: 60,
      splitByGrapheme: true,
    });

    let loc = iText.get2DCursorLocation();

    expect(loc.lineIndex, 'initial cursor line should be 0').toBe(0);
    expect(loc.charIndex, 'initial cursor position should be 0').toBe(0);

    iText.selectionStart = iText.selectionEnd = 4;
    loc = iText.get2DCursorLocation();

    expect(loc.lineIndex, 'selection end 4 line 1').toBe(1);
    expect(loc.charIndex, 'selection end 4 char 1').toBe(1);

    iText.selectionStart = iText.selectionEnd = 7;
    loc = iText.get2DCursorLocation();

    expect(loc.lineIndex, 'selection end 7 line 2').toBe(2);
    expect(loc.charIndex, 'selection end 7 char 1').toBe(1);

    iText.selectionStart = iText.selectionEnd = 14;
    loc = iText.get2DCursorLocation();

    expect(loc.lineIndex, 'selection end 14 line 4').toBe(4);
    expect(loc.charIndex, 'selection end 14 char 2').toBe(2);
  });

  it('missingNewlineOffset with splitByGrapheme', () => {
    const textbox = new Textbox('aaa\naaaaaa\na\naaaaaaaaaaaa\n aaa', {
      width: 80,
      splitByGrapheme: true,
    });

    const expected = {
      lines: ['aaa', 'aaaa', 'aa', 'a', 'aaaa', 'aaaa', 'aaaa', ' aaa'],
      hardBreaks: [1, 0, 1, 1, 0, 0, 1, 1],
      cursor: [
        { selection: 1, lineIndex: 0, charIndex: 1 }, //  a|aa
        { selection: 4, lineIndex: 1, charIndex: 0 }, //  |aaaa
        { selection: 9, lineIndex: 2, charIndex: 1 }, //  a|a
        { selection: 11, lineIndex: 3, charIndex: 0 }, // |a
        { selection: 14, lineIndex: 4, charIndex: 1 }, // a|aaa
        { selection: 20, lineIndex: 5, charIndex: 3 }, // aaa|a
        { selection: 22, lineIndex: 6, charIndex: 1 }, // a|aaa
        { selection: 29, lineIndex: 7, charIndex: 3 }, //  aa|a
      ],
    };

    expect(textbox.textLines, 'wrap line by width').toEqual(expected.lines);

    for (let i = 0; i < expected.hardBreaks.length; i++) {
      const offset = textbox.missingNewlineOffset(i);
      expect(
        offset,
        `line ${i} expect missingNewlineOffset: ${expected.hardBreaks[i]}`,
      ).toBe(expected.hardBreaks[i]);
    }

    let loc = textbox.get2DCursorLocation();
    expect(loc.lineIndex, 'initial cursor line should be 0').toBe(0);
    expect(loc.charIndex, 'initial cursor position should be 0').toBe(0);

    for (let i = 0; i < expected.cursor.length; i++) {
      const { selection, lineIndex, charIndex } = expected.cursor[i];
      textbox.selectionStart = textbox.selectionEnd = selection;
      loc = textbox.get2DCursorLocation();
      expect(
        loc.lineIndex,
        `selection end ${selection} line ${lineIndex}`,
      ).toBe(lineIndex);
      expect(
        loc.charIndex,
        `selection end ${selection} char ${charIndex}`,
      ).toBe(charIndex);
    }
  });

  it('missingNewlineOffset with normal split 1', () => {
    const textbox = new Textbox('aaa\naaaaaa\na\naaaaaaaaaaaa\n aaa', {
      width: 80,
    });

    const expected = {
      lines: ['aaa', 'aaaaaa', 'a', 'aaaaaaaaaaaa', ' aaa'],
      hardBreaks: [1, 1, 1, 1, 1], // it has to always return 1
      cursor: [
        { selection: 1, lineIndex: 0, charIndex: 1 }, //  a|aa
        { selection: 4, lineIndex: 1, charIndex: 0 }, //  |aaaaaa
        { selection: 12, lineIndex: 2, charIndex: 1 }, //  a|
        { selection: 22, lineIndex: 3, charIndex: 9 }, // aaaaaaaaa|aaa
        { selection: 28, lineIndex: 4, charIndex: 2 }, //  a|aa
      ],
    };

    expect(textbox.textLines, 'wrap by largestWordWidth').toEqual(
      expected.lines,
    );
    for (let i = 0; i < expected.hardBreaks.length; i++) {
      const offset = textbox.missingNewlineOffset(i);
      expect(offset, `line ${i} expect ${expected.hardBreaks[i]}`).toBe(
        expected.hardBreaks[i],
      );
    }

    let loc = textbox.get2DCursorLocation();
    expect(loc.lineIndex, 'initial cursor line should be 0').toBe(0);
    expect(loc.charIndex, 'initial cursor position should be 0').toBe(0);

    for (let i = 0; i < expected.cursor.length; i++) {
      const { selection, lineIndex, charIndex } = expected.cursor[i];
      textbox.selectionStart = textbox.selectionEnd = selection;
      loc = textbox.get2DCursorLocation();
      expect(
        loc.lineIndex,
        `selection end ${selection} line ${lineIndex}`,
      ).toBe(lineIndex);
      expect(
        loc.charIndex,
        `selection end ${selection} char ${charIndex}`,
      ).toBe(charIndex);
    }
  });

  it('missingNewlineOffset with normal split and short word', () => {
    const textbox = new Textbox(
      'aaa\naaaaaa          \na\naaaaaaa aaaaa\n aaa',
      {
        width: 80,
      },
    );

    const expected = {
      lines: ['aaa', 'aaaaaa ', '        ', 'a', 'aaaaaaa', 'aaaaa', ' aaa'],
      hardBreaks: [1, 1, 1, 1, 1, 1, 1], // Note: currently, lineIndex 2 and 4 no hardBreak but still removed a space
      cursor: [
        { selection: 1, lineIndex: 0, charIndex: 1 }, //  a|aa
        { selection: 4, lineIndex: 1, charIndex: 0 }, //  |aaaaaa
        { selection: 13, lineIndex: 2, charIndex: 1 }, // 8 space
        { selection: 22, lineIndex: 3, charIndex: 1 }, // a|
        { selection: 29, lineIndex: 4, charIndex: 6 }, // aaaaaa|a
        { selection: 32, lineIndex: 5, charIndex: 1 }, // a|aaaa
        { selection: 38, lineIndex: 6, charIndex: 1 }, //  |aaa
      ],
    };

    expect(textbox.textLines, 'wrap by largestWordWidth').toEqual(
      expected.lines,
    );
    for (let i = 0; i < expected.hardBreaks.length; i++) {
      const offset = textbox.missingNewlineOffset(i);
      expect(offset, `line ${i} expect ${expected.hardBreaks[i]}`).toBe(
        expected.hardBreaks[i],
      );
    }

    let loc = textbox.get2DCursorLocation();
    expect(loc.lineIndex, 'initial cursor line should be 0').toBe(0);
    expect(loc.charIndex, 'initial cursor position should be 0').toBe(0);

    for (let i = 0; i < expected.cursor.length; i++) {
      const { selection, lineIndex, charIndex } = expected.cursor[i];
      textbox.selectionStart = textbox.selectionEnd = selection;
      loc = textbox.get2DCursorLocation();
      expect(
        loc.lineIndex,
        `selection end ${selection} line ${lineIndex}`,
      ).toBe(lineIndex);
      expect(
        loc.charIndex,
        `selection end ${selection} char ${charIndex}`,
      ).toBe(charIndex);
    }
  });

  it('_getLineStyle', () => {
    const textbox = new Textbox('aaa aaq ggg gg\noee eee', {
      styles: {
        1: { 0: { fontSize: 4 } },
      },
      width: 80,
    });

    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(0), 'wrapped line 0 has no style').toBe(false);
    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(1), 'wrapped line 1 has no style').toBe(false);
    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(4), 'wrapped line 2 has style').toBe(true);
  });

  it('_setLineStyle', () => {
    const textbox = new Textbox('aaa aaq ggg gg\noee eee', {
      styles: {
        1: { 0: { fontSize: 4 } },
      },
      width: 80,
    });

    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(0), 'wrapped line 0 has no style').toBe(false);
    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(1), 'wrapped line 1 has no style').toBe(false);
    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(2), 'wrapped line 2 has no style').toBe(false);
    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(3), 'wrapped line 3 has no style').toBe(false);

    expect(textbox.styles[0], 'style is undefined').toBeUndefined();

    // @ts-expect-error -- protected member
    textbox._setLineStyle(0);

    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(0), 'wrapped line 0 has style').toBe(true);
    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(1), 'wrapped line 1 has style').toBe(true);
    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(2), 'wrapped line 2 has style').toBe(true);
    // @ts-expect-error -- protected member
    expect(textbox._getLineStyle(3), 'wrapped line 3 has style').toBe(true);

    expect(textbox.styles[0], 'style is an empty object').toEqual({});
  });

  it('_deleteStyleDeclaration', () => {
    const text = 'aaa aaq ggg gg oee eee';
    const styles: Record<PropertyKey, any> = {};

    for (let index = 0; index < text.length; index++) {
      styles[index] = { fontSize: 4 };
    }

    const textbox = new Textbox(text, {
      styles: { 0: styles },
      width: 5,
    });

    // @ts-expect-error -- protected member
    expect(textbox._deleteStyleDeclaration, 'function exists').toBeTypeOf(
      'function',
    );

    // @ts-expect-error -- protected member
    textbox._deleteStyleDeclaration(2, 2);

    expect(textbox.styles[0][10], 'style has been removed').toBeUndefined();
  });

  it('_setStyleDeclaration', () => {
    const text = 'aaa aaq ggg gg oee eee';
    const styles: Record<PropertyKey, any> = {};

    for (let index = 0; index < text.length; index++) {
      styles[index] = { fontSize: 4 };
    }

    const textbox = new Textbox(text, {
      styles: { 0: styles },
      width: 5,
    });

    // @ts-expect-error -- protected member
    expect(textbox._setStyleDeclaration, 'function exists').toBeTypeOf(
      'function',
    );

    const newStyle = { fontSize: 10 };

    // @ts-expect-error -- protected member
    textbox._setStyleDeclaration(2, 2, newStyle);

    expect(textbox.styles[0][10], 'style has been changed').toBe(newStyle);
  });

  it('styleHas', () => {
    const textbox = new Textbox('aaa aaq ggg gg oee eee', {
      styles: {
        0: {
          0: { fontSize: 4 },
          1: { fontSize: 4 },
          2: { fontSize: 4 },
          4: { fontFamily: 'Arial' },
          5: { fontFamily: 'Arial' },
          6: { fontFamily: 'Arial' },
        },
      },
      width: 5,
    });

    // @ts-expect-error -- TODO: check why lineIndex is mandatory but test doesn't provide it
    expect(textbox.styleHas('fontSize'), 'style has fontSize').toBe(true);
    expect(
      textbox.styleHas('fontSize', 0),
      'style has fontSize on line 0',
    ).toBe(true);
    // @ts-expect-error -- TODO: check why lineIndex is mandatory but test doesn't provide it
    expect(textbox.styleHas('fontFamily'), 'style has fontFamily').toBe(true);
    expect(
      textbox.styleHas('fontFamily', 1),
      'style has fontFamily on line 1',
    ).toBe(true);
  });

  it('The same text does not need to be wrapped.', () => {
    const str = '0123456789';

    const measureTextbox = new Textbox(str, {
      fontSize: 20,
      splitByGrapheme: false,
    });

    const newTextbox = new Textbox(str, {
      width: measureTextbox.width,
      fontSize: 20,
      splitByGrapheme: true,
    });

    expect(newTextbox.textLines.length, 'The same text is not wrapped').toBe(
      measureTextbox.textLines.length,
    );
  });
});
