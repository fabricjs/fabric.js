import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Canvas } from './Canvas';
import { Rect } from '../shapes/Rect';
import { Circle } from '../shapes/Circle';
import { Group } from '../shapes/Group';
import { ActiveSelection } from '../shapes/ActiveSelection';
import { Point } from '../Point';
import { PencilBrush } from '../brushes/PencilBrush';
import type { CanvasEvents, ObjectEvents, TPointerEvent } from '../../fabric';
import { getFabricDocument, IText, version } from '../../fabric';

describe('Canvas events mixin', () => {
  const SUB_TARGETS_JSON = `{"version":"${version}","objects":[{"type":"ActiveSelection","left":-152,"top":656.25,"width":356.5,"height":356.5,"scaleX":0.45,"scaleY":0.45,"objects":[]},{"type":"Group","left":11,"top":6,"width":511.5,"height":511.5,"objects":[{"type":"Rect","left":-255.75,"top":-255.75,"width":50,"height":50,"fill":"#6ce798","scaleX":10.03,"scaleY":10.03,"opacity":0.8},{"type":"Group","left":-179.75,"top":22,"width":356.5,"height":356.5,"scaleX":0.54,"scaleY":0.54,"objects":[{"type":"Rect","left":-178.25,"top":-178.25,"width":50,"height":50,"fill":"#4862cc","scaleX":6.99,"scaleY":6.99,"opacity":0.8},{"type":"Group","left":-163.25,"top":-161.25,"width":177.5,"height":177.5,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]},{"type":"Group","left":-34.25,"top":-31.25,"width":177.5,"height":177.5,"scaleX":1.08,"scaleY":1.08,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]}]},{"type":"Group","left":-202.75,"top":-228.5,"width":356.5,"height":356.5,"scaleX":0.61,"scaleY":0.61,"objects":[{"type":"Rect","left":-178.25,"top":-178.25,"width":50,"height":50,"fill":"#4862cc","scaleX":6.99,"scaleY":6.99,"opacity":0.8},{"type":"Group","left":-163.25,"top":-161.25,"width":177.5,"height":177.5,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]},{"type":"Group","left":-34.25,"top":-31.25,"width":177.5,"height":177.5,"scaleX":1.08,"scaleY":1.08,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]}]},{"type":"Group","left":138.3,"top":-90.22,"width":356.5,"height":356.5,"scaleX":0.42,"scaleY":0.42,"angle":62.73,"objects":[{"type":"Rect","left":-178.25,"top":-178.25,"width":50,"height":50,"fill":"#4862cc","scaleX":6.99,"scaleY":6.99,"opacity":0.8},{"type":"Group","left":-163.25,"top":-161.25,"width":177.5,"height":177.5,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]},{"type":"Group","left":-34.25,"top":-31.25,"width":177.5,"height":177.5,"scaleX":1.08,"scaleY":1.08,"objects":[{"type":"Rect","left":-88.75,"top":-88.75,"width":50,"height":50,"fill":"#5fe909","scaleX":3.48,"scaleY":3.48,"opacity":0.8},{"type":"Rect","left":-59.75,"top":-68.75,"width":50,"height":50,"fill":"#f3529c","opacity":0.8},{"type":"Triangle","left":36.03,"top":-38.12,"width":50,"height":50,"fill":"#c1124e","angle":39.07,"opacity":0.8},{"type":"Rect","left":-65.75,"top":17.25,"width":50,"height":50,"fill":"#9c5120","opacity":0.8}]}]}]}]}`;

  let canvas: Canvas;
  let upperCanvasEl: HTMLCanvasElement;

  beforeEach(() => {
    canvas = new Canvas(undefined, {
      enableRetinaScaling: false,
      width: 600,
      height: 600,
    });
    upperCanvasEl = canvas.upperCanvasEl;

    canvas.cancelRequestedRender();
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    upperCanvasEl.style.display = '';
    canvas.controlsAboveOverlay = Canvas.getDefaults().controlsAboveOverlay;
    canvas.preserveObjectStacking = Canvas.getDefaults().preserveObjectStacking;
  });

  afterEach(() => {
    canvas.clear();
    canvas.backgroundColor = Canvas.getDefaults().backgroundColor;
    canvas.overlayColor = Canvas.getDefaults().overlayColor;
    // @ts-expect-error -- private method
    canvas.handleSelection = Canvas.prototype.handleSelection;
    canvas.off();
    canvas.setDimensions({ width: 600, height: 600 });
    canvas.calcOffset();
    upperCanvasEl.style.display = 'none';
    canvas.cancelRequestedRender();
  });

  it('handles mouse:down with different buttons', () => {
    let clickCount = 0;

    function mouseHandler() {
      clickCount++;
    }

    canvas.on('mouse:down', mouseHandler);
    canvas.fireMiddleClick = false;
    canvas.fireRightClick = false;
    // @ts-expect-error private property
    canvas._currentTransform = false;
    canvas.isDrawingMode = false;

    // @ts-expect-error private method
    canvas.__onMouseDown({ button: 0, target: canvas.upperCanvasEl });
    expect(clickCount, 'mouse down fired').toBe(1);

    clickCount = 0;
    // @ts-expect-error private method
    canvas.__onMouseDown({ button: 2, target: canvas.upperCanvasEl });
    expect(clickCount, 'rightclick did not fire a mouse:down event').toBe(0);

    canvas.fireRightClick = true;
    // @ts-expect-error private method
    canvas.__onMouseDown({ button: 2, target: canvas.upperCanvasEl });
    expect(clickCount, 'rightclick did fire a mouse:down event').toBe(1);

    clickCount = 0;
    // @ts-expect-error private method
    canvas.__onMouseDown({ button: 1, target: canvas.upperCanvasEl });
    expect(clickCount, 'middleClick did not fire a mouse:down event').toBe(0);

    canvas.fireMiddleClick = true;
    // @ts-expect-error private method
    canvas.__onMouseDown({ button: 1, target: canvas.upperCanvasEl });
    expect(clickCount, 'middleClick did fire a mouse:down event').toBe(1);
  });

  it('handles mouse:down:before with different buttons', () => {
    let clickCount = 0;

    function mouseHandler() {
      clickCount++;
    }

    canvas.on('mouse:down:before', mouseHandler);
    canvas.fireMiddleClick = false;
    canvas.fireRightClick = false;
    // @ts-expect-error private property
    canvas._currentTransform = false;
    canvas.isDrawingMode = false;

    // @ts-expect-error private method
    canvas.__onMouseDown({ which: 1, target: canvas.upperCanvasEl });
    expect(clickCount, 'mouse:down:before fired').toBe(1);

    clickCount = 0;
    // @ts-expect-error private method
    canvas.__onMouseDown({ which: 3, target: canvas.upperCanvasEl });
    expect(clickCount, 'rightclick fired a mouse:down:before event').toBe(1);

    canvas.fireRightClick = true;
    // @ts-expect-error private method
    canvas.__onMouseDown({ which: 3, target: canvas.upperCanvasEl });
    expect(clickCount, 'rightclick did fire a mouse:down:before event').toBe(2);

    clickCount = 0;
    // @ts-expect-error private method
    canvas.__onMouseDown({ which: 2, target: canvas.upperCanvasEl });
    expect(
      clickCount,
      'middleClick did not fire a mouse:down:before event',
    ).toBe(1);

    canvas.fireMiddleClick = true;
    // @ts-expect-error private method
    canvas.__onMouseDown({ which: 2, target: canvas.upperCanvasEl });
    expect(clickCount, 'middleClick did fire a mouse:down:before event').toBe(
      2,
    );
  });

  it('handles mouse:down and group selector', () => {
    const e = {
      clientX: 30,
      clientY: 40,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({ width: 150, height: 150 });
    const expectedGroupSelector = { x: 80, y: 120, deltaX: 0, deltaY: 0 };

    canvas.absolutePan(new Point(50, 80));
    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private property
    expect(canvas._groupSelector, 'a new groupSelector is created').toEqual(
      expectedGroupSelector,
    );

    canvas.add(rect);
    // @ts-expect-error private method
    canvas.__onMouseUp(e);
    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    expect(
      // @ts-expect-error private property
      canvas._groupSelector,
      'with object on target no groupSelector is started',
    ).toBeNull();

    rect.selectable = false;
    // @ts-expect-error private method
    canvas.__onMouseUp(e);
    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    expect(
      // @ts-expect-error private property
      canvas._groupSelector,
      'with object non selectable but already selected groupSelector is not started',
    ).toBeNull();

    // @ts-expect-error private method
    canvas.__onMouseUp(e);
    canvas.discardActiveObject();
    // @ts-expect-error -- custom prop
    rect.isEditing = true;
    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    expect(
      // @ts-expect-error private property
      canvas._groupSelector,
      'with object editing, groupSelector is not started',
    ).toBeNull();

    // @ts-expect-error private method
    canvas.__onMouseUp(e);
    canvas.discardActiveObject();
    // @ts-expect-error -- custom prop
    rect.isEditing = false;
    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private property
    expect(canvas._groupSelector, 'a new groupSelector is created').toEqual(
      expectedGroupSelector,
    );

    // @ts-expect-error private method
    canvas.__onMouseUp(e);
  });

  it('handles activeOn object selection', () => {
    const rect = new Rect({ width: 200, height: 200, activeOn: 'down' });
    canvas.add(rect);
    const e = {
      clientX: 30,
      clientY: 15,
      which: 1,
      target: canvas.upperCanvasEl,
    };

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    expect(
      canvas._activeObject,
      'with activeOn of down object is selected on mouse down',
    ).toBe(rect);

    // @ts-expect-error private method
    canvas.__onMouseUp(e);
    canvas.discardActiveObject();
    rect.activeOn = 'up';

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    expect(
      canvas._activeObject,
      'with activeOn of up object is not selected on mouse down',
    ).toBeUndefined();

    // @ts-expect-error private method
    canvas.__onMouseUp(e);
    expect(
      canvas._activeObject,
      'with activeOn of up object is selected on mouse up',
    ).toBe(rect);
  });

  it('handles specific bug #5317 for multiselection', () => {
    const greenRect = new Rect({
      width: 300,
      height: 300,
      left: 0,
      top: 0,
      fill: 'green',
      selectable: false,
    });
    canvas.add(greenRect);

    // add red, half-transparent circle
    const redCircle = new Circle({
      radius: 40,
      left: 200,
      top: 100,
      fill: 'red',
      opacity: 0.5,
    });
    canvas.add(redCircle);

    // add blue, half-transparent circle
    const blueCircle = new Circle({
      radius: 40,
      left: 0,
      top: 0,
      fill: 'blue',
      opacity: 0.5,
    });
    canvas.add(blueCircle);

    const e = {
      clientX: 40,
      clientY: 40,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    expect(
      canvas._activeObject,
      'blue circle is selected with first click',
    ).toBe(blueCircle);

    // @ts-expect-error private method
    canvas.__onMouseUp(e);
    const e2 = {
      clientX: 240,
      clientY: 140,
      which: 1,
      target: canvas.upperCanvasEl,
      shiftKey: true,
    };
    // @ts-expect-error private method
    canvas.__onMouseDown(e2);

    const selection = canvas.getActiveObjects();
    expect(selection[1], 'blue circle is still selected').toBe(blueCircle);
    expect(selection[0], 'red circle is selected with shift click').toBe(
      redCircle,
    );

    // @ts-expect-error private method
    canvas.__onMouseUp(e2);
    const e3 = {
      clientX: 140,
      clientY: 90,
      which: 1,
      target: canvas.upperCanvasEl,
      shiftKey: true,
    };

    canvas.on('mouse:down', function (options) {
      // TODO: fix this, for some reason first target on mouse down is active selection and then second target is the green rectangle
      if (options.target instanceof ActiveSelection) {
        return;
      }
      expect(options.target, 'green rectangle was the target').toBe(greenRect);
    });

    // @ts-expect-error private method
    canvas.__onMouseDown(e3);
    const nextSelection = canvas.getActiveObjects();
    expect(nextSelection[1], 'blue circle is still selected 2').toBe(
      blueCircle,
    );
    expect(nextSelection[0], 'red circle is still selected 2').toBe(redCircle);
    expect(nextSelection.length, 'no other object have been selected').toBe(2);

    // @ts-expect-error private method
    canvas.__onMouseUp(e3);
    const e4 = {
      clientX: 290,
      clientY: 290,
      which: 1,
      target: canvas.upperCanvasEl,
    };

    canvas.on('mouse:down', function (options) {
      expect(options.target, 'green rectangle was the target 2').toBe(
        greenRect,
      );
    });

    // @ts-expect-error private method
    canvas.__onMouseDown(e4);
    const finalSelection = canvas.getActiveObjects();
    expect(
      finalSelection.length,
      'no other object have been selected because green rect is unselectable',
    ).toBe(0);

    // @ts-expect-error private method
    canvas.__onMouseUp(e4);
  });

  it('handles specific bug #6314 for partial intersection with drag', () => {
    const testCanvas = new Canvas(undefined, {
      enableRetinaScaling: false,
      width: 600,
      height: 600,
    });
    let renderRequested = false;

    const greenRect = new Rect({
      width: 300,
      height: 300,
      left: 50,
      top: 0,
      fill: 'green',
    });

    testCanvas.add(greenRect);
    // @ts-expect-error private method
    testCanvas._onMouseDown({
      clientX: 25,
      clientY: 25,
      which: 1,
      target: testCanvas.upperCanvasEl,
    });
    // @ts-expect-error private method
    testCanvas._onMouseMove({
      clientX: 30,
      clientY: 30,
      which: 1,
      target: testCanvas.upperCanvasEl,
    });
    // @ts-expect-error private method
    testCanvas._onMouseMove({
      clientX: 100,
      clientY: 50,
      which: 1,
      target: testCanvas.upperCanvasEl,
    });

    testCanvas.requestRenderAll = function () {
      renderRequested = true;
    };

    // @ts-expect-error private method
    testCanvas._onMouseUp({
      clientX: 100,
      clientY: 50,
      which: 1,
      target: testCanvas.upperCanvasEl,
    });
    expect(renderRequested, 'a render has been requested').toBe(true);
  });

  it('reports isClick = true for mouse:up without movement', () => {
    const e = {
      clientX: 30,
      clientY: 30,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    let isClick = false;

    canvas.on('mouse:up', function (opt) {
      isClick = opt.isClick;
    });

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseUp(e);

    expect(isClick, 'without moving the pointer, the click is true').toBe(true);
  });

  it('reports isClick = false for mouse:up after movement', () => {
    const e = {
      clientX: 30,
      clientY: 30,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 31,
      clientY: 31,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    let isClick = true;

    canvas.on('mouse:up', function (opt) {
      isClick = opt.isClick;
    });

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(isClick, 'moving the pointer, the click is false').toBe(false);
  });

  it('reports isClick = false for mouse:up after dragging', () => {
    const e = {
      clientX: 30,
      clientY: 30,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 31,
      clientY: 31,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    let isClick = true;

    canvas.on('mouse:up', function (opt) {
      isClick = opt.isClick;
    });

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas._onDragStart({
      preventDefault() {},
      stopPropagation() {},
    });

    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(isClick, 'moving the pointer, the click is false').toBe(false);
  });

  it('handles setDimensions and active brush', () => {
    let prepareFor = false;
    let rendered = false;
    const testCanvas = new Canvas(undefined, { width: 500, height: 500 });
    // @ts-expect-error -- TODO: check this because seems like color is not in Canvas types
    const brush = new PencilBrush({ color: 'red', width: 4 });

    testCanvas.isDrawingMode = true;
    testCanvas.freeDrawingBrush = brush;
    // @ts-expect-error private property
    testCanvas._isCurrentlyDrawing = true;

    brush._render = function () {
      rendered = true;
    };
    brush._setBrushStyles = function () {
      prepareFor = true;
    };

    testCanvas.setDimensions({ width: 200, height: 200 });
    testCanvas.renderAll();

    expect(rendered, 'the brush called the _render method').toBe(true);
    expect(prepareFor, 'the brush called the _setBrushStyles method').toBe(
      true,
    );
  });

  it('returns target and currentTarget in mouse:up event', () => {
    const e1 = {
      clientX: 30,
      clientY: 30,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 100,
      clientY: 100,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect1 = new Rect({
      left: 0,
      top: 0,
      width: 50,
      height: 50,
      lockMovementX: true,
      lockMovementY: true,
    });
    const rect2 = new Rect({ left: 75, top: 75, width: 50, height: 50 });

    canvas.add(rect1);
    canvas.add(rect2);

    let opt;
    canvas.on('mouse:up', function (_opt) {
      opt = _opt;
    });

    // @ts-expect-error private method
    canvas.__onMouseDown(e1);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(opt!.target, 'options match model - target').toBe(rect1);
    expect(opt!.currentTarget, 'options match model - currentTarget').toBe(
      rect2,
    );
  });

  it('fires object:modified event', () => {
    const e = {
      clientX: 30,
      clientY: 30,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 31,
      clientY: 31,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({ left: 0, top: 0, width: 50, height: 50 });

    canvas.add(rect);

    let count = 0;
    let opt;
    canvas.on('object:modified', function (_opt) {
      count++;
      opt = _opt;
    });

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(count, 'object:modified fired').toBe(1);
    expect(opt!.e, 'options match model - event').toBe(e2);
    expect(opt!.target, 'options match model - target').toBe(rect);
    expect(opt!.transform.action, 'options match model - target').toBe('drag');
  });

  it('drags small object when mousemove + drag, not active', () => {
    const e = {
      clientX: 2,
      clientY: 2,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e1 = {
      clientX: 4,
      clientY: 4,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 6,
      clientY: 6,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({
      left: 0,
      top: 0,
      width: 3,
      height: 3,
      strokeWidth: 0,
    });

    canvas.add(rect);
    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e1);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(rect.top, 'rect moved by 4 pixels top').toBe(4);
    expect(rect.left, 'rect moved by 4 pixels left').toBe(4);
    expect(rect.scaleX, 'rect did not scale Y').toBe(1);
    expect(rect.scaleY, 'rect did not scale X').toBe(1);
  });

  it('scales small object when mousemove + drag, active', () => {
    const e = {
      clientX: 3,
      clientY: 3,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e1 = {
      clientX: 6,
      clientY: 6,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 9,
      clientY: 9,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({
      left: 0,
      top: 0,
      width: 3,
      height: 3,
      strokeWidth: 0,
    });

    expect(rect.scaleX, 'rect not scaled X').toBe(1);
    expect(rect.scaleY, 'rect not scaled Y').toBe(1);

    canvas.add(rect);
    canvas.setActiveObject(rect);

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e1);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(rect.scaleX, 'rect scaled X').toBe(3);
    expect(rect.scaleY, 'rect scaled Y').toBe(3);
  });

  it('scales a nested target', () => {
    const e = {
      clientX: 3,
      clientY: 3,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e1 = {
      clientX: 6,
      clientY: 6,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 9,
      clientY: 9,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({
      left: 0,
      top: 0,
      width: 3,
      height: 3,
      strokeWidth: 0,
      scaleX: 0.5,
    });
    let mouseUpCalled = false;
    let mouseDownCalled = false;

    rect.controls = {
      br: rect.controls.br,
    };
    rect.controls.br.mouseUpHandler = function () {
      mouseUpCalled = true;
    };
    rect.controls.br.mouseDownHandler = function () {
      mouseDownCalled = true;
    };

    const group = new Group(
      [rect, new Rect({ left: 100, top: 100, width: 3, height: 3 })],
      {
        interactive: true,
        subTargetCheck: true,
        scaleX: 2,
      },
    );
    canvas.add(group);
    canvas.setActiveObject(rect);

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e1);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(mouseUpCalled, 'mouse up handler for control has been called').toBe(
      true,
    );
    expect(
      mouseDownCalled,
      'mouse down handler for control has been called',
    ).toBe(true);
    expect(rect.calcTransformMatrix()).toEqual([3, 0, 0, 3, 4.5, 4.5]);
    expect(rect.getXY()).toEqual(new Point());
  });

  it('drags a nested target', () => {
    const e = {
      clientX: 1,
      clientY: 1,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e1 = {
      clientX: 6,
      clientY: 6,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 9,
      clientY: 9,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({
      left: 0,
      top: 0,
      width: 3,
      height: 3,
      strokeWidth: 0,
      scaleX: 0.5,
    });
    rect.controls = {};

    const group = new Group(
      [rect, new Rect({ left: 100, top: 100, width: 3, height: 3 })],
      {
        interactive: true,
        subTargetCheck: true,
        scaleX: 2,
      },
    );
    canvas.add(group);
    canvas.setActiveObject(rect);

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e1);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(rect.calcTransformMatrix()).toEqual([1, 0, 0, 1, 9.5, 9.5]);
    expect(rect.getXY()).toEqual(new Point(8, 8));
  });

  it('calls mouseup and mousedown on the control during transform', () => {
    const e = {
      clientX: 3,
      clientY: 3,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e1 = {
      clientX: 6,
      clientY: 6,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 9,
      clientY: 9,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({
      left: 0,
      top: 0,
      width: 3,
      height: 3,
      strokeWidth: 0,
    });
    let mouseUpCalled = false;
    let mouseDownCalled = false;

    rect.controls = {
      br: rect.controls.br,
    };
    rect.controls.br.mouseUpHandler = function () {
      mouseUpCalled = true;
    };
    rect.controls.br.mouseDownHandler = function () {
      mouseDownCalled = true;
    };

    canvas.add(rect);
    canvas.setActiveObject(rect);

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e1);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e2);

    expect(mouseUpCalled, 'mouse up handler for control has been called').toBe(
      true,
    );
    expect(
      mouseDownCalled,
      'mouse down handler for control has been called',
    ).toBe(true);
  });

  it('calls mouseup handler even when transform ends outside the object', () => {
    const e = {
      clientX: 3,
      clientY: 3,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e1 = {
      clientX: 6,
      clientY: 6,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 9,
      clientY: 9,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e3 = {
      clientX: 100,
      clientY: 100,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({
      left: 0,
      top: 0,
      width: 3,
      height: 3,
      strokeWidth: 0,
    });
    let mouseUpCalled = false;

    rect.controls = {
      br: rect.controls.br,
    };
    rect.controls.br.mouseUpHandler = function () {
      mouseUpCalled = true;
    };

    canvas.add(rect);
    canvas.setActiveObject(rect);

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e1);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e3);

    expect(
      mouseUpCalled,
      'mouse up handler for control has been called anyway',
    ).toBe(true);
  });

  it('calls both mouseup handlers when transform ends on a new control', () => {
    const e = {
      clientX: 3,
      clientY: 3,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e1 = {
      clientX: 6,
      clientY: 6,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e2 = {
      clientX: 9,
      clientY: 9,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const e3 = {
      clientX: 9,
      clientY: 3,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const rect = new Rect({
      left: 0,
      top: 0,
      width: 3,
      height: 3,
      strokeWidth: 0,
    });
    let mouseUpCalled1 = false;
    let mouseUpCalled2 = false;

    rect.controls = {
      br: rect.controls.br,
      tr: rect.controls.tr,
    };
    rect.controls.br.mouseUpHandler = function () {
      mouseUpCalled1 = true;
    };
    rect.controls.tr.mouseUpHandler = function () {
      mouseUpCalled2 = true;
    };

    canvas.add(rect);
    canvas.setActiveObject(rect);

    // @ts-expect-error private method
    canvas.__onMouseDown(e);
    // @ts-expect-error private method
    canvas.__onMouseMove(e1);
    // @ts-expect-error private method
    canvas.__onMouseMove(e2);
    // @ts-expect-error private method
    canvas.__onMouseUp(e3);

    expect(
      mouseUpCalled1,
      'mouse up handler for rect has been called anyway',
    ).toBe(true);
    expect(mouseUpCalled2, 'mouse up handler for rect2 has been called').toBe(
      true,
    );
  });

  it('fires drop:before and drop events', () => {
    const eventNames: (keyof CanvasEvents)[] = ['drop:before', 'drop'];
    const c = new Canvas();
    const fired: string[] = [];

    eventNames.forEach(function (eventName) {
      c.on(eventName, function () {
        fired.push(eventName);
      });
    });

    const event = getFabricDocument().createEvent('HTMLEvents');
    event.initEvent('drop', true, true);
    c.upperCanvasEl.dispatchEvent(event);

    expect(fired, 'bad drop event fired').toEqual(eventNames);
  });

  it('handles drag event cycle', async () => {
    async function testDragCycle(cycle: any[], canDrop?: boolean) {
      const c = new Canvas();
      const rect = new Rect({ width: 10, height: 10 });
      rect.canDrop = function () {
        return !!canDrop;
      };
      c.add(rect);

      const registry: string[] = [],
        canvasRegistry: string[] = [];

      for (const eventName of cycle) {
        rect.once(eventName, function () {
          registry.push(eventName);
        });

        c.once(eventName, function (opt) {
          expect(
            opt.target,
            `${eventName} on canvas has rect as a target`,
          ).toBe(rect);
          canvasRegistry.push(eventName);
        });

        const event = getFabricDocument().createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
        // @ts-expect-error - properties not in Event type
        event.clientX = 5;
        // @ts-expect-error - properties not in Event type
        event.clientY = 5;
        c.upperCanvasEl.dispatchEvent(event);
      }

      await c.dispose();
      expect(canvasRegistry.length, 'should fire cycle on canvas').toBe(
        cycle.length,
      );
      expect(canvasRegistry, 'should fire all events on canvas').toEqual(cycle);
      return registry;
    }

    let cycle: string[], res: string[];

    cycle = ['dragenter', 'dragover', 'dragover', 'dragover', 'drop'];
    res = await testDragCycle(cycle, true);
    expect(res, 'should fire all events on rect').toEqual(cycle);

    cycle = ['dragenter', 'dragover', 'dragover', 'dragover', 'dragleave'];
    res = await testDragCycle(cycle, true);
    expect(res, 'should fire all events on rect').toEqual(cycle);

    cycle = ['dragenter', 'dragover', 'dragover', 'dragover', 'drop'];
    res = await testDragCycle(cycle);
    expect(res, 'should fire all events on rect').toEqual(cycle);

    cycle = ['dragenter', 'dragover', 'dragover', 'dragover', 'dragleave'];
    res = await testDragCycle(cycle);
    expect(res, 'should fire all events on rect').toEqual(cycle);
  });

  // Test common mouse events
  ['mousedown', 'mousemove', 'wheel', 'dblclick'].forEach(function (eventType) {
    it(`fires fabric event - ${eventType}`, () => {
      let eventname: keyof CanvasEvents = (eventType.slice(0, 5) +
        ':' +
        eventType.slice(5)) as keyof CanvasEvents;
      if (eventType === 'wheel' || eventType === 'dblclick') {
        eventname = ('mouse:' + eventType) as keyof CanvasEvents;
      }

      if (eventType === 'mouseenter') {
        eventname = 'mouse:over' as keyof CanvasEvents;
      }

      let counter = 0;
      let target;
      const c = new Canvas();
      const rect = new Rect({ top: -4, left: -4, width: 12, height: 12 });

      c.add(rect);
      c.on(eventname, function (opt: any) {
        counter++;
        target = opt.target;
      });

      const event = getFabricDocument().createEvent('HTMLEvents');
      event.initEvent(eventType, true, true);
      // @ts-expect-error properties not in Event type
      event.clientX = 5;
      // @ts-expect-error properties not in Event type
      event.clientY = 5;

      if (eventType === 'dblclick') {
        // @ts-expect-error properties not in Event type
        event.detail = 2;
      }

      c.upperCanvasEl.dispatchEvent(event);

      expect(counter, `${eventname} fabric event fired`).toBe(1);
      expect(target, `${eventname} on canvas has rect as a target`).toBe(rect);
    });
  });

  it('fires mouse:over event for mouseenter', () => {
    const eventname = 'mouse:over';
    let counter = 0;
    const c = new Canvas();

    c.on(eventname, function () {
      counter++;
    });

    const event = getFabricDocument().createEvent('HTMLEvents');
    event.initEvent('mouseenter', true, true);
    c.upperCanvasEl.dispatchEvent(event);

    expect(counter, `${eventname} fabric event fired`).toBe(1);
  });

  it('handles mouseout events', () => {
    const eventName = 'mouseout';
    const canvasEventName = 'mouse:out';
    const c = new Canvas();
    const o1 = new Rect();
    const o2 = new Rect();
    const o3 = new Rect();
    const control: any[] = [];
    const targetControl: any[] = [];

    [o1, o2, o3].forEach((target) => {
      target.on(canvasEventName.replace(':', '') as keyof ObjectEvents, () => {
        targetControl.push(target);
      });
    });

    canvas.add(o1, o2, o3);
    c.on(canvasEventName, function (ev) {
      control.push(ev);
    });

    const event = getFabricDocument().createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);

    // with targets
    c._hoveredTarget = o3;
    c._hoveredTargets = [o2, o1];
    c.upperCanvasEl.dispatchEvent(event);

    expect(
      c._hoveredTarget,
      'should clear `_hoveredTarget` ref',
    ).toBeUndefined();
    expect(c._hoveredTargets, 'should clear `_hoveredTargets` ref').toEqual([]);

    const expected = [o3, o2, o1];
    expect(
      control.map((ev) => ev.target),
      'should equal control',
    ).toEqual(expected);
    expect(targetControl, 'should equal target control').toEqual(expected);

    // without targets
    control.length = 0;
    targetControl.length = 0;
    c.upperCanvasEl.dispatchEvent(event);
    expect(control.length, 'should have fired once').toBe(1);
    expect(control[0].target, 'no target should be referenced').toBeUndefined();
    expect(targetControl, 'no target should be referenced').toEqual([]);
  });

  it('fires mouseover and mouseout events for subTargets when subTargetCheck is enabled', async () => {
    let counterOver = 0,
      counterOut = 0;
    const testCanvas = new Canvas();

    function setSubTargetCheckRecursive(obj: any) {
      if (obj._objects) {
        obj._objects.forEach(setSubTargetCheckRecursive);
      }
      obj.subTargetCheck = true;
      obj.on('mouseover', function () {
        counterOver++;
      });
      obj.on('mouseout', function () {
        counterOut++;
      });
    }

    await testCanvas.loadFromJSON(SUB_TARGETS_JSON);
    const activeSelection = new ActiveSelection();
    activeSelection.add(...testCanvas.getObjects());
    testCanvas.setActiveObject(activeSelection);
    setSubTargetCheckRecursive(activeSelection);

    // perform MouseOver event on a deeply nested subTarget
    const moveEvent = { bubbles: true, target: testCanvas.upperCanvasEl };
    const target = testCanvas.item(1) as any;
    testCanvas.targets = [
      target.item(1),
      target.item(1).item(1),
      target.item(1).item(1).item(1),
    ];

    // @ts-expect-error private method
    testCanvas._fireOverOutEvents(moveEvent, target);
    expect(
      counterOver,
      'mouseover fabric event fired 4 times for primary hoveredTarget & subTargets',
    ).toBe(4);
    expect(testCanvas._hoveredTarget, 'activeSelection is _hoveredTarget').toBe(
      target,
    );
    expect(
      testCanvas._hoveredTargets.length,
      '3 additional subTargets are captured as _hoveredTargets',
    ).toBe(3);

    // perform MouseOut even on all hoveredTargets
    testCanvas.targets = [];
    // @ts-expect-error private method
    testCanvas._fireOverOutEvents(moveEvent, null);
    expect(
      counterOut,
      'mouseout fabric event fired 4 times for primary hoveredTarget & subTargets',
    ).toBe(4);
    expect(
      testCanvas._hoveredTarget,
      '_hoveredTarget has been set to null',
    ).toBeNull();
    expect(
      testCanvas._hoveredTargets.length,
      '_hoveredTargets array is empty',
    ).toBe(0);
  });

  it('updates groupSelector during mouse move', () => {
    const e = {
      clientX: 30,
      clientY: 40,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const expectedGroupSelector = { x: 15, y: 30, deltaX: 65, deltaY: 90 };

    canvas.absolutePan(new Point(50, 80));
    // @ts-expect-error private property
    canvas._groupSelector = { x: 15, y: 30, deltaX: 0, deltaY: 0 };

    // @ts-expect-error private method
    canvas.__onMouseMove(e);

    // @ts-expect-error private property
    expect(canvas._groupSelector, 'groupSelector is updated').toEqual(
      expectedGroupSelector,
    );
  });

  it('removes _hoveredTarget on mouseEnter', () => {
    const event = getFabricDocument().createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    const c = new Canvas();

    c._hoveredTarget = new Rect();
    c.upperCanvasEl.dispatchEvent(event);

    expect(c._hoveredTarget, '_hoveredTarget has been removed').toBeUndefined();
  });

  it('does not remove _hoveredTarget on mouseEnter if a transform is happening', () => {
    const event = getFabricDocument().createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    const c = new Canvas();
    const obj = new Rect();

    c._hoveredTarget = obj;
    // @ts-expect-error private property
    c._currentTransform = {};
    c.upperCanvasEl.dispatchEvent(event);

    expect(c._hoveredTarget, '_hoveredTarget has been not removed').toBe(obj);
  });

  it('removes __corner on mouseEnter', () => {
    const event = getFabricDocument().createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    const c = new Canvas();
    const obj = new Rect({ top: 100, left: 100 });

    c.add(obj);
    c.setActiveObject(obj);
    obj.__corner = 'test';
    c.upperCanvasEl.dispatchEvent(event);

    expect(
      obj.__corner,
      '__corner has been resetted from activeObject',
    ).toBeUndefined();
  });

  it('does not remove __corner on mouseEnter if there is a transform', () => {
    const event = getFabricDocument().createEvent('MouseEvent');
    event.initEvent('mouseenter', true, true);
    const c = new Canvas();
    const obj = new Rect();

    // @ts-expect-error private property
    c._currentTransform = {};
    c.setActiveObject(obj);
    obj.__corner = 'test';
    c.upperCanvasEl.dispatchEvent(event);

    expect(obj.__corner, '__corner has not been reset').toBe('test');
  });

  it('sets cursor correctly for different controls', () => {
    const key = canvas.altActionKey;
    const key2 = canvas.uniScaleKey;
    const target = new Rect({ width: 100, height: 100 });

    canvas.add(target);
    canvas.setActiveObject(target);
    target.setCoords();

    const expected: Record<string, string> = {
      mt: 'n-resize',
      mb: 's-resize',
      ml: 'w-resize',
      mr: 'e-resize',
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: false,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${expected[corner]} action is not disabled`,
      ).toBe(expected[corner]);
    }

    const expectedLockScalinX: Record<string, string> = {
      mt: 'n-resize',
      mb: 's-resize',
      ml: 'not-allowed',
      mr: 'not-allowed',
      tl: 'not-allowed',
      tr: 'not-allowed',
      bl: 'not-allowed',
      br: 'not-allowed',
      mtr: 'crosshair',
    };

    target.lockScalingX = true;

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: false,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${corner} is ${expectedLockScalinX[corner]} for lockScalingX`,
      ).toBe(expectedLockScalinX[corner]);
    }

    // Test with uniScaleKey pressed
    const expectedUniScale: Record<string, string> = {
      mt: 'ew-resize', // skewing
      mb: 'ew-resize', // skewing
      ml: 'ns-resize', // skewing
      mr: 'ns-resize', // skewing
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: false,
        // @ts-expect-error dynamic key
        [key2]: true,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${corner} is ${expectedUniScale[corner]} for uniScaleKey pressed`,
      ).toBe(expectedUniScale[corner]);
    }

    const expectedLockScalinY: Record<string, string> = {
      mt: 'not-allowed',
      mb: 'not-allowed',
      ml: 'w-resize',
      mr: 'e-resize',
      tl: 'not-allowed',
      tr: 'not-allowed',
      bl: 'not-allowed',
      br: 'not-allowed',
      mtr: 'crosshair',
    };

    target.lockScalingX = false;
    target.lockScalingY = true;

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: false,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${corner} is ${expectedLockScalinY[corner]} for lockScalingY`,
      ).toBe(expectedLockScalinY[corner]);
    }

    const expectedLockScalinYUniscaleKey: Record<string, string> = {
      mt: 'ew-resize', // skewing
      mb: 'ew-resize', // skewing
      ml: 'ns-resize', // skewing
      mr: 'ns-resize', // skewing
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: false,
        // @ts-expect-error dynamic key
        [key2]: true,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${corner} is ${expectedLockScalinYUniscaleKey[corner]} for lockScalingY + uniscaleKey`,
      ).toBe(expectedLockScalinYUniscaleKey[corner]);
    }

    const expectedAllLock: Record<string, string> = {
      mt: 'not-allowed',
      mb: 'not-allowed',
      ml: 'not-allowed',
      mr: 'not-allowed',
      tl: 'not-allowed',
      tr: 'not-allowed',
      bl: 'not-allowed',
      br: 'not-allowed',
      mtr: 'crosshair',
    };

    target.lockScalingY = true;
    target.lockScalingX = true;

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: false,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${corner} is ${expectedAllLock[corner]} for all locked`,
      ).toBe(expectedAllLock[corner]);
    }

    // Test with uniscale key
    const expectedAllLockUniscale: Record<string, string> = {
      mt: 'ew-resize', // skewing
      mb: 'ew-resize', // skewing
      ml: 'ns-resize', // skewing
      mr: 'ns-resize', // skewing
      tl: 'not-allowed',
      tr: 'not-allowed',
      bl: 'not-allowed',
      br: 'not-allowed',
      mtr: 'crosshair',
    };

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: false,
        // @ts-expect-error dynamic key
        [key2]: true,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${corner} is ${expectedAllLockUniscale[corner]} for all locked + uniscale`,
      ).toBe(expectedAllLockUniscale[corner]);
    }

    // Test rotation lock
    target.lockRotation = true;
    target.lockScalingY = false;
    target.lockScalingX = false;

    const e = {
      clientX: target.oCoords.mtr.x,
      clientY: target.oCoords.mtr.y,
      // @ts-expect-error dynamic key
      [key]: false,
      target: canvas.upperCanvasEl,
    };

    // @ts-expect-error private method
    canvas._setCursorFromEvent(e, target);
    expect(
      canvas.upperCanvasEl.style.cursor,
      'mtr is not allowed for locked rotation',
    ).toBe('not-allowed');

    // Test skewing lock
    target.lockSkewingX = true;
    target.lockSkewingY = true;
    target.lockRotation = false;

    // With lock-skewing we are back at normal
    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: false,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${key} is ${expected[corner]} for both lockskewing`,
      ).toBe(expected[corner]);
    }

    // Test skewing Y lock
    target.lockSkewingY = true;
    target.lockSkewingX = false;

    const expectedLockSkewingY: Record<string, string> = {
      mt: 'ew-resize', // skewing
      mb: 'ew-resize', // skewing
      ml: 'not-allowed', // skewing
      mr: 'not-allowed', // skewing
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: true,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${corner} ${expectedLockSkewingY[corner]} for lockSkewingY`,
      ).toBe(expectedLockSkewingY[corner]);
    }

    // Test skewing X lock
    target.lockSkewingY = false;
    target.lockSkewingX = true;

    const expectedLockSkewingX: Record<string, string> = {
      mt: 'not-allowed', // skewing
      mb: 'not-allowed', // skewing
      ml: 'ns-resize', // skewing
      mr: 'ns-resize', // skewing
      tl: 'nw-resize',
      tr: 'ne-resize',
      bl: 'sw-resize',
      br: 'se-resize',
      mtr: 'crosshair',
    };

    for (const [corner, coords] of Object.entries(target.oCoords)) {
      const e = {
        clientX: coords.x,
        clientY: coords.y,
        // @ts-expect-error dynamic key
        [key]: true,
        target: canvas.upperCanvasEl,
      };

      // @ts-expect-error private method
      canvas._setCursorFromEvent(e, target);
      expect(
        canvas.upperCanvasEl.style.cursor,
        `${corner} is ${expectedLockSkewingX[corner]} for lockSkewingX`,
      ).toBe(expectedLockSkewingX[corner]);
    }
  });

  it('manages text editing targets correctly', async () => {
    const testCanvas = new Canvas();
    const manager = testCanvas.textEditingManager;

    // @ts-expect-error -- targets is private member
    const getTarget = () => manager.target;
    // @ts-expect-error -- targets is private member
    const getTargets = () => manager.targets;

    expect(manager, 'should exist').toBeTruthy();
    expect(getTargets(), 'should be empty').toEqual([]);

    const a = new IText('test');
    const b = new IText('test');
    const e = {
      clientX: 30,
      clientY: 40,
      which: 1,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent;

    testCanvas.add(a);
    expect(getTargets(), 'a should be in targets').toEqual([a]);

    testCanvas.remove(a);
    expect(getTargets(), 'should be empty after remove').toEqual([]);

    testCanvas.add(a);
    expect(getTargets(), 'a should be in targets again').toEqual([a]);

    testCanvas.add(b);
    expect(getTargets(), 'both a and b should be in targets').toEqual([a, b]);

    a.enterEditing();
    expect(a.isEditing, 'a should be editing').toBeTruthy();

    b.enterEditing();
    expect(b.isEditing, 'b should be editing').toBeTruthy();
    expect(a.isEditing, 'a should have exited editing').toBeFalsy();

    manager.register(b);
    manager.exitTextEditing();
    expect(getTarget(), 'should unregister b').toBeFalsy();
    expect(b.isEditing, 'b should exit editing').toBeFalsy();

    b.enterEditing();
    b.fire('mousedown', { e, pointer: new Point(30, 40) } as any);

    expect(getTarget(), 'should register b').toBe(b);

    const called: IText[] = [];
    a.updateSelectionOnMouseMove = () => called.push(a);
    b.updateSelectionOnMouseMove = () => called.push(b);

    testCanvas.__onMouseMove(e);
    expect(called, 'manager is called from mouse move').toEqual([b]);

    manager.unregister(a);
    expect(getTarget(), 'should not unregister b').toBe(b);

    a.fire('mouseup', { e, pointer: new Point(30, 40) } as any);

    expect(getTarget(), 'should not unregister b').toBe(b);

    testCanvas.__onMouseUp(e);
    expect(getTarget(), 'should unregister b').toBeFalsy();

    manager.register(a);
    expect(getTarget(), 'should register a').toBe(a);

    testCanvas.remove(a);
    expect(getTarget(), 'should unregister a').toBeFalsy();

    manager.clear();
    expect(getTarget(), 'should have disposed ref').toBeFalsy();
    expect(getTargets(), 'should have disposed refs').toEqual([]);

    const g = new Group([a]);
    testCanvas.add(g);
    expect(getTargets(), 'should register an existing nested instance').toEqual(
      [a],
    );

    g.add(b);
    expect(getTargets(), 'should register an added nested instance').toEqual([
      a,
      b,
    ]);

    manager.register(b);
    expect(getTarget(), 'should register b').toBe(b);

    g.remove(b);
    expect(getTarget(), 'should unregister b').toBeFalsy();
    expect(
      getTargets(),
      'should unregister a nested instance upon removal',
    ).toEqual([a]);

    manager.register(a);
    expect(getTarget(), 'should register a').toBe(a);

    testCanvas.remove(g);
    expect(getTarget(), 'should unregister a').toBeFalsy();
    expect(
      getTargets(),
      'should unregister nested instances upon group removal',
    ).toEqual([]);

    testCanvas.add(b);
    expect(getTargets(), 'should register instance').toEqual([b]);

    testCanvas.clear();
    expect(getTargets(), 'clear should clear instances').toEqual([]);

    testCanvas.add(b);
    expect(getTargets(), 'should register instance').toEqual([b]);

    manager.register(b);
    expect(getTarget(), 'should register b').toBe(b);

    await testCanvas.dispose();
    expect(getTargets(), 'dispose should clear instances').toEqual([]);
    expect(getTarget(), 'should unregister b').toBeFalsy();
  });

  it.todo('mousemove: subTargetCheck: setCursorFromEvent considers subTargets');
  it.todo(
    "mousemove: subTargetCheck: setCursorFromEvent considers subTargets in reverse order, so the top-most subTarget's .hoverCursor takes precedence",
  );

  // TODO: ported from qunit, check if is still valid for vitest
  // this test is important. As today we do not have anymore a unique function that gives us the
  // status of the action. That logic is replicated in style handler and action handler.
  // This is a cleanup of the current work that we need to do.
  // This wasn't a user facing feature, although the method was public and documented in JSDOCS
  // it('checks if action is disabled', () => {
  //   expect(Canvas.prototype.actionIsDisabled, 'actionIsDisabled is a function').toBeTypeOf('function');
  //   const key = canvas.altActionKey;
  //   let target = new FabricObject();
  //   const e: Record<string, any> = {};
  //   e[key] = false;
  //   expect(!!canvas.actionIsDisabled('mt', target, e), 'action is not disabled').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mb', target, e), 'action is not disabled').toBe(false);
  //   expect(!!canvas.actionIsDisabled('ml', target, e), 'action is not disabled').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mr', target, e), 'action is not disabled').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tl', target, e), 'action is not disabled').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tr', target, e), 'action is not disabled').toBe(false);
  //   expect(!!canvas.actionIsDisabled('bl', target, e), 'action is not disabled').toBe(false);
  //   expect(!!canvas.actionIsDisabled('br', target, e), 'action is not disabled').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mtr', target, e), 'action is not disabled').toBe(false);
  //
  //   target = new FabricObject();
  //   target.lockScalingX = true;
  //
  //   expect(!!canvas.actionIsDisabled('mt', target, e), 'mt action is not disabled lockScalingX').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mb', target, e), 'mb action is not disabled lockScalingX').toBe(false);
  //   expect(!!canvas.actionIsDisabled('ml', target, e), 'ml action is disabled lockScalingX').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mr', target, e), 'mr action is disabled lockScalingX').toBe(true);
  //   expect(!!canvas.actionIsDisabled('tl', target, e), 'tl action is disabled lockScalingX').toBe(true);
  //   expect(!!canvas.actionIsDisabled('tr', target, e), 'tr action is disabled lockScalingX').toBe(true);
  //   expect(!!canvas.actionIsDisabled('bl', target, e), 'bl action is disabled lockScalingX').toBe(true);
  //   expect(!!canvas.actionIsDisabled('br', target, e), 'br action is disabled lockScalingX').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mtr', target, e), 'mtr action is not disabled lockScalingX').toBe(false);
  //
  //   target = new FabricObject();
  //   target.lockScalingY = true;
  //   expect(!!canvas.actionIsDisabled('mt', target, e), 'mt action is disabled lockScalingY').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mb', target, e), 'mb action is disabled lockScalingY').toBe(true);
  //   expect(!!canvas.actionIsDisabled('ml', target, e), 'ml action is not disabled lockScalingY').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mr', target, e), 'mr action is not disabled lockScalingY').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tl', target, e), 'tl action is not disabled lockScalingY').toBe(true);
  //   expect(!!canvas.actionIsDisabled('tr', target, e), 'tr action is not disabled lockScalingY').toBe(true);
  //   expect(!!canvas.actionIsDisabled('bl', target, e), 'bl action is not disabled lockScalingY').toBe(true);
  //   expect(!!canvas.actionIsDisabled('br', target, e), 'br action is not disabled lockScalingY').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mtr', target, e), 'mtr action is not disabledlockScalingY').toBe(false);
  //
  //   target = new FabricObject();
  //   target.lockScalingY = true;
  //   target.lockScalingX = true;
  //   expect(!!canvas.actionIsDisabled('mt', target, e), 'mt action is disabled scaling locked').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mb', target, e), 'mb action is disabled scaling locked').toBe(true);
  //   expect(!!canvas.actionIsDisabled('ml', target, e), 'ml action is disabled scaling locked').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mr', target, e), 'mr action is disabled scaling locked').toBe(true);
  //   expect(!!canvas.actionIsDisabled('tl', target, e), 'tl action is disabled scaling locked').toBe(true);
  //   expect(!!canvas.actionIsDisabled('tr', target, e), 'tr action is disabled scaling locked').toBe(true);
  //   expect(!!canvas.actionIsDisabled('bl', target, e), 'bl action is disabled scaling locked').toBe(true);
  //   expect(!!canvas.actionIsDisabled('br', target, e), 'br action is disabled scaling locked').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mtr', target, e), 'mtr action is not disabled scaling locked').toBe(false);
  //
  //   target = new FabricObject();
  //   target.lockRotation = true;
  //   expect(!!canvas.actionIsDisabled('mt', target, e), 'mt action is not disabled lockRotation').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mb', target, e), 'mb action is not disabled lockRotation').toBe(false);
  //   expect(!!canvas.actionIsDisabled('ml', target, e), 'ml action is not disabled lockRotation').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mr', target, e), 'mr action is not disabled lockRotation').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tl', target, e), 'tl action is not disabled lockRotation').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tr', target, e), 'tr action is not disabled lockRotation').toBe(false);
  //   expect(!!canvas.actionIsDisabled('bl', target, e), 'bl action is not disabled lockRotation').toBe(false);
  //   expect(!!canvas.actionIsDisabled('br', target, e), 'br action is not disabled lockRotation').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mtr', target, e), 'mtr action is disabled lockRotation').toBe(true);
  //
  //   target = new FabricObject();
  //   target.lockSkewingX = true;
  //   target.lockSkewingY = true;
  //   expect(!!canvas.actionIsDisabled('mt', target, e), 'mt action is not disabled lockSkewing').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mb', target, e), 'mb action is not disabled lockSkewing').toBe(false);
  //   expect(!!canvas.actionIsDisabled('ml', target, e), 'ml action is not disabled lockSkewing').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mr', target, e), 'mr action is not disabled lockSkewing').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tl', target, e), 'tl action is not disabled lockSkewing').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tr', target, e), 'tr action is not disabled lockSkewing').toBe(false);
  //   expect(!!canvas.actionIsDisabled('bl', target, e), 'bl action is not disabled lockSkewing').toBe(false);
  //   expect(!!canvas.actionIsDisabled('br', target, e), 'br action is not disabled lockSkewing').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mtr', target, e), 'mtr action is not disabled lockSkewing').toBe(false);
  //
  //   e[key] = true;
  //   target = new FabricObject();
  //   target.lockSkewingY = true;
  //   expect(!!canvas.actionIsDisabled('mt', target, e), 'mt action is not disabled lockSkewingY').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mb', target, e), 'mb action is not disabled lockSkewingY').toBe(false);
  //   expect(!!canvas.actionIsDisabled('ml', target, e), 'ml action is disabled lockSkewingY').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mr', target, e), 'mr action is disabled lockSkewingY').toBe(true);
  //   expect(!!canvas.actionIsDisabled('tl', target, e), 'tl action is not disabled lockSkewingY').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tr', target, e), 'tr action is not disabled lockSkewingY').toBe(false);
  //   expect(!!canvas.actionIsDisabled('bl', target, e), 'bl action is not disabled lockSkewingY').toBe(false);
  //   expect(!!canvas.actionIsDisabled('br', target, e), 'br action is not disabled lockSkewingY').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mtr', target, e), 'mtr action is not disabled lockSkewingY').toBe(false);
  //
  //   e[key] = true;
  //   target = new FabricObject();
  //   target.lockSkewingX = true;
  //   expect(!!canvas.actionIsDisabled('mt', target, e), 'mt action is disabled lockSkewingX').toBe(true);
  //   expect(!!canvas.actionIsDisabled('mb', target, e), 'mb action is disabled lockSkewingX').toBe(true);
  //   expect(!!canvas.actionIsDisabled('ml', target, e), 'ml action is not disabled lockSkewingX').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mr', target, e), 'mr action is not disabled lockSkewingX').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tl', target, e), 'tl action is not disabled lockSkewingX').toBe(false);
  //   expect(!!canvas.actionIsDisabled('tr', target, e), 'tr action is not disabled lockSkewingX').toBe(false);
  //   expect(!!canvas.actionIsDisabled('bl', target, e), 'bl action is not disabled lockSkewingX').toBe(false);
  //   expect(!!canvas.actionIsDisabled('br', target, e), 'br action is not disabled lockSkewingX').toBe(false);
  //   expect(!!canvas.actionIsDisabled('mtr', target, e), 'mtr action is not disabled lockSkewingX').toBe(false);
  // });
});
