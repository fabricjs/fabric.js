import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from 'vitest';
import { Canvas } from '../../canvas/Canvas';
import { IText } from './IText';
import { Group } from '../Group';
import { config } from '../../config';
import type {
  ObjectPointerEvents,
  TPointerEvent,
  TPointerEventInfo,
} from '../../EventTypeDefs';
import { Point } from '../../Point';

describe('iText click interaction', () => {
  let canvas: Canvas;

  beforeAll(() => {
    canvas = new Canvas(undefined, {
      enableRetinaScaling: false,
    });
  });

  afterAll(() => canvas.dispose());

  afterEach(() => {
    canvas.clear();
    canvas.cancelRequestedRender();
  });

  test('doubleClickHandler', async () => {
    const iText = new IText('test need some word\nsecond line');
    iText.setPositionByOrigin(new Point(0, 0), 'left', 'top');

    iText.canvas = canvas;

    let eventData = {
      which: 1,
      target: canvas.upperCanvasEl,
      clientX: 40,
      clientY: 10,
    } as unknown as TPointerEvent;

    iText.enterEditing();

    iText.doubleClickHandler({
      e: eventData,
    } as unknown as TPointerEventInfo);

    expect(iText.selectionStart, 'dblClick selection start is').toBe(0);
    expect(iText.selectionEnd, 'dblClick selection end is').toBe(4);

    eventData = {
      which: 1,
      target: canvas.upperCanvasEl,
      clientX: 40,
      clientY: 60,
    } as unknown as TPointerEvent;

    iText.doubleClickHandler({
      e: eventData,
    } as unknown as TPointerEventInfo);

    expect(iText.selectionStart, 'second dblClick selection start is').toBe(20);
    expect(iText.selectionEnd, 'second dblClick selection end is').toBe(26);
  });

  test('doubleClickHandler no editing', () => {
    const iText = new IText('test need some word\nsecond line');

    iText.canvas = canvas;

    const eventData = {
      which: 1,
      target: canvas.upperCanvasEl,
      clientX: 40,
      clientY: 10,
    } as unknown as TPointerEvent;

    iText.doubleClickHandler({
      e: eventData,
    } as unknown as TPointerEventInfo);

    expect(iText.selectionStart, 'dblClick selection start is').toBe(0);
    expect(iText.selectionEnd, 'dblClick selection end is').toBe(0);
  });

  test('tripleClickHandler', async () => {
    const iText = new IText('test need some word\nsecond line');
    iText.setPositionByOrigin(new Point(0, 0), 'left', 'top');

    iText.canvas = canvas;

    let eventData = {
      which: 1,
      target: canvas.upperCanvasEl,
      clientX: 40,
      clientY: 10,
    } as unknown as TPointerEvent;

    iText.enterEditing();

    iText.tripleClickHandler({
      e: eventData,
    } as unknown as TPointerEventInfo);

    expect(iText.selectionStart, 'tripleClick selection start is').toBe(0);
    expect(iText.selectionEnd, 'tripleClick selection end is').toBe(19);

    eventData = {
      which: 1,
      target: canvas.upperCanvasEl,
      clientX: 40,
      clientY: 60,
    } as unknown as TPointerEvent;

    iText.tripleClickHandler({
      e: eventData,
    } as unknown as TPointerEventInfo);

    expect(iText.selectionStart, 'second tripleClick selection start is').toBe(
      20,
    );
    expect(iText.selectionEnd, 'second tripleClick selection end is').toBe(31);

    iText.exitEditing();
  });

  test('tripleClickHandler without editing', () => {
    const iText = new IText('test need some word\nsecond line');

    iText.canvas = canvas;

    const eventData = {
      which: 1,
      target: canvas.upperCanvasEl,
      clientX: 40,
      clientY: 10,
    } as unknown as TPointerEvent;

    iText.tripleClickHandler({
      e: eventData,
    } as unknown as TPointerEventInfo);

    expect(iText.selectionStart, 'tripleClick selection start is').toBe(0);
    expect(iText.selectionEnd, 'tripleClick selection end is').toBe(0);
  });

  test('getSelectionStartFromPointer with scale', () => {
    const eventData = {
      which: 1,
      target: canvas.upperCanvasEl,
      clientX: 70,
      clientY: 10,
    } as unknown as TPointerEvent;

    const iText = new IText('test need some word\nsecond line', {
      scaleX: 3,
      scaleY: 2,
      canvas,
    });
    iText.setPositionByOrigin(new Point(0, 0), 'left', 'top');
    expect(iText.getSelectionStartFromPointer(eventData), 'index').toBe(2);
    expect(
      iText.getSelectionStartFromPointer({ ...eventData, clientY: 20 }),
      'index',
    ).toBe(2);

    iText.set({ scaleX: 0.5, scaleY: 0.25 });
    iText.setPositionByOrigin(new Point(0, 0), 'left', 'top');

    expect(iText.getSelectionStartFromPointer(eventData), 'index').toBe(9);
    expect(
      iText.getSelectionStartFromPointer({ ...eventData, clientY: 20 }),
      'index',
    ).toBe(29);

    iText.set({ scaleX: 1, scaleY: 1 });
    iText.setPositionByOrigin(new Point(0, 0), 'left', 'top');

    expect(iText.getSelectionStartFromPointer(eventData), 'index').toBe(5);
    expect(
      iText.getSelectionStartFromPointer({
        ...eventData,
        clientY: 20,
      } as unknown as TPointerEvent),
      'index',
    ).toBe(5);
  });

  test('mouse down aborts cursor animation', () => {
    const iText = new IText('test need some word\nsecond line', {
      canvas,
    });

    expect(iText._animateCursor, 'method is defined').toBeTypeOf('function');

    let animate = 0;
    let aborted = 0;

    // @ts-expect-error -- overridden for test simplicity
    iText._animateCursor = () => animate++;
    iText.abortCursorAnimation = () => aborted++;

    canvas.setActiveObject(iText);
    iText.enterEditing();
    iText._mouseDownHandler({
      e: { target: canvas.upperCanvasEl },
    } as unknown as ObjectPointerEvents['mousedown']);

    expect(animate, 'called from enterEditing').toBe(1);
    expect(aborted, 'called from render').toBe(1);
  });

  test('_mouseUpHandler on a selected object enter edit', () => {
    const iText = new IText('test');

    iText.initDelayedCursor = function () {};
    iText.renderCursorOrSelection = function () {};

    expect(iText.isEditing, 'iText not editing').toBe(false);

    iText.canvas = canvas;
    canvas._activeObject = undefined;
    // @ts-expect-error -- protected member
    iText.selected = true;

    iText.mouseUpHandler({
      e: {},
    } as unknown as ObjectPointerEvents['mouseup']);

    expect(iText.isEditing, 'iText entered editing').toBe(true);

    iText.exitEditing();
  });

  test('_mouseUpHandler on a selected object does enter edit if there is an activeObject', () => {
    const iText = new IText('test');

    iText.initDelayedCursor = function () {};
    iText.renderCursorOrSelection = function () {};

    expect(iText.isEditing, 'iText not editing').toBe(false);

    iText.canvas = canvas;
    canvas._activeObject = new IText('test2');
    // @ts-expect-error -- protected member
    iText.selected = true;

    iText.mouseUpHandler({
      e: {},
    } as unknown as ObjectPointerEvents['mouseup']);

    expect(iText.isEditing, 'iText should not enter editing').toBe(false);

    iText.exitEditing();
  });

  test('_mouseUpHandler on a selected text in a group does NOT enter editing', () => {
    const iText = new IText('test');

    iText.initDelayedCursor = function () {};
    iText.renderCursorOrSelection = function () {};

    expect(iText.isEditing, 'iText not editing').toBe(false);

    const group = new Group([iText], { subTargetCheck: false });

    canvas.add(group);
    // @ts-expect-error -- protected member
    iText.selected = true;
    const evt = {
      clientX: 1,
      clientY: 1,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent;
    canvas._cacheTransformEventData(evt);
    canvas.__onMouseUp(evt);
    // @ts-expect-error -- protected member
    expect(canvas._targetInfo.target, 'group should be found as target').toBe(
      group,
    );
    expect(iText.isEditing, 'iText should not enter editing').toBe(false);

    iText.exitEditing();
    canvas._resetTransformEventData();
  });

  test('_mouseUpHandler on a text in a group', () => {
    const iText = new IText('test');

    iText.initDelayedCursor = function () {};
    iText.renderCursorOrSelection = function () {};

    expect(iText.isEditing, 'iText not editing').toBe(false);

    const group = new Group([iText], {
      subTargetCheck: true,
      interactive: true,
    });

    canvas.add(group);
    // @ts-expect-error -- protected member
    iText.selected = true;

    canvas._onMouseUp({
      clientX: 1,
      clientY: 1,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent);

    expect(iText.isEditing, 'iText should enter editing').toBe(true);

    iText.exitEditing();
    group.interactive = false;
    // @ts-expect-error -- protected member
    iText.selected = true;

    canvas._onMouseUp({
      clientX: 1,
      clientY: 1,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent);

    expect(iText.isEditing, 'iText should not enter editing').toBe(false);
  });

  test('_mouseUpHandler on a corner of selected text DOES NOT enter edit', () => {
    const iText = new IText('test');

    iText.initDelayedCursor = function () {};
    iText.renderCursorOrSelection = function () {};

    expect(iText.isEditing, 'iText not editing').toBe(false);

    iText.canvas = canvas;
    // @ts-expect-error -- protected member
    iText.selected = true;
    iText.__corner = 'mt';
    iText.setCoords();

    iText.mouseUpHandler({
      e: {},
    } as unknown as ObjectPointerEvents['mouseup']);

    expect(iText.isEditing, 'iText should not enter editing').toBe(false);

    iText.exitEditing();
    canvas.renderAll();
  });

  [true, false].forEach((enableRetinaScaling) => {
    describe(`enableRetinaScaling = ${enableRetinaScaling}`, () => {
      let testCanvas: Canvas;
      let eventData: TPointerEvent;
      let iText: IText;
      let count: number;
      let countCanvas: number;

      beforeAll(() => {
        config.configure({ devicePixelRatio: 2 });
      });

      afterAll(() => {
        config.restoreDefaults();
      });

      beforeEach(() => {
        testCanvas = new Canvas(undefined, {
          enableRetinaScaling,
        });

        eventData = {
          which: 1,
          target: testCanvas.upperCanvasEl,
          ...(enableRetinaScaling
            ? {
                clientX: 60,
                clientY: 30,
              }
            : {
                clientX: 30,
                clientY: 15,
              }),
        } as unknown as TPointerEvent;

        count = 0;
        countCanvas = 0;

        iText = new IText('test test');
        iText.setPositionByOrigin(new Point(0, 0), 'left', 'top');
        testCanvas.add(iText);

        testCanvas.on('text:selection:changed', () => {
          countCanvas++;
        });

        iText.on('selection:changed', () => {
          count++;
        });
      });

      afterEach(() => testCanvas.dispose());

      test(`click on editing itext make selection:changed fire`, async () => {
        expect(
          testCanvas.getActiveObject(),
          'no active object exist',
        ).toBeUndefined();
        expect(count, 'no selection:changed fired yet').toBe(0);
        expect(countCanvas, 'no text:selection:changed fired yet').toBe(0);

        testCanvas._onMouseDown(eventData);
        testCanvas._onMouseUp(eventData);

        expect(testCanvas.getActiveObject(), 'Itext got selected').toBe(iText);
        expect(iText.isEditing, 'Itext is not editing yet').toBe(false);
        expect(count, 'no selection:changed fired yet').toBe(0);
        expect(countCanvas, 'no text:selection:changed fired yet').toBe(0);
        expect(
          iText.selectionStart,
          'Itext did not set the selectionStart',
        ).toBe(0);
        expect(iText.selectionEnd, 'Itext did not set the selectionend').toBe(
          0,
        );

        // make a little delay or it will act as double click and select everything
        await new Promise((resolve) => setTimeout(resolve, 500));

        testCanvas._onMouseDown(eventData);
        testCanvas._onMouseUp(eventData);

        expect(iText.isEditing, 'Itext entered editing').toBe(true);
        expect(iText.selectionStart, 'Itext set the selectionStart').toBe(2);
        expect(iText.selectionEnd, 'Itext set the selectionend').toBe(2);
        expect(count, 'no selection:changed fired yet').toBe(1);
        expect(countCanvas, 'no text:selection:changed fired yet').toBe(1);
      });
    });
  });
});
