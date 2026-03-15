import { Canvas } from '../../canvas/Canvas';
import { Group } from '../Group';
import { IText } from './IText';
import { Point } from '../../Point';
import {
  describe,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  it,
} from 'vitest';
import { FabricText } from '../Text/Text';
import { version } from '../../../package.json';
import { getFabricWindow } from '../../env';
import { config } from '../../config';
import { LEFT, LTR } from '../../constants';

const ITEXT_OBJECT = {
  version: version,
  type: 'IText',
  originX: 'left' as const,
  originY: 'top' as const,
  left: 0,
  top: 0,
  width: 20,
  height: 45.2,
  fill: 'rgb(0,0,0)',
  stroke: null,
  strokeWidth: 1,
  strokeDashArray: null,
  strokeLineCap: 'butt' as const,
  strokeDashOffset: 0,
  strokeLineJoin: 'miter' as const,
  strokeMiterLimit: 4,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  opacity: 1,
  shadow: null,
  visible: true,
  text: 'x',
  fontSize: 40,
  fontWeight: 'normal',
  fontFamily: 'Times New Roman',
  fontStyle: 'normal',
  lineHeight: 1.3,
  underline: false,
  overline: false,
  linethrough: false,
  textAlign: LEFT,
  backgroundColor: '',
  textBackgroundColor: '',
  fillRule: 'nonzero' as const,
  paintFirst: 'fill' as const,
  globalCompositeOperation: 'source-over' as const,
  skewX: 0,
  skewY: 0,
  charSpacing: 0,
  styles: [],
  strokeUniform: false,
  path: undefined,
  direction: LTR,
  pathStartOffset: 0,
  pathSide: LEFT,
  pathAlign: 'baseline' as const,
  textDecorationThickness: 66.67,
};

describe('IText', () => {
  let canvas: Canvas;

  beforeEach(() => {
    canvas = new Canvas();
  });

  afterEach(() => {
    canvas.clear();
    canvas.cancelRequestedRender();
    config.clearFonts();
  });

  describe('cursor drawing width', () => {
    it.each([
      { scale: 1, zoom: 1, textScale: 1, angle: 0, textAngle: 0 },
      { scale: 1, zoom: 50, textScale: 2, angle: 0, textAngle: 0 },
      { scale: 200, zoom: 1, textScale: 2, angle: 45, textAngle: 0 },
      { scale: 200, zoom: 1, textScale: 1, angle: 0, textAngle: 0 },
      { scale: 200, zoom: 50, textScale: 1, angle: 30, textAngle: 30 },
      { scale: 200, zoom: 1 / 200, textScale: 1, angle: 0, textAngle: 0 },
      { scale: 200, zoom: 1 / 200, textScale: 2, angle: 0, textAngle: 90 },
    ])(
      'group scaled by $scale and rotated by $angle , text scaled by $textScale and rotated by $textAngle, and canvas zoomed by $zoom',
      ({ scale, zoom, textScale, angle, textAngle }) => {
        const text = new IText('testing', {
          cursorWidth: 100,
          angle: textAngle,
          scaleX: textScale,
          scaleY: textScale,
        });
        const group = new Group([text]);
        group.set({ scaleX: scale, scaleY: scale, angle });
        group.setCoords();
        const fillRect = vi.fn();
        const getZoom = vi.fn().mockReturnValue(zoom);
        const mockContext = { fillRect };
        const mockCanvas = { contextTop: mockContext, getZoom };
        Object.assign(text, {
          canvas: mockCanvas,
        });

        text.renderCursorAt(1);
        const call = fillRect.mock.calls[0];
        expect({ width: call[2], height: call[3] }).toMatchSnapshot({
          cloneDeepWith: (value: unknown) =>
            typeof value === 'number' ? value.toFixed(3) : undefined,
        });
      },
    );
  });
  describe('Interaction with mouse and editing', () => {
    it('_mouseDownHandlerBefore set up selected property', () => {
      const iText = new IText('test need some word\nsecond line');
      iText.canvas = new Canvas();
      // @ts-expect-error -- protected member
      expect(iText.selected).toBe(undefined);
      // @ts-expect-error -- mock events
      iText._mouseDownHandler({ e: { button: 0 }, alreadySelected: false });
      // @ts-expect-error -- protected member
      expect(iText.selected).toBe(false);
      // @ts-expect-error -- mock events
      iText._mouseDownHandler({ e: {}, alreadySelected: true });
      // @ts-expect-error -- protected member
      expect(iText.selected).toBe(true);
    });
  });

  it('constructor', () => {
    const iText = new IText('test');

    expect(iText, 'should be instance of IText').toBeInstanceOf(IText);
    expect(iText, 'should be instance of FabricText').toBeInstanceOf(
      FabricText,
    );
  });

  it('initial properties', () => {
    const iText = new IText('test');

    expect(iText, 'should be instance of IText').toBeInstanceOf(IText);
    expect(iText.text, 'text should be set to test').toBe('test');
    expect(
      iText.constructor,
      'constructor type should be IText',
    ).toHaveProperty('type', 'IText');
    expect(iText.styles, 'styles should be empty object').toEqual({});
  });

  it('fromObject', async () => {
    expect(IText.fromObject, 'fromObject should be a function').toBeTypeOf(
      'function',
    );

    const iText = await IText.fromObject(ITEXT_OBJECT);

    expect(iText, 'should be instance of IText').toBeInstanceOf(IText);
    expect(iText.toObject(), 'object should match the reference').toEqual(
      ITEXT_OBJECT,
    );
  });

  it('lineHeight with single line', () => {
    const text = new IText('text with one line');

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
    const text = new IText('text with\ntwo lines');

    text.lineHeight = 0.1;
    text.initDimensions();
    const height = text.height;
    const minimumHeight = text.fontSize * text._fontSizeMult;

    expect(
      height > minimumHeight,
      'text height is always bigger than minimum Height',
    ).toBeTruthy();
  });

  it('toObject', () => {
    const stylesObject = {
      0: {
        0: { fill: 'red' },
        1: { textDecoration: 'underline' },
      },
    };

    const stylesArray = [
      {
        start: 0,
        end: 1,
        style: { fill: 'red' },
      },
      {
        start: 1,
        end: 2,
        style: { textDecoration: 'underline' },
      },
    ];

    const iText = new IText('test', {
      // @ts-expect-error -- partial style
      styles: stylesObject,
    });

    expect(iText.toObject, 'toObject should be a function').toBeTypeOf(
      'function',
    );

    const obj = iText.toObject();

    expect(
      obj.styles,
      'object styles array should match expected styles',
    ).toEqual(stylesArray);
    expect(obj.styles[0], 'object styles should be a clone').not.toBe(
      stylesArray[0],
    );
    expect(obj.styles[1], 'object styles should be a clone').not.toBe(
      stylesArray[1],
    );
    expect(obj.styles[0].style, 'object style should be a clone').not.toBe(
      stylesArray[0].style,
    );
    expect(obj.styles[1].style, 'object style should be a clone').not.toBe(
      stylesArray[1].style,
    );
    expect(obj.styles[0], 'object style should match reference').toEqual(
      stylesArray[0],
    );
    expect(obj.styles[1], 'object style should match reference').toEqual(
      stylesArray[1],
    );
    expect(obj.styles[0].style, 'object style should match reference').toEqual(
      stylesArray[0].style,
    );
    expect(obj.styles[1].style, 'object style should match reference').toEqual(
      stylesArray[1].style,
    );
  });

  it('setSelectionStart', () => {
    const iText = new IText('test');

    expect(
      iText.setSelectionStart,
      'setSelectionStart should be a function',
    ).toBeTypeOf('function');
    expect(iText.selectionStart, 'initial selectionStart should be 0').toBe(0);

    iText.setSelectionStart(3);
    expect(iText.selectionStart, 'selectionStart should be set to 3').toBe(3);
    expect(iText.selectionEnd, 'selectionEnd should remain 0').toBe(0);
  });

  it('empty itext', () => {
    const iText = new IText('');

    expect(iText.width, 'width should equal cursorWidth').toBe(
      iText.cursorWidth,
    );
  });

  it('setSelectionEnd', () => {
    const iText = new IText('test');

    expect(
      iText.setSelectionEnd,
      'setSelectionEnd should be a function',
    ).toBeTypeOf('function');
    expect(iText.selectionEnd, 'initial selectionEnd should be 0').toBe(0);

    iText.setSelectionEnd(3);
    expect(iText.selectionEnd, 'selectionEnd should be set to 3').toBe(3);
    expect(iText.selectionStart, 'selectionStart should remain 0').toBe(0);
  });

  it('get2DCursorLocation', () => {
    const iText = new IText('test\nfoo\nbarbaz');
    let loc = iText.get2DCursorLocation();

    expect(loc.lineIndex, 'initial line index should be 0').toBe(0);
    expect(loc.charIndex, 'initial char index should be 0').toBe(0);

    // 'tes|t'
    iText.selectionStart = iText.selectionEnd = 3;
    loc = iText.get2DCursorLocation();

    expect(loc.lineIndex, 'line index for cursor position 3 should be 0').toBe(
      0,
    );
    expect(loc.charIndex, 'char index for cursor position 3 should be 3').toBe(
      3,
    );

    // test
    // fo|o
    iText.selectionStart = iText.selectionEnd = 7;
    loc = iText.get2DCursorLocation();

    expect(loc.lineIndex, 'line index for cursor position 7 should be 1').toBe(
      1,
    );
    expect(loc.charIndex, 'char index for cursor position 7 should be 2').toBe(
      2,
    );

    // test
    // foo
    // barba|z
    iText.selectionStart = iText.selectionEnd = 14;
    loc = iText.get2DCursorLocation();

    expect(loc.lineIndex, 'line index for cursor position 14 should be 2').toBe(
      2,
    );
    expect(loc.charIndex, 'char index for cursor position 14 should be 5').toBe(
      5,
    );
  });

  it('isEmptyStyles', () => {
    let iText = new IText('test');

    expect(
      iText.isEmptyStyles(),
      'styles should be empty initially',
    ).toBeTruthy();

    iText = new IText('test', {
      styles: {
        0: {
          0: {},
        },
        1: {
          0: {},
          1: {},
        },
      },
    });

    expect(
      iText.isEmptyStyles(),
      'styles with empty objects should be considered empty',
    ).toBeTruthy();

    iText = new IText('test', {
      styles: {
        0: {
          0: {},
        },
        1: {
          0: { fill: 'red' },
          1: {},
        },
      },
    });

    expect(
      iText.isEmptyStyles(),
      'styles with properties should not be considered empty',
    ).toBeFalsy();
  });

  it('selectAll', () => {
    const iText = new IText('test');

    iText.selectAll();
    expect(
      iText.selectionStart,
      'selectionStart should be 0 after selectAll',
    ).toBe(0);
    expect(iText.selectionEnd, 'selectionEnd should be 4 after selectAll').toBe(
      4,
    );

    iText.selectionStart = 1;
    iText.selectionEnd = 2;

    iText.selectAll();
    expect(
      iText.selectionStart,
      'selectionStart should be 0 after second selectAll',
    ).toBe(0);
    expect(
      iText.selectionEnd,
      'selectionEnd should be 4 after second selectAll',
    ).toBe(4);

    expect(iText.selectAll(), 'selectAll should be chainable').toBe(iText);
  });

  it('getSelectedText', () => {
    const iText = new IText('test\nfoobarbaz');

    iText.selectionStart = 1;
    iText.selectionEnd = 10;
    expect(iText.getSelectedText(), 'should return the selected text').toBe(
      'est\nfooba',
    );

    iText.selectionStart = iText.selectionEnd = 3;
    expect(
      iText.getSelectedText(),
      'should return empty string when selection is collapsed',
    ).toBe('');
  });

  it('enterEditing, exitEditing', () => {
    const iText = new IText('test');

    expect(iText.enterEditing, 'enterEditing should be a function').toBeTypeOf(
      'function',
    );
    expect(iText.exitEditing, 'exitEditing should be a function').toBeTypeOf(
      'function',
    );

    expect(
      iText.isEditing,
      'should not be in editing mode initially',
    ).toBeFalsy();

    iText.enterEditing();
    expect(
      iText.isEditing,
      'should be in editing mode after enterEditing',
    ).toBeTruthy();

    iText.exitEditing();
    expect(
      iText.isEditing,
      'should not be in editing mode after exitEditing',
    ).toBeFalsy();
    iText.abortCursorAnimation();
  });

  it('enterEditing, exitEditing and saved props', () => {
    const iText = new IText('test');

    const _savedProps = {
      hasControls: iText.hasControls,
      borderColor: iText.borderColor,
      lockMovementX: iText.lockMovementX,
      lockMovementY: iText.lockMovementY,
      hoverCursor: iText.hoverCursor,
      selectable: iText.selectable,
      defaultCursor: iText.canvas && iText.canvas.defaultCursor,
      moveCursor: iText.canvas && iText.canvas.moveCursor,
    };

    iText.enterEditing();
    // @ts-expect-error -- protected member
    expect(iText._savedProps, 'iText saves a copy of important props').toEqual(
      _savedProps,
    );
    expect(iText.selectable, 'selectable is set to false').toBe(false);
    expect(iText.hasControls, 'hasControls is set to false').toBe(false);
    expect(iText.lockMovementX, 'lockMovementX is set to true').toBe(true);
    expect(
      // @ts-expect-error -- protected member
      iText._savedProps!.lockMovementX,
      'lockMovementX is set to false originally',
    ).toBe(false);

    iText.set({ hasControls: true, lockMovementX: true });
    expect(iText.hasControls, 'hasControls is still set to false').toBe(false);
    expect(
      // @ts-expect-error -- protected member
      iText._savedProps!.lockMovementX,
      'lockMovementX should have been set to true',
    ).toBe(true);

    iText.exitEditing();
    // @ts-expect-error -- protected member
    expect(iText._savedProps, 'removed ref').toBeFalsy();
    iText.abortCursorAnimation();
    expect(iText.selectable, 'selectable is set back to true').toBe(true);
    expect(iText.hasControls, 'hasControls is set back to true').toBe(true);
    expect(
      iText.lockMovementX,
      'lockMovementX is set back to true, after changing saved props',
    ).toBe(true);

    iText.selectable = false;
    iText.enterEditing();
    iText.exitEditing();
    expect(iText.selectable, 'selectable is set back to initial value').toBe(
      false,
    );
    iText.abortCursorAnimation();
  });

  it('event firing', () => {
    const iText = new IText('test');
    let enter = 0;
    let exit = 0;
    let modify = 0;

    function countEnter() {
      enter++;
    }

    function countExit() {
      exit++;
    }

    function countModify() {
      modify++;
    }

    iText.on('editing:entered', countEnter);
    iText.on('editing:exited', countExit);
    iText.on('modified', countModify);

    expect(iText.enterEditing, 'enterEditing should be a function').toBeTypeOf(
      'function',
    );
    expect(iText.exitEditing, 'exitEditing should be a function').toBeTypeOf(
      'function',
    );

    iText.enterEditing();
    expect(enter, 'editing:entered event should have fired once').toBe(1);
    expect(exit, 'editing:exited event should not have fired').toBe(0);
    expect(modify, 'modified event should not have fired').toBe(0);

    iText.exitEditing();
    expect(enter, 'editing:entered event count should remain 1').toBe(1);
    expect(exit, 'editing:exited event should have fired once').toBe(1);
    expect(modify, 'modified event should not have fired').toBe(0);

    iText.enterEditing();
    expect(enter, 'editing:entered event should have fired again').toBe(2);
    expect(exit, 'editing:exited event count should remain 1').toBe(1);
    expect(modify, 'modified event should not have fired').toBe(0);

    iText.text = 'Test+';
    iText.exitEditing();
    expect(enter, 'editing:entered event count should remain 2').toBe(2);
    expect(exit, 'editing:exited event should have fired again').toBe(2);
    expect(modify, 'modified event should have fired once').toBe(1);
    iText.abortCursorAnimation();
  });

  it('insertNewlineStyleObject', () => {
    const iText = new IText('test\n2');

    expect(
      iText.insertNewlineStyleObject,
      'insertNewlineStyleObject should be a function',
    ).toBeTypeOf('function');

    iText.insertNewlineStyleObject(0, 4, 1);
    expect(iText.styles, 'does not insert empty styles').toEqual({});

    iText.styles = { 1: { 0: { fill: 'blue' } } };
    iText.insertNewlineStyleObject(0, 4, 1);
    expect(iText.styles, 'correctly shift styles').toEqual({
      2: { 0: { fill: 'blue' } },
    });
  });

  it('insertNewlineStyleObject with existing style', () => {
    const iText = new IText('test\n2');

    iText.styles = { 0: { 3: { fill: 'red' } }, 1: { 0: { fill: 'blue' } } };
    iText.insertNewlineStyleObject(0, 4, 3);

    expect(iText.styles[4], 'correctly shift styles 3 lines').toEqual({
      0: { fill: 'blue' },
    });
    expect(iText.styles[3], 'correctly copied previous style line 3').toEqual({
      0: { fill: 'red' },
    });
    expect(iText.styles[2], 'correctly copied previous style line 2').toEqual({
      0: { fill: 'red' },
    });
    expect(iText.styles[1], 'correctly copied previous style line 1').toEqual({
      0: { fill: 'red' },
    });
  });

  it('shiftLineStyles', () => {
    const iText = new IText('test\ntest\ntest', {
      styles: {
        1: {
          0: { fill: 'red' },
          1: { fill: 'red' },
          2: { fill: 'red' },
          3: { fill: 'red' },
        },
      },
    });

    expect(
      iText.shiftLineStyles,
      'shiftLineStyles should be a function',
    ).toBeTypeOf('function');

    iText.shiftLineStyles(0, +1);
    expect(iText.styles, 'styles should shift down one line').toEqual({
      2: {
        0: { fill: 'red' },
        1: { fill: 'red' },
        2: { fill: 'red' },
        3: { fill: 'red' },
      },
    });

    iText.shiftLineStyles(0, -1);
    expect(iText.styles, 'styles should shift back to original line').toEqual({
      1: {
        0: { fill: 'red' },
        1: { fill: 'red' },
        2: { fill: 'red' },
        3: { fill: 'red' },
      },
    });
  });

  it('selectWord', () => {
    const iText = new IText('test foo bar-baz\n\nqux');

    expect(iText.selectWord, 'selectWord should be a function').toBeTypeOf(
      'function',
    );

    iText.selectWord(1);
    expect(
      iText.selectionStart,
      'selection should start at beginning of word',
    ).toBe(0);
    expect(iText.selectionEnd, 'selection should end at end of word').toBe(4);

    iText.selectWord(7);
    expect(
      iText.selectionStart,
      'selection should start at beginning of word',
    ).toBe(5);
    expect(iText.selectionEnd, 'selection should end at end of word').toBe(8);

    iText.selectWord(17);
    expect(iText.selectionStart, 'selection should be on newline').toBe(17);
    expect(iText.selectionEnd, 'selection should be on newline').toBe(17);
  });

  it('selectLine', () => {
    const iText = new IText('test foo bar-baz\nqux');

    expect(iText.selectLine, 'selectLine should be a function').toBeTypeOf(
      'function',
    );

    iText.selectLine(6);
    expect(
      iText.selectionStart,
      'selection should start at beginning of line',
    ).toBe(0);
    expect(iText.selectionEnd, 'selection should end at end of line').toBe(16);

    iText.selectLine(18);
    expect(
      iText.selectionStart,
      'selection should start at beginning of line',
    ).toBe(17);
    expect(iText.selectionEnd, 'selection should end at end of line').toBe(20);
  });

  it('findWordBoundaryLeft', () => {
    const iText = new IText('test foo bar-baz\nqux');

    expect(
      iText.findWordBoundaryLeft,
      'findWordBoundaryLeft should be a function',
    ).toBeTypeOf('function');

    expect(
      iText.findWordBoundaryLeft(3),
      'boundary for position 3 (tes|t) should be 0',
    ).toBe(0);
    expect(
      iText.findWordBoundaryLeft(20),
      'boundary for position 20 (qux|) should be 17',
    ).toBe(17);
    expect(
      iText.findWordBoundaryLeft(6),
      'boundary for position 6 (f|oo) should be 5',
    ).toBe(5);
    expect(
      iText.findWordBoundaryLeft(11),
      'boundary for position 11 (ba|r-baz) should be 9',
    ).toBe(9);
  });

  it('findWordBoundaryRight', () => {
    const iText = new IText('test foo bar-baz\nqux');

    expect(
      iText.findWordBoundaryRight,
      'findWordBoundaryRight should be a function',
    ).toBeTypeOf('function');

    expect(
      iText.findWordBoundaryRight(3),
      'boundary for position 3 (tes|t) should be 4',
    ).toBe(4);
    expect(
      iText.findWordBoundaryRight(17),
      'boundary for position 17 (|qux) should be 20',
    ).toBe(20);
    expect(
      iText.findWordBoundaryRight(6),
      'boundary for position 6 (f|oo) should be 8',
    ).toBe(8);
    expect(
      iText.findWordBoundaryRight(11),
      'boundary for position 11 (ba|r-baz) should be 16',
    ).toBe(16);
  });

  it('findLineBoundaryLeft', () => {
    const iText = new IText('test foo bar-baz\nqux');

    expect(
      iText.findLineBoundaryLeft,
      'findLineBoundaryLeft should be a function',
    ).toBeTypeOf('function');

    expect(
      iText.findLineBoundaryLeft(3),
      'boundary for position 3 (tes|t) should be 0',
    ).toBe(0);
    expect(
      iText.findLineBoundaryLeft(20),
      'boundary for position 20 (qux|) should be 17',
    ).toBe(17);
  });

  it('findLineBoundaryRight', () => {
    const iText = new IText('test foo bar-baz\nqux');

    expect(
      iText.findLineBoundaryRight,
      'findLineBoundaryRight should be a function',
    ).toBeTypeOf('function');

    expect(
      iText.findLineBoundaryRight(3),
      'boundary for position 3 (tes|t) should be 16',
    ).toBe(16);
    expect(
      iText.findLineBoundaryRight(17),
      'boundary for position 17 (|qux) should be 20',
    ).toBe(20);
  });

  it('getSelectionStyles with no arguments', () => {
    const iText = new IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          // @ts-expect-error -- TODO: check if this is really unstandard prop?
          0: { textDecoration: 'underline' },
          // @ts-expect-error -- TODO: check if this is really unstandard prop?
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

    iText.selectionStart = 0;
    iText.selectionEnd = 0;

    expect(
      iText.getSelectionStyles(),
      'should return empty array when no selection',
    ).toEqual([]);

    iText.selectionStart = 2;
    iText.selectionEnd = 3;

    expect(
      iText.getSelectionStyles(),
      'should return styles for the selected character',
    ).toEqual([
      {
        textDecoration: 'overline',
      },
    ]);

    iText.selectionStart = 17;
    iText.selectionEnd = 18;

    expect(
      iText.getSelectionStyles(),
      'should return styles for character at position 17',
    ).toEqual([
      {
        fill: 'red',
      },
    ]);
  });

  it('getSelectionStyles with 2 args', () => {
    const iText = new IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          // @ts-expect-error -- TODO: check if this is really unstandard prop?
          0: { textDecoration: 'underline' },
          // @ts-expect-error -- TODO: check if this is really unstandard prop?
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
      iText.getSelectionStyles(0, 2),
      'should return styles for positions 0 and 1',
    ).toEqual([{ textDecoration: 'underline' }, {}]);
  });

  it('setSelectionStyles', () => {
    const iText = new IText('test foo bar-baz\nqux', {
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

    iText.setSelectionStyles({
      fill: 'red',
      stroke: 'yellow',
    });

    expect(
      iText.styles[0][0],
      'styles should not change without selection',
    ).toEqual({
      fill: '#112233',
    });

    iText.selectionEnd = 0;
    iText.selectionEnd = 1;
    iText.setSelectionStyles({
      fill: 'red',
      stroke: 'yellow',
    });

    expect(
      iText.styles[0][0],
      'styles should be applied to character at position 0',
    ).toEqual({
      fill: 'red',
      stroke: 'yellow',
    });

    iText.selectionStart = 2;
    iText.selectionEnd = 3;

    iText.setSelectionStyles({
      fill: '#998877',
      stroke: 'yellow',
    });

    expect(
      iText.styles[0][2],
      'styles should be applied to character at position 2',
    ).toEqual({
      fill: '#998877',
      stroke: 'yellow',
    });
  });

  it('getCurrentCharFontSize', () => {
    const iText = new IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fontSize: 20 },
          1: { fontSize: 60 },
        },
      },
    });

    expect(
      iText.getCurrentCharFontSize,
      'getCurrentCharFontSize should be a function',
    ).toBeTypeOf('function');

    iText.selectionStart = 0;
    expect(
      iText.getCurrentCharFontSize(),
      'should return fontSize of character at position 0',
    ).toBe(20);

    iText.selectionStart = 1;
    expect(
      iText.getCurrentCharFontSize(),
      'should return fontSize of character at position 1',
    ).toBe(20);

    iText.selectionStart = 2;
    expect(
      iText.getCurrentCharFontSize(),
      'should return fontSize of character at position 2',
    ).toBe(60);

    iText.selectionStart = 3;
    expect(
      iText.getCurrentCharFontSize(),
      'should return default fontSize when style not defined',
    ).toBe(40);
  });

  it('getCurrentCharColor', () => {
    const iText = new IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: 'red' },
          1: { fill: 'green' },
        },
      },
      fill: '#333',
    });

    expect(
      iText.getCurrentCharColor,
      'getCurrentCharColor should be a function',
    ).toBeTypeOf('function');

    iText.selectionStart = 0;
    expect(
      iText.getCurrentCharColor(),
      'should return color of character at position 0',
    ).toBe('red');

    iText.selectionStart = 1;
    expect(
      iText.getCurrentCharColor(),
      'should return color of character at position 1',
    ).toBe('red');

    iText.selectionStart = 2;
    expect(
      iText.getCurrentCharColor(),
      'should return color of character at position 2',
    ).toBe('green');

    iText.selectionStart = 3;
    expect(
      iText.getCurrentCharColor(),
      'should return default color when style not defined',
    ).toBe('#333');
  });

  it('toSVGWithFonts', () => {
    const iText = new IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: '#112233' },
          2: { stroke: '#223344', fontFamily: 'Engagement' },
          // @ts-expect-error -- TODO: check if this is really unstandard prop?
          3: { backgroundColor: '#00FF00' },
        },
      },
      fontFamily: 'Plaster',
    });

    config.addFonts({
      Engagement: 'path-to-engagement-font-file',
      Plaster: 'path-to-plaster-font-file',
    });

    canvas.add(iText);

    expect(iText.toSVG, 'toSVG should be a function').toBeTypeOf('function');

    const parser = new (getFabricWindow().DOMParser)();
    const svgString = canvas.toSVG();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    // @ts-expect-error -- data is not typed
    const style = doc.getElementsByTagName('style')[0].firstChild!.data;

    expect(style, 'SVG style should contain font definitions').toBe(
      "\n\t\t@font-face {\n\t\t\tfont-family: 'Plaster';\n\t\t\tsrc: url('path-to-plaster-font-file');\n\t\t}\n\t\t@font-face {\n\t\t\tfont-family: 'Engagement';\n\t\t\tsrc: url('path-to-engagement-font-file');\n\t\t}\n",
    );
  });

  it('toSVGWithFontsInGroups', () => {
    const iText1 = new IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: '#112233' },
          2: { stroke: '#223344', fontFamily: 'Lacquer' },
          // @ts-expect-error -- custom prop
          3: { backgroundColor: '#00FF00' },
        },
      },
      fontFamily: 'Plaster',
    });

    const iText2 = new IText('test foo bar-baz\nqux\n2', {
      styles: {
        0: {
          0: { fill: '#112233', fontFamily: 'Engagement' },
          2: { stroke: '#223344' },
          // @ts-expect-error -- custom prop
          3: { backgroundColor: '#00FF00' },
        },
      },
      fontFamily: 'Poppins',
    });

    config.addFonts({
      Engagement: 'path-to-engagement-font-file',
      Plaster: 'path-to-plaster-font-file',
      Poppins: 'path-to-poppins-font-file',
      Lacquer: 'path-to-lacquer-font-file',
    });

    const subGroup = new Group([iText1]);
    const group = new Group([subGroup, iText2]);

    canvas.add(group);

    expect(iText1.toSVG, 'toSVG should be a function').toBeTypeOf('function');
    expect(iText2.toSVG, 'toSVG should be a function').toBeTypeOf('function');

    const parser = new (getFabricWindow().DOMParser)();
    const svgString = canvas.toSVG();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    // @ts-expect-error -- data is not typed
    const style = doc.getElementsByTagName('style')[0].firstChild!.data;

    expect(style, 'SVG style should contain all font definitions').toBe(
      "\n\t\t@font-face {\n\t\t\tfont-family: 'Plaster';\n\t\t\tsrc: url('path-to-plaster-font-file');\n\t\t}\n\t\t@font-face {\n\t\t\tfont-family: 'Lacquer';\n\t\t\tsrc: url('path-to-lacquer-font-file');\n\t\t}\n\t\t@font-face {\n\t\t\tfont-family: 'Poppins';\n\t\t\tsrc: url('path-to-poppins-font-file');\n\t\t}\n\t\t@font-face {\n\t\t\tfont-family: 'Engagement';\n\t\t\tsrc: url('path-to-engagement-font-file');\n\t\t}\n",
    );
  });

  it('space wrap attribute', () => {
    const iText = new IText('test foo bar-baz\nqux');

    iText.enterEditing();
    expect(
      iText.hiddenTextarea!.wrap,
      'HiddenTextarea needs wrap off attribute',
    ).toBe('off');
    iText.abortCursorAnimation();
  });

  it('_removeExtraneousStyles', () => {
    const iText = new IText('a\nqqo', {
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

  it('dispose', () => {
    const iText = new IText('a');

    const cursorState = () =>
      // @ts-expect-error -- protected members
      [iText._currentTickState, iText._currentTickCompleteState].some(
        (cursorAnimation) => cursorAnimation && !cursorAnimation.isDone(),
      );

    iText.enterEditing();
    expect(cursorState(), 'should have been started').toBeTruthy();

    iText.dispose();
    expect(iText.isEditing, 'should have been aborted').toBe(false);
    expect(cursorState(), 'should have been aborted').toBe(false);
  });

  describe('IText and retina scaling', () => {
    beforeAll(() => {
      config.configure({ devicePixelRatio: 2 });
    });

    afterAll(() => {
      config.restoreDefaults();
    });

    [true, false].forEach((enableRetinaScaling) => {
      it(`hiddenTextarea does not move DOM, enableRetinaScaling ${enableRetinaScaling}`, () => {
        const iText = new IText('a', { fill: '#ffffff', fontSize: 50 });
        const canvas2 = new Canvas(undefined, {
          width: 800,
          height: 800,
          renderOnAddRemove: false,
          enableRetinaScaling,
        });

        canvas2.setDimensions({ width: 100, height: 100 }, { cssOnly: true });
        canvas2.cancelRequestedRender();

        iText.setPositionByOrigin(new Point(400, 400), 'left', 'top');

        canvas2.add(iText);

        Object.defineProperty(canvas2.upperCanvasEl, 'clientWidth', {
          get: function () {
            return this._clientWidth;
          },
          set: function (value) {
            return (this._clientWidth = value);
          },
        });

        Object.defineProperty(canvas2.upperCanvasEl, 'clientHeight', {
          get: function () {
            return this._clientHeight;
          },
          set: function (value) {
            return (this._clientHeight = value);
          },
        });

        // @ts-expect-error -- not recognized by typescript
        canvas2.upperCanvasEl._clientWidth = 100;
        // @ts-expect-error -- not recognized by typescript
        canvas2.upperCanvasEl._clientHeight = 100;

        iText.enterEditing();
        canvas2.cancelRequestedRender();

        expect(
          Math.round(parseInt(iText.hiddenTextarea!.style.top)),
          'top is scaled with CSS',
        ).toBe(57);
        expect(
          Math.round(parseInt(iText.hiddenTextarea!.style.left)),
          'left is scaled with CSS',
        ).toBe(50);

        iText.exitEditing();
        canvas2.cancelRequestedRender();

        // @ts-expect-error -- not recognized by typescript
        canvas2.upperCanvasEl._clientWidth = 200;
        // @ts-expect-error -- not recognized by typescript
        canvas2.upperCanvasEl._clientHeight = 200;

        iText.enterEditing();
        canvas2.cancelRequestedRender();

        expect(
          Math.round(parseInt(iText.hiddenTextarea!.style.top)),
          'top is scaled with CSS',
        ).toBe(114);
        expect(
          Math.round(parseInt(iText.hiddenTextarea!.style.left)),
          'left is scaled with CSS',
        ).toBe(100);

        iText.exitEditing();
        canvas2.cancelRequestedRender();
      });
    });
  });
});
