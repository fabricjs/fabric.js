import { StaticCanvas } from './StaticCanvas';
import { Canvas } from './Canvas';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { TMat2D } from '../typedefs';
import { FabricText, Gradient, Pattern, version } from '../../fabric';
import { config } from '../config';
import { Rect } from '../shapes/Rect';
import { Circle } from '../shapes/Circle';
import type { FabricObject } from '../shapes/Object/Object';
import { getFabricDocument } from '../env';
import { FabricImage } from '../shapes/Image';
import { Point } from '../Point';
import { Group } from '../shapes/Group';
import { Path } from '../shapes/Path';
import { Ellipse } from '../shapes/Ellipse';
import { Line } from '../shapes/Line';
import { Polyline } from '../shapes/Polyline';
import { Triangle } from '../shapes/Triangle';
import { Polygon } from '../shapes/Polygon';

import {
  CANVAS_SVG,
  CANVAS_SVG_VIEWBOX,
  PATH_DATALESS_JSON,
  PATH_JSON,
  PATH_WITHOUT_DEFAULTS_JSON,
  RECT_JSON,
  RECT_JSON_WITH_PADDING,
  REFERENCE_IMG_OBJECT,
  IMG_SRC,
  IMG_WIDTH,
  IMG_HEIGHT,
} from './StaticCanvas.fixtures';
import { isJSDOM, sanitizeSVG } from '../../vitest.extend';

describe('StaticCanvas', () => {
  const canvas = new StaticCanvas(undefined, {
    renderOnAddRemove: false,
    enableRetinaScaling: false,
    width: 200,
    height: 200,
  });
  const canvas2 = new StaticCanvas(undefined, {
    renderOnAddRemove: false,
    enableRetinaScaling: false,
    width: 200,
    height: 200,
  });
  const lowerCanvasEl = canvas.lowerCanvasEl;

  beforeEach(() => {
    canvas.clear();
    canvas.setDimensions({ width: 200, height: 200 });
    canvas2.setDimensions({ width: 200, height: 200 });
    canvas.backgroundColor = StaticCanvas.getDefaults().backgroundColor;
    canvas.backgroundImage = StaticCanvas.getDefaults().backgroundImage;
    canvas.overlayColor = StaticCanvas.getDefaults().overlayColor;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.calcOffset();
    canvas.requestRenderAll = StaticCanvas.prototype.requestRenderAll;
    canvas.cancelRequestedRender();
    canvas2.cancelRequestedRender();
    canvas.renderOnAddRemove = false;
    canvas2.renderOnAddRemove = false;
  });

  afterEach(() => {
    canvas.cancelRequestedRender();
    canvas2.cancelRequestedRender();
    config.configure({ devicePixelRatio: 1 });
  });

  it('toBlob', async () => {
    const canvas = new StaticCanvas(undefined, { width: 300, height: 300 });
    const blob = await canvas.toBlob({
      multiplier: 3,
    });
    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toBe('image/png');
  });
  it('attempts webp format but may fallback to png in node environment', () => {
    const canvas = new StaticCanvas(undefined, { width: 300, height: 300 });
    const dataURL = canvas.toDataURL({
      format: 'webp',
      multiplier: 1,
    });
    /**
     * In browser environments this would be 'data:image/webp'
     * In Node.js environment (node-canvas) it falls back to PNG.
     * @see https://github.com/Automattic/node-canvas/issues/1258 for possible workaround
     */
    expect(dataURL).toMatch(/^data:image\/(webp|png)/);
  });

  it('prevents multiple canvas initialization', () => {
    const canvas = new StaticCanvas();
    expect(canvas.lowerCanvasEl).toBeTruthy();
    expect(() => new StaticCanvas(canvas.lowerCanvasEl)).toThrow();
  });

  it('has correct initial properties', () => {
    const canvas = new StaticCanvas();
    expect('backgroundColor' in canvas).toBeTruthy();
    expect('overlayColor' in canvas).toBeTruthy();
    expect('includeDefaultValues' in canvas).toBeTruthy();
    expect('renderOnAddRemove' in canvas).toBeTruthy();
    expect('controlsAboveOverlay' in canvas).toBeTruthy();
    expect('allowTouchScrolling' in canvas).toBeTruthy();
    expect('imageSmoothingEnabled' in canvas).toBeTruthy();
    expect('backgroundVpt' in canvas).toBeTruthy();
    expect('overlayVpt' in canvas).toBeTruthy();
    expect(Array.isArray(canvas._objects)).toBeTruthy();
    expect(canvas._objects.length).toBe(0);

    expect(canvas.includeDefaultValues).toBe(true);
    expect(canvas.renderOnAddRemove).toBe(true);
    expect(canvas.controlsAboveOverlay).toBe(false);
    expect(canvas.allowTouchScrolling).toBe(false);
    expect(canvas.imageSmoothingEnabled).toBe(true);
    expect(canvas.backgroundVpt).toBe(true);
    expect(canvas.overlayVpt).toBe(true);

    expect(canvas.viewportTransform).not.toBe(canvas2.viewportTransform);
  });

  it('provides getObjects method', () => {
    expect(canvas.getObjects).toBeTypeOf('function');
    expect(canvas.getObjects()).toEqual([]);
    expect(canvas.getObjects().length).toBe(0);
  });

  it('provides getElement method', () => {
    expect(canvas.getElement).toBeTypeOf('function');
    expect(canvas.getElement()).toBe(lowerCanvasEl);
  });

  it('provides item method to access objects by index', () => {
    const rect = makeRect();

    expect(canvas.item).toBeTypeOf('function');
    canvas.add(rect);
    expect(canvas.item(0)).toBe(rect);
  });

  it('calculates offset correctly', () => {
    expect(canvas.calcOffset).toBeTypeOf('function');
    expect(canvas.calcOffset()).toEqual({ left: 0, top: 0 });
  });

  it('adds objects to the canvas', () => {
    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();
    const rect4 = makeRect();
    let renderAllCount = 0;

    function countRenderAll() {
      renderAllCount++;
    }

    canvas.renderOnAddRemove = true;
    canvas.requestRenderAll = countRenderAll;

    expect(canvas.add).toBeTypeOf('function');
    expect(canvas.add(rect1)).toBe(1);
    expect(canvas.item(0)).toBe(rect1);
    expect(renderAllCount).toBe(1);

    expect(canvas.add(rect2, rect3, rect4)).toBe(4);
    expect(canvas.getObjects().length).toBe(4);
    expect(renderAllCount).toBe(2);

    canvas.add();
    expect(renderAllCount).toBe(2);

    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);
    expect(canvas.item(3)).toBe(rect4);
  });

  it('handles objects that belong to a different canvas', () => {
    const rect1 = makeRect();
    const control: {
      action: string;
      canvas: StaticCanvas;
      target: FabricObject;
    }[] = [];

    canvas.on('object:added', (opt) => {
      control.push({
        action: 'added',
        canvas: canvas,
        target: opt.target,
      });
    });

    canvas.on('object:removed', (opt) => {
      control.push({
        action: 'removed',
        canvas: canvas,
        target: opt.target,
      });
    });

    canvas2.on('object:added', (opt) => {
      control.push({
        action: 'added',
        canvas: canvas2,
        target: opt.target,
      });
    });

    canvas.add(rect1);
    expect(canvas.item(0)).toBe(rect1);

    canvas2.add(rect1);
    expect(canvas.item(0)).toBeUndefined();
    expect(canvas.size()).toBe(0);
    expect(canvas2.item(0)).toBe(rect1);

    const expected = [
      { action: 'added', target: rect1, canvas: canvas },
      { action: 'removed', target: rect1, canvas: canvas },
      { action: 'added', target: rect1, canvas: canvas2 },
    ];

    expect(control).toEqual(expected);
  });

  it('respects renderOnAddRemove setting', () => {
    const rect = makeRect();
    let renderAllCount = 0;

    function countRenderAll() {
      renderAllCount++;
    }

    canvas.renderOnAddRemove = false;
    canvas.requestRenderAll = countRenderAll;

    canvas.add(rect);
    expect(renderAllCount).toBe(0);
    expect(canvas.item(0)).toBe(rect);

    canvas.add(makeRect(), makeRect(), makeRect());
    expect(canvas.getObjects().length).toBe(4);
    expect(renderAllCount).toBe(0);
  });

  it('fires object:added events', () => {
    const objectsAdded: FabricObject[] = [];

    canvas.on('object:added', function (e) {
      objectsAdded.push(e.target);
    });

    const rect = new Rect({ width: 10, height: 20 });
    canvas.add(rect);
    expect(objectsAdded[0]).toBe(rect);

    const circle1 = new Circle();
    const circle2 = new Circle();
    canvas.add(circle1, circle2);
    expect(objectsAdded[1]).toBe(circle1);
    expect(objectsAdded[2]).toBe(circle2);

    const circle3 = new Circle();
    canvas.insertAt(2, circle3);
    expect(objectsAdded[3]).toBe(circle3);
  });

  it('inserts objects at specified positions', () => {
    const rect1 = makeRect();
    const rect2 = makeRect();
    let renderAllCount = 0;

    canvas.add(rect1, rect2);

    expect(canvas.insertAt).toBeTypeOf('function');

    function countRenderAll() {
      renderAllCount++;
    }

    canvas.requestRenderAll = countRenderAll;
    canvas.renderOnAddRemove = true;
    expect(renderAllCount).toBe(0);

    const rect = makeRect();
    canvas.insertAt(1, rect);
    expect(renderAllCount).toBe(1);
    expect(canvas.item(1)).toBe(rect);

    canvas.insertAt(2, rect);
    expect(renderAllCount).toBe(2);
    expect(canvas.item(2)).toBe(rect);

    canvas.insertAt(2, rect);
    expect(renderAllCount).toBe(3);
  });

  it('respects renderOnAddRemove when inserting objects', () => {
    const rect1 = makeRect();
    const rect2 = makeRect();
    let renderAllCount = 0;

    function countRenderAll() {
      renderAllCount++;
    }

    canvas.renderOnAddRemove = false;
    canvas.requestRenderAll = countRenderAll;

    canvas.add(rect1, rect2);
    expect(renderAllCount).toBe(0);

    const rect = makeRect();

    canvas.insertAt(1, rect);
    expect(renderAllCount).toBe(0);
    expect(canvas.item(1)).toBe(rect);

    canvas.insertAt(2, rect);
    expect(renderAllCount).toBe(0);
  });

  it('removes objects correctly', () => {
    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();
    const rect4 = makeRect();
    let renderAllCount = 0;

    function countRenderAll() {
      renderAllCount++;
    }

    canvas.add(rect1, rect2, rect3, rect4);
    canvas.requestRenderAll = countRenderAll;
    canvas.renderOnAddRemove = true;

    expect(canvas.remove).toBeTypeOf('function');
    expect(renderAllCount).toBe(0);

    expect(canvas.remove(rect1)[0]).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);

    canvas.remove(rect2, rect3);
    expect(renderAllCount).toBe(2);
    expect(canvas.item(0)).toBe(rect4);

    canvas.remove(rect4);
    expect(renderAllCount).toBe(3);
    expect(canvas.isEmpty()).toBe(true);
  });

  it('respects renderOnAddRemove when removing objects', () => {
    const rect1 = makeRect();
    const rect2 = makeRect();
    let renderAllCount = 0;

    function countRenderAll() {
      renderAllCount++;
    }

    canvas.requestRenderAll = countRenderAll;
    canvas.renderOnAddRemove = false;

    canvas.add(rect1, rect2);
    expect(renderAllCount).toBe(0);
    expect(canvas.remove(rect1)[0]).toBe(rect1);
    expect(renderAllCount).toBe(0);
    expect(canvas.item(0)).toBe(rect2);
  });

  it('fires object:removed events', () => {
    const objectsRemoved: FabricObject[] = [];

    canvas.on('object:removed', function (e) {
      objectsRemoved.push(e.target);
    });

    const rect = new Rect({ width: 10, height: 20 });
    const circle1 = new Circle();
    const circle2 = new Circle();

    canvas.add(rect, circle1, circle2);

    expect(canvas.item(0)).toBe(rect);
    expect(canvas.item(1)).toBe(circle1);
    expect(canvas.item(2)).toBe(circle2);

    canvas.remove(rect);
    expect(objectsRemoved[0]).toBe(rect);
    expect(rect.canvas).toBeUndefined();

    canvas.remove(circle1, circle2);
    expect(objectsRemoved[1]).toBe(circle1);
    expect(circle1.canvas).toBeUndefined();
    expect(objectsRemoved[2]).toBe(circle2);
    expect(circle2.canvas).toBeUndefined();

    expect(canvas.isEmpty()).toBe(true);
  });

  it('provides clearContext method', () => {
    expect(canvas.clearContext).toBeTypeOf('function');
    canvas.clearContext(canvas.contextContainer);
  });

  it('clears the canvas completely', () => {
    expect(canvas.clear).toBeTypeOf('function');

    const bg = new Rect({ width: 10, height: 20 });
    canvas.backgroundColor = '#FF0000';
    canvas.overlayColor = '#FF0000';
    canvas.backgroundImage = bg;
    canvas.overlayImage = bg;

    const objectsRemoved: FabricObject[] = [];
    canvas.on('object:removed', function (e) {
      objectsRemoved.push(e.target);
    });

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();
    canvas.add(rect1, rect2, rect3);

    canvas.clear();
    expect(canvas.getObjects().length).toBe(0);
    expect(objectsRemoved[0]).toBe(rect1);
    expect(objectsRemoved[1]).toBe(rect2);
    expect(objectsRemoved[2]).toBe(rect3);
    expect(canvas.backgroundColor).toBe('');
    expect(canvas.overlayColor).toBe('');
    expect(canvas.backgroundImage).toBeUndefined();
    expect(canvas.overlayImage).toBeUndefined();
  });

  it('provides renderAll method', () => {
    expect(canvas.renderAll).toBeTypeOf('function');
    canvas.renderAll();
  });

  // TODO: was also commented out prior to vitest migration
  // it('sets canvas dimensions correctly', () => {
  //   expect(canvas.setDimensions).toBeTypeOf('function');
  //   canvas.setDimensions({ width: 4, height: 5 });
  //   expect(canvas.getWidth()).toBe(4);
  //   expect(canvas.getHeight()).toBe(5);
  //   expect(canvas.lowerCanvasEl.style.width).toBe('5px');
  //   expect(canvas.lowerCanvasEl.style.height).toBe('4px');
  // });

  it('exports to canvas element of correct size', () => {
    expect(canvas.toCanvasElement).toBeTypeOf('function');
    const canvasEl = canvas.toCanvasElement();
    expect(canvasEl.width).toBe(canvas.getWidth());
    expect(canvasEl.height).toBe(canvas.getHeight());
  });

  it('exports to canvas element with multiplier', () => {
    expect(canvas.toCanvasElement).toBeTypeOf('function');
    const multiplier = 2;
    const canvasEl = canvas.toCanvasElement(multiplier);
    expect(canvasEl.width).toBe(canvas.getWidth() * multiplier);
    expect(canvasEl.height).toBe(canvas.getHeight() * multiplier);
  });

  it('generates data URL correctly', () => {
    expect(canvas.toDataURL).toBeTypeOf('function');
    const rect = new Rect({
      width: 100,
      height: 100,
      fill: 'red',
      top: 0,
      left: 0,
    });
    canvas.add(rect);
    const dataURL = canvas.toDataURL();
    // don't compare actual data url, as it is often browser-dependent
    expect(typeof dataURL).toBe('string');
    expect(dataURL.substring(0, 21)).toBe('data:image/png;base64');
    //we can just compare that the dataUrl generated differs from the dataURl of an empty canvas
    expect(dataURL.substring(200, 210) !== 'AAAAAAAAAA').toBe(true);
  });

  it('supports retina scaling in data URL generation', async () => {
    config.configure({ devicePixelRatio: 2 });
    const c = new StaticCanvas(undefined, {
      enableRetinaScaling: true,
      width: 10,
      height: 10,
    });
    // @ts-expect-error -- multiplier is missing in options and it is mandatory per typescript
    const dataUrl = c.toDataURL({ enableRetinaScaling: true });
    c.cancelRequestedRender();

    return new Promise<void>((resolve) => {
      const img = getFabricDocument().createElement('img');
      img.onload = () => {
        expect(img.width).toBe(c.width * config.devicePixelRatio);
        expect(img.height).toBe(c.height * config.devicePixelRatio);
        resolve();
      };
      img.src = dataUrl;
    });
  });

  it('handles enableRetinaScaling: true with multiplier = 1', async () => {
    config.configure({ devicePixelRatio: 2 });
    const c = new StaticCanvas(undefined, {
      enableRetinaScaling: true,
      width: 10,
      height: 10,
    });
    const dataUrl = c.toDataURL({ enableRetinaScaling: true, multiplier: 1 });
    c.cancelRequestedRender();

    return new Promise<void>((resolve) => {
      const img = getFabricDocument().createElement('img');
      img.onload = () => {
        expect(img.width).toBe(c.width * config.devicePixelRatio);
        expect(img.height).toBe(c.height * config.devicePixelRatio);
        resolve();
      };
      img.src = dataUrl;
    });
  });

  it('handles enableRetinaScaling: true with multiplier = 3', async () => {
    config.configure({ devicePixelRatio: 2 });
    const c = new StaticCanvas(undefined, {
      enableRetinaScaling: true,
      width: 10,
      height: 10,
    });
    const dataUrl = c.toDataURL({ enableRetinaScaling: true, multiplier: 3 });
    c.cancelRequestedRender();

    return new Promise<void>((resolve) => {
      const img = getFabricDocument().createElement('img');
      img.onload = () => {
        expect(img.width).toBe(c.width * config.devicePixelRatio * 3);
        expect(img.height).toBe(c.height * config.devicePixelRatio * 3);
        resolve();
      };
      img.src = dataUrl;
    });
  });

  it('handles enableRetinaScaling: false with no multiplier', async () => {
    config.configure({ devicePixelRatio: 2 });
    const c = new StaticCanvas(undefined, {
      enableRetinaScaling: true,
      width: 10,
      height: 10,
    });
    // @ts-expect-error -- multiplier is missing in options and it is mandatory per typescript
    const dataUrl = c.toDataURL({ enableRetinaScaling: false });
    c.cancelRequestedRender();

    return new Promise<void>((resolve) => {
      const img = getFabricDocument().createElement('img');
      img.onload = () => {
        expect(img.width).toBe(c.width);
        expect(img.height).toBe(c.height);
        resolve();
      };
      img.src = dataUrl;
    });
  });

  it('handles enableRetinaScaling: false with multiplier = 1', async () => {
    config.configure({ devicePixelRatio: 2 });
    const c = new StaticCanvas(undefined, {
      enableRetinaScaling: true,
      width: 10,
      height: 10,
    });
    const dataUrl = c.toDataURL({
      enableRetinaScaling: false,
      multiplier: 1,
    });
    c.cancelRequestedRender();

    return new Promise<void>((resolve) => {
      const img = getFabricDocument().createElement('img');
      img.onload = () => {
        expect(img.width).toBe(c.width);
        expect(img.height).toBe(c.height);
        resolve();
      };
      img.src = dataUrl;
    });
  });

  it('handles enableRetinaScaling: false with multiplier = 3', async () => {
    config.configure({ devicePixelRatio: 2 });
    const c = new StaticCanvas(undefined, {
      enableRetinaScaling: true,
      width: 10,
      height: 10,
    });
    const dataUrl = c.toDataURL({
      enableRetinaScaling: false,
      multiplier: 3,
    });
    c.cancelRequestedRender();

    return new Promise<void>((resolve) => {
      const img = getFabricDocument().createElement('img');
      img.onload = () => {
        expect(img.width).toBe(c.width * 3);
        expect(img.height).toBe(c.height * 3);
        resolve();
      };
      img.src = dataUrl;
    });
  });

  it('generates JPEG data URL correctly', () => {
    try {
      // @ts-expect-error -- multiplier is mandatory option per typescript types
      const dataURL = canvas.toDataURL({ format: 'jpeg' });
      expect(dataURL.substring(0, 22)).toBe('data:image/jpeg;base64');
    } catch {
      // node-canvas does not support jpeg data urls
      expect(true).toBeTruthy();
    }
  });

  it('supports cropping in data URL generation', async () => {
    expect(canvas.toDataURL).toBeTypeOf('function');
    const croppingWidth = 75;
    const croppingHeight = 50;
    // @ts-expect-error -- multiplier is mandatory option per typescript types
    const dataURL = canvas.toDataURL({
      width: croppingWidth,
      height: croppingHeight,
    });

    const img = await FabricImage.fromURL(dataURL);
    expect(img.width).toBe(croppingWidth);
    expect(img.height).toBe(croppingHeight);
  });

  it('centers objects horizontally', () => {
    expect(canvas.centerObjectH).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObjectH(rect);
    expect(rect.getCenterPoint().x).toBe(canvas.width / 2);

    canvas.setZoom(4);
    expect(rect.getCenterPoint().x).toBe(canvas.height / 2);
    canvas.setZoom(1);
  });

  it('centers objects vertically', () => {
    expect(canvas.centerObjectV).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObjectV(rect);
    expect(rect.getCenterPoint().y).toBe(canvas.height / 2);

    canvas.setZoom(2);
    expect(rect.getCenterPoint().y).toBe(canvas.height / 2);
  });

  it('centers objects both horizontally and vertically', () => {
    expect(canvas.centerObject).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObject(rect);

    expect(rect.getCenterPoint().y).toBe(canvas.height / 2);
    expect(rect.getCenterPoint().x).toBe(canvas.height / 2);

    canvas.setZoom(4);
    expect(rect.getCenterPoint().y).toBe(canvas.height / 2);
    expect(rect.getCenterPoint().x).toBe(canvas.height / 2);
    canvas.setZoom(1);
  });

  it('centers objects horizontally in viewport', () => {
    expect(canvas.viewportCenterObjectH).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    const pan = 10;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.add(rect);

    const oldY = rect.top;
    canvas.viewportCenterObjectH(rect);
    expect(rect.getCenterPoint().x).toBe(canvas.width / 2);
    expect(rect.top).toBe(oldY);

    canvas.setZoom(2);
    canvas.viewportCenterObjectH(rect);
    expect(rect.getCenterPoint().x).toBe(canvas.width / (2 * canvas.getZoom()));
    expect(rect.top).toBe(oldY);

    canvas.absolutePan(new Point(pan, pan));
    canvas.viewportCenterObjectH(rect);
    expect(rect.getCenterPoint().x).toBe(
      (canvas.width / 2 + pan) / canvas.getZoom(),
    );
    expect(rect.top).toBe(oldY);
  });

  it('centers objects vertically in viewport', () => {
    expect(canvas.viewportCenterObjectV).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    const pan = 10;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.add(rect);

    const oldX = rect.left;
    canvas.viewportCenterObjectV(rect);
    expect(rect.getCenterPoint().y).toBe(canvas.height / 2);
    expect(rect.left).toBe(oldX);

    canvas.setZoom(2);
    canvas.viewportCenterObjectV(rect);
    expect(rect.getCenterPoint().y).toBe(
      canvas.height / (2 * canvas.getZoom()),
    );
    expect(rect.left).toBe(oldX);

    canvas.absolutePan(new Point(pan, pan));
    canvas.viewportCenterObjectV(rect);
    expect(rect.getCenterPoint().y).toBe(
      (canvas.height / 2 + pan) / canvas.getZoom(),
    );
    expect(rect.left).toBe(oldX);
  });

  it('centers objects in viewport both horizontally and vertically', () => {
    expect(canvas.viewportCenterObject).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    const pan = 10;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.add(rect);

    canvas.viewportCenterObject(rect);
    expect(rect.getCenterPoint().y).toBe(canvas.height / 2);
    expect(rect.getCenterPoint().x).toBe(canvas.width / 2);

    canvas.setZoom(2);
    canvas.viewportCenterObject(rect);
    expect(rect.getCenterPoint().y).toBe(
      canvas.height / (2 * canvas.getZoom()),
    );
    expect(rect.getCenterPoint().x).toBe(canvas.width / (2 * canvas.getZoom()));

    canvas.absolutePan(new Point(pan, pan));
    canvas.viewportCenterObject(rect);
    expect(rect.getCenterPoint().y).toBe(
      (canvas.height / 2 + pan) / canvas.getZoom(),
    );
    expect(rect.getCenterPoint().x).toBe(
      (canvas.width / 2 + pan) / canvas.getZoom(),
    );
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  });

  it('generates SVG correctly', () => {
    expect(canvas.toSVG).toBeTypeOf('function');
    canvas.clear();
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    const svg = canvas.toSVG();
    expect(svg).toEqualSVG(CANVAS_SVG);
  });

  it('supports different encodings in SVG (ISO-8859-1)', () => {
    expect(canvas.toSVG).toBeTypeOf('function');
    canvas.clear();
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    // @ts-expect-error -- TS2322: Type 'ISO-8859-1' is not assignable to type 'UTF-8, seems like types don't allow this encoding
    const svg = canvas.toSVG({ encoding: 'ISO-8859-1' });
    const svgDefaultEncoding = canvas.toSVG();
    expect(svg).not.toBe(svgDefaultEncoding);
    expect(svg).toEqualSVG(
      CANVAS_SVG.replace('encoding="UTF-8"', 'encoding="ISO-8859-1"'),
    );
  });

  it('can generate SVG without preamble', () => {
    expect(canvas.toSVG).toBeTypeOf('function');
    const withPreamble = canvas.toSVG();
    const withoutPreamble = canvas.toSVG({ suppressPreamble: true });
    expect(withPreamble).not.toBe(withoutPreamble);
    expect(withoutPreamble.slice(0, 4)).toBe('<svg');
  });

  it('generates SVG with viewBox', () => {
    expect(canvas.toSVG).toBeTypeOf('function');
    canvas.clear();

    const svg = canvas.toSVG({
      viewBox: { x: 100, y: 100, width: 300, height: 300 },
    });
    expect(svg).toEqualSVG(CANVAS_SVG_VIEWBOX);
  });

  it('handles reviver function for all objects', () => {
    expect(canvas.toSVG).toBeTypeOf('function');
    canvas.clear();

    const circle = new Circle();
    const rect = new Rect();
    const path1 = new Path('M 100 100 L 300 100 L 200 300 z');
    const tria = new Triangle();
    const polygon = new Polygon([
      { x: 10, y: 12 },
      { x: 20, y: 22 },
    ]);
    const polyline = new Polyline([
      { x: 10, y: 12 },
      { x: 20, y: 22 },
    ]);
    const line = new Line();
    const text = new FabricText('Text');
    const group = new Group([text, line]);
    const ellipse = new Ellipse();
    const image = createImageStub();
    const path2 = new Path('M 0 0 L 200 100 L 200 300 z');
    const path3 = new Path('M 50 50 L 100 300 L 400 400 z');
    const pathGroup = new Group([path2, path3]);

    canvas.renderOnAddRemove = false;
    canvas.add(
      circle,
      rect,
      path1,
      tria,
      polygon,
      polyline,
      group,
      ellipse,
      image,
      pathGroup,
    );

    let reviverCount = 0;

    function reviver(svg: string) {
      reviverCount++;
      return svg;
    }

    canvas.toSVG(undefined, reviver);
    expect(reviverCount).toBe(14);

    canvas.renderOnAddRemove = true;
  });

  it('handles reviver function with background and overlay images', () => {
    expect(canvas.toSVG).toBeTypeOf('function');
    canvas.clear();

    const circle = new Circle();
    const rect = new Rect();
    const path1 = new Path('M 100 100 L 300 100 L 200 300 z');
    const tria = new Triangle();
    const polygon = new Polygon([
      { x: 10, y: 12 },
      { x: 20, y: 22 },
    ]);
    const polyline = new Polyline([
      { x: 10, y: 12 },
      { x: 20, y: 22 },
    ]);
    const line = new Line();
    const text = new FabricText('Text');
    const group = new Group([text, line]);
    const ellipse = new Ellipse();
    const image = createImageStub();
    const imageBG = createImageStub();
    const imageOL = createImageStub();
    const path2 = new Path('M 0 0 L 200 100 L 200 300 z');
    const path3 = new Path('M 50 50 L 100 300 L 400 400 z');
    const pathGroup = new Group([path2, path3]);

    canvas.renderOnAddRemove = false;
    canvas.add(
      circle,
      rect,
      path1,
      tria,
      polygon,
      polyline,
      group,
      ellipse,
      image,
      pathGroup,
    );
    canvas.backgroundImage = imageBG;
    canvas.overlayImage = imageOL;

    let reviverCount = 0;
    const len = canvas.size() + group.size() + pathGroup.size();

    function reviver(svg: string) {
      reviverCount++;
      return svg;
    }

    canvas.toSVG(undefined, reviver);
    expect(reviverCount).toBe(len + 2);

    canvas.backgroundImage = undefined;
    canvas.overlayImage = undefined;
    canvas.renderOnAddRemove = true;
  });

  it('excludes objects marked with excludeFromExport from SVG', () => {
    expect(canvas.toSVG).toBeTypeOf('function');
    canvas.clear();

    const circle = new Circle({ excludeFromExport: true });
    const rect = new Rect({ excludeFromExport: true });
    const path1 = new Path('M 100 100 L 300 100 L 200 300 z');
    const tria = new Triangle();
    const polygon = new Polygon([
      { x: 10, y: 12 },
      { x: 20, y: 22 },
    ]);
    const polyline = new Polyline([
      { x: 10, y: 12 },
      { x: 20, y: 22 },
    ]);
    const line = new Line();
    const text = new FabricText('Text');
    const group = new Group([text, line]);
    const ellipse = new Ellipse();
    const image = createImageStub();
    const path2 = new Path('M 0 0 L 200 100 L 200 300 z');
    const path3 = new Path('M 50 50 L 100 300 L 400 400 z');
    const pathGroup = new Group([path2, path3]);

    canvas.renderOnAddRemove = false;
    canvas.add(
      circle,
      rect,
      path1,
      tria,
      polygon,
      polyline,
      group,
      ellipse,
      image,
      pathGroup,
    );

    let reviverCount = 0;
    const len = canvas.size() + group.size() + pathGroup.size();

    function reviver(svg: string) {
      reviverCount++;
      return svg;
    }

    canvas.toSVG(undefined, reviver);
    expect(reviverCount).toBe(len - 2);

    canvas.renderOnAddRemove = true;
  });

  it('correctly includes clipPath in SVG output', () => {
    const canvasClip = new StaticCanvas(undefined, {
      width: 400,
      height: 400,
      renderOnAddRemove: false,
    });
    canvasClip.clipPath = new Rect({
      left: 100.5,
      top: 100.5,
      width: 200,
      height: 200,
    });
    canvasClip.add(new Circle({ left: 200.5, top: 200.5, radius: 200 }));

    const svg = canvasClip.toSVG();

    expect(sanitizeSVG(svg)).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="400" height="400" viewBox="0 0 400 400" xml:space="preserve">
      <desc>Created with Fabric.js ${version}</desc>
      <defs>
      <clipPath id="SVGID" >
      	<rect transform="matrix(1 0 0 1 100.5 100.5)" x="-100" y="-100" rx="0" ry="0" width="200" height="200" />
      </clipPath>
      </defs>
      <g clip-path="url(#SVGID)" >
      <g transform="matrix(1 0 0 1 200.5 200.5)"  >
      <circle style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" r="200" />
      </g>
      </g>
      </svg>"
    `);
  });

  it('handles excludeFromExport for background and overlay images', () => {
    const imageBG = createImageStub();
    const imageOL = createImageStub();

    canvas.renderOnAddRemove = false;
    canvas.backgroundImage = imageBG;
    canvas.overlayImage = imageOL;

    const expectedSVG =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="200" height="200" viewBox="0 0 200 200" xml:space="preserve">\n<desc>Created with Fabric.js ' +
      version +
      '</desc>\n<defs>\n</defs>\n<g transform="matrix(1 0 0 1 0 0)"  >\n\t<image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="" x="0" y="0" width="0" height="0"></image>\n</g>\n<g transform="matrix(1 0 0 1 0 0)"  >\n\t<image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  xlink:href="" x="0" y="0" width="0" height="0"></image>\n</g>\n</svg>';

    const svg1 = canvas.toSVG();
    expect(svg1).toEqualSVG(expectedSVG);

    imageBG.excludeFromExport = true;
    imageOL.excludeFromExport = true;

    const expectedSVG2 =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="200" height="200" viewBox="0 0 200 200" xml:space="preserve">\n<desc>Created with Fabric.js ' +
      version +
      '</desc>\n<defs>\n</defs>\n</svg>';

    const svg2 = canvas.toSVG();
    expect(svg2).toEqualSVG(expectedSVG2);

    canvas.backgroundImage = undefined;
    canvas.overlayImage = undefined;
    canvas.renderOnAddRemove = true;
  });

  it('converts canvas to JSON correctly', () => {
    expect(canvas.toJSON).toBeTypeOf('function');
    expect(JSON.stringify(canvas)).toBe(
      JSON.stringify({ version: version, objects: [] }),
    );

    canvas.backgroundColor = '#ff5555';
    canvas.overlayColor = 'rgba(0,0,0,0.2)';
    expect(canvas.toJSON()).toEqual({
      version: version,
      objects: [],
      background: '#ff5555',
      overlay: 'rgba(0,0,0,0.2)',
    });

    canvas.add(makeRect());
    expect(canvas.toJSON()).toEqual(RECT_JSON);
  });

  it('handles custom properties in toObject correctly', () => {
    const rect = new Rect({ width: 10, height: 20 });
    rect.padding = 123;
    canvas.add(rect);
    // @ts-expect-error -- custom prop
    rect.foo = 'bar';

    // @ts-expect-error -- custom prop
    canvas.bar = 456;

    const data = canvas.toObject(['padding', 'foo', 'bar', 'baz']);
    expect('padding' in data.objects[0]).toBeTruthy();
    expect('foo' in data.objects[0]).toBeTruthy();
    expect('bar' in data.objects[0]).toBeFalsy();
    expect('baz' in data.objects[0]).toBeFalsy();
    expect('foo' in data).toBeFalsy();
    expect('baz' in data).toBeFalsy();
    expect('bar' in data).toBeTruthy();
  });

  it('serializes backgroundImage to JSON correctly', async () => {
    canvas.backgroundImage = await createImageObject();

    const json = canvas.toJSON();

    fixImageDimension(json.backgroundImage);
    expect(json.backgroundImage).toSameImageObject(REFERENCE_IMG_OBJECT);

    canvas.backgroundImage = undefined;
  });

  it('includes custom props for backgroundImage when specified', async () => {
    const image = await createImageObject();
    canvas.backgroundImage = image;
    // @ts-expect-error -- custom prop
    image.custom = 'yes';

    const json = canvas.toObject(['custom']);

    expect(json.backgroundImage.custom).toBe('yes');

    canvas.backgroundImage = undefined;
  });

  it('serializes overlayImage to JSON correctly', async () => {
    canvas.overlayImage = await createImageObject();

    const json = canvas.toJSON();

    fixImageDimension(json.overlayImage);
    expect(json.overlayImage).toSameImageObject(REFERENCE_IMG_OBJECT);

    canvas.overlayImage = undefined;
  });

  it('includes custom props for overlayImage when specified', async () => {
    const image = await createImageObject();
    canvas.overlayImage = image;
    // @ts-expect-error -- custom prop
    image.custom = 'yes';

    const json = canvas.toObject(['custom']);

    expect(json.overlayImage.custom).toBe('yes');

    canvas.overlayImage = undefined;
  });

  it('generates dataless JSON correctly', () => {
    const path = new Path('M 100 100 L 300 100 L 200 300 z', {
      sourcePath: 'http://example.com/',
    });
    canvas.add(path);

    expect(canvas.toDatalessJSON()).toEqual(PATH_DATALESS_JSON);
  });

  it('serializes to object correctly', () => {
    expect(canvas.toObject).toBeTypeOf('function');

    const expectedObject = {
      version: version,
      objects: canvas.getObjects(),
    };

    expect(canvas.toObject()).toEqual(expectedObject);

    const rect = makeRect();
    canvas.add(rect);

    // @ts-expect-error -- constructor function has type
    expect(canvas.toObject().objects[0].type).toBe(rect.constructor.type);
  });

  it('respects includeDefaultValues setting', () => {
    canvas.includeDefaultValues = false;
    const rect = makeRect();
    canvas.add(rect);

    const cObject = canvas.toObject();
    const expectedRect = {
      version: version,
      type: 'Rect',
      width: 10,
      height: 10,
      top: 0,
      left: 0,
    };

    expect(cObject.objects[0]).toEqual(expectedRect);

    canvas.includeDefaultValues = true;
  });

  it('respects excludeFromExport setting', () => {
    const rect = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();
    const clipPath = makeRect();

    canvas.clear();
    canvas.add(rect, rect2, rect3);
    canvas.clipPath = clipPath;

    let canvasObj = canvas.toObject();
    expect(canvasObj.objects.length).toBe(3);
    expect(canvasObj.clipPath).toEqual(clipPath.toObject());

    rect.excludeFromExport = true;
    rect2.excludeFromExport = true;
    clipPath.excludeFromExport = true;

    canvasObj = canvas.toObject();
    expect(canvasObj.objects.length).toBe(1);
    expect(canvasObj.clipPath).toBeUndefined();
  });

  it('respects excludeFromExport for background and overlay elements', () => {
    const rect = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();
    const bgColor = new Gradient({
      type: 'linear',
      colorStops: [
        { offset: 0, color: 'black' },
        { offset: 1, color: 'white' },
      ],
      coords: {
        x1: 0,
        x2: 300,
        y1: 0,
        y2: 0,
      },
    });

    canvas.clear();
    canvas.backgroundImage = rect;
    canvas.overlayImage = rect2;
    canvas.backgroundColor = bgColor;
    canvas.overlayColor = 'red';
    canvas.add(rect3);

    const rectToObject = rect.toObject();
    const rect2ToObject = rect2.toObject();
    const bgc2ToObject = bgColor.toObject();
    let canvasToObject = canvas.toObject();

    expect(canvasToObject.backgroundImage).toEqual(rectToObject);
    expect(canvasToObject.overlayImage).toEqual(rect2ToObject);
    expect(canvasToObject.background).toEqual(bgc2ToObject);
    expect(canvasToObject.overlay).toBe('red');

    rect.excludeFromExport = true;
    rect2.excludeFromExport = true;
    bgColor.excludeFromExport = true;

    canvasToObject = canvas.toObject();
    expect(canvasToObject.backgroundImage).toBeUndefined();
    expect(canvasToObject.overlayImage).toBeUndefined();
    expect(canvasToObject.background).toBeUndefined();
  });

  it('generates dataless object representation', () => {
    expect(canvas.toDatalessObject).toBeTypeOf('function');

    const expectedObject = {
      version: version,
      objects: canvas.getObjects(),
    };

    expect(canvas.toDatalessObject()).toEqual(expectedObject);

    const rect = makeRect();
    canvas.add(rect);

    // @ts-expect-error -- constructor function has the type
    expect(canvas.toObject().objects[0].type).toBe(rect.constructor.type);
    // TODO (kangax): need to test this method with fabric.Path to ensure that path is not populated
  });

  it('includes additional properties in object representation when specified', () => {
    // @ts-expect-error -- custom prop
    canvas.freeDrawingColor = 'red';
    // @ts-expect-error -- custom prop
    canvas.foobar = 123;

    const expectedObject = {
      version: version,
      objects: canvas.getObjects(),
      freeDrawingColor: 'red',
      foobar: 123,
    };

    expect(canvas.toObject(['freeDrawingColor', 'foobar'])).toEqual(
      expectedObject,
    );

    const rect = makeRect();
    // @ts-expect-error -- custom prop
    rect.foobar = 456;
    canvas.add(rect);

    expect('foobar' in canvas.toObject(['smthelse']).objects[0]).toBeFalsy();
    expect('foobar' in canvas.toObject(['foobar']).objects[0]).toBeTruthy();
  });

  it('correctly reports if canvas is empty', () => {
    expect(canvas.isEmpty).toBeTypeOf('function');
    expect(canvas.isEmpty()).toBeTruthy();

    canvas.add(makeRect());
    expect(canvas.isEmpty()).toBeFalsy();
  });

  it('loads from JSON string correctly', async () => {
    expect(canvas.loadFromJSON).toBeTypeOf('function');

    await canvas.loadFromJSON(PATH_JSON);
    expect(canvas).not.toHaveProperty('objects');
    const obj = canvas.item(0);

    expect(canvas.isEmpty()).toBeFalsy();
    // @ts-expect-error -- constructor function has type
    expect(obj.constructor.type).toBe('Path');
    expect(canvas.backgroundColor).toBe('#ff5555');

    expect(obj.get('left')).toBe(268);
    expect(obj.get('top')).toBe(266);
    expect(obj.get('width')).toBe(49.803999999999995);
    expect(obj.get('height')).toBe(48.027);
    expect(obj.get('fill')).toBe('rgb(0,0,0)');
    expect(obj.get('stroke')).toBeNull();
    expect(obj.get('strokeWidth')).toBe(1);
    expect(obj.get('scaleX')).toBe(1);
    expect(obj.get('scaleY')).toBe(1);
    expect(obj.get('angle')).toBe(0);
    expect(obj.get('flipX')).toBe(false);
    expect(obj.get('flipY')).toBe(false);
    expect(obj.get('opacity')).toBe(1);
    expect(obj.get('path').length).toBeGreaterThan(0);
  });

  it('loads from JSON object correctly', async () => {
    expect(canvas.loadFromJSON).toBeTypeOf('function');

    await canvas.loadFromJSON(PATH_JSON);
    const obj = canvas.item(0);

    expect(canvas.isEmpty()).toBeFalsy();
    // @ts-expect-error -- constructor function has type
    expect(obj.constructor.type).toBe('Path');
    expect(canvas.backgroundColor).toBe('#ff5555');
    expect(canvas.overlayColor).toBe('rgba(0,0,0,0.2)');

    expect(obj.get('left')).toBe(268);
    expect(obj.get('top')).toBe(266);
    expect(obj.get('width')).toBe(49.803999999999995);
    expect(obj.get('height')).toBe(48.027);
    expect(obj.get('fill')).toBe('rgb(0,0,0)');
    expect(obj.get('stroke')).toBeNull();
    expect(obj.get('strokeWidth')).toBe(1);
    expect(obj.get('scaleX')).toBe(1);
    expect(obj.get('scaleY')).toBe(1);
    expect(obj.get('angle')).toBe(0);
    expect(obj.get('flipX')).toBe(false);
    expect(obj.get('flipY')).toBe(false);
    expect(obj.get('opacity')).toBe(1);
    expect(obj.get('path').length).toBeGreaterThan(0);
  });

  it('loads from JSON object without defaults correctly', async () => {
    expect(canvas.loadFromJSON).toBeTypeOf('function');

    await canvas.loadFromJSON(PATH_WITHOUT_DEFAULTS_JSON);
    const obj = canvas.item(0);

    expect(canvas.isEmpty()).toBeFalsy();
    // @ts-expect-error -- constructor function has type
    expect(obj.constructor.type).toBe('Path');
    expect(canvas.backgroundColor).toBe('#ff5555');
    expect(canvas.overlayColor).toBe('rgba(0,0,0,0.2)');

    expect(obj.get('left')).toBe(268);
    expect(obj.get('top')).toBe(266);
    expect(obj.get('width')).toBe(49.803999999999995);
    expect(obj.get('height')).toBe(48.027);
    expect(obj.get('fill')).toBe('rgb(0,0,0)');
    expect(obj.get('stroke')).toBeNull();
    expect(obj.get('strokeWidth')).toBe(1);
    expect(obj.get('scaleX')).toBe(1);
    expect(obj.get('scaleY')).toBe(1);
    expect(obj.get('angle')).toBe(0);
    expect(obj.get('flipX')).toBe(false);
    expect(obj.get('flipY')).toBe(false);
    expect(obj.get('opacity')).toBe(1);
    expect(obj.get('path').length).toBeGreaterThan(0);
  });

  it('loads JSON with image background correctly', async () => {
    const serialized = JSON.parse(JSON.stringify(PATH_JSON));
    serialized.background = 'green';
    serialized.backgroundImage = {
      type: 'image',
      originX: 'left',
      originY: 'top',
      left: 13.6,
      top: -1.4,
      width: 3000,
      height: 3351,
      fill: 'rgb(0,0,0)',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      scaleX: 0.05,
      scaleY: 0.05,
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      src: IMG_SRC,
      filters: [],
      crossOrigin: '',
    };

    await canvas.loadFromJSON(serialized);

    expect(canvas.isEmpty()).toBeFalsy();
    expect(canvas.backgroundColor).toBe('green');
    expect(canvas.backgroundImage).toBeInstanceOf(FabricImage);
  });

  it('handles AbortController signal when loading JSON', async () => {
    const serialized = JSON.parse(JSON.stringify(PATH_JSON));
    serialized.background = 'green';
    serialized.backgroundImage = {
      type: 'image',
      originX: 'left',
      originY: 'top',
      left: 13.6,
      top: -1.4,
      width: 3000,
      height: 3351,
      fill: 'rgb(0,0,0)',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      scaleX: 0.05,
      scaleY: 0.05,
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      src: IMG_SRC,
      filters: [],
      crossOrigin: '',
    };

    const abortController = new AbortController();

    try {
      const promise = canvas.loadFromJSON(serialized, undefined, {
        signal: abortController.signal,
      });
      abortController.abort();
      await promise;
      // Should not reach here
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toHaveProperty('type', 'abort');
    }
  });

  it('preserves custom properties when loading from JSON', async () => {
    const rect = new Rect({ width: 10, height: 20 });
    rect.padding = 123;
    // @ts-expect-error -- custom prop
    rect.foo = 'bar';

    canvas.add(rect);

    const jsonWithoutFoo = canvas.toObject(['padding']);
    const jsonWithFoo = canvas.toObject(['padding', 'foo']);

    expect(jsonWithFoo).toEqual(
      JSON.parse(JSON.stringify(RECT_JSON_WITH_PADDING)),
    );
    expect(jsonWithoutFoo).not.toEqual(
      JSON.parse(JSON.stringify(RECT_JSON_WITH_PADDING)),
    );

    canvas.clear();
    await canvas.loadFromJSON(jsonWithFoo);

    const obj = canvas.item(0);

    expect(obj.padding).toBe(123);
    expect(obj).toHaveProperty('foo', 'bar');
  });

  it('loads text objects correctly from JSON', async () => {
    const json =
      '{"objects":[{"type":"Text","left":150,"top":200,"width":128,"height":64.32,"fill":"#000000","stroke":"","strokeWidth":"","scaleX":0.8,"scaleY":0.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"text":"NAME HERE","fontSize":24,"fontWeight":"normal","fontFamily":"Delicious_500","fontStyle":"normal","lineHeight":"","textDecoration":"","textAlign":"center","path":"","strokeStyle":"","backgroundColor":""}],"background":"#ffffff"}';

    await canvas.loadFromJSON(json);
    canvas.renderAll();

    // @ts-expect-error -- constructor function has type property
    expect(canvas.item(0).constructor.type).toBe('Text');
    expect(canvas.item(0).left).toBe(150);
    expect(canvas.item(0).top).toBe(200);
    expect(canvas.item(0)).toHaveProperty('text', 'NAME HERE');
  });

  it('loads clipPath correctly from JSON', async () => {
    const canvas3 = new StaticCanvas();
    const json =
      '{"clipPath": {"type":"Text","left":150,"top":200,"width":128,"height":64.32,"fill":"#000000","stroke":"","strokeWidth":"","scaleX":0.8,"scaleY":0.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"text":"NAME HERE","fontSize":24,"fontWeight":"normal","fontFamily":"Delicious_500","fontStyle":"normal","lineHeight":"","textDecoration":"","textAlign":"center","path":"","strokeStyle":"","backgroundColor":""}}';

    await canvas3.loadFromJSON(json);

    expect(canvas3.clipPath).toBeInstanceOf(FabricText);
    expect(canvas3.clipPath!.constructor).toHaveProperty('type', 'Text');
  });

  it('sends objects to the back of the stack', () => {
    expect(canvas.sendObjectToBack).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.sendObjectToBack(rect3);
    expect(canvas.item(0)).toBe(rect3);

    canvas.sendObjectToBack(rect2);
    expect(canvas.item(0)).toBe(rect2);

    canvas.sendObjectToBack(rect2);
    expect(canvas.item(0)).toBe(rect2);
  });

  it('brings objects to the front of the stack', () => {
    expect(canvas.bringObjectToFront).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.bringObjectToFront(rect1);
    expect(canvas.item(2)).toBe(rect1);

    canvas.bringObjectToFront(rect2);
    expect(canvas.item(2)).toBe(rect2);

    canvas.bringObjectToFront(rect2);
    expect(canvas.item(2)).toBe(rect2);
  });

  it('sends objects backwards in the stack', () => {
    expect(canvas.sendObjectBackwards).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // [ 1, 2, 3 ]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.sendObjectBackwards(rect3);

    // moved 3 one level back — [1, 3, 2]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);

    canvas.sendObjectBackwards(rect3);

    // moved 3 one level back — [3, 1, 2]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(0)).toBe(rect3);

    canvas.sendObjectBackwards(rect3);

    // 3 stays at the deepEqual position — [2, 3, 1]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(0)).toBe(rect3);

    canvas.sendObjectBackwards(rect2);

    expect(canvas.item(2)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(0)).toBe(rect3);

    canvas.sendObjectBackwards(rect2);

    expect(canvas.item(2)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);

    canvas.sendObjectBackwards(rect1, true);

    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    rect1.set({ top: 100 });
    rect1.setCoords();
    canvas.sendObjectBackwards(rect1, true);

    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);
  });

  it('brings objects forward in the stack', () => {
    expect(canvas.bringObjectForward).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // initial position — [ 1, 2, 3 ]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.bringObjectForward(rect1);

    // 1 moves one way up — [ 2, 1, 3 ]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.bringObjectForward(rect1);

    // 1 moves one way up again — [ 2, 3, 1 ]
    expect(canvas.item(2)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);

    canvas.bringObjectForward(rect1);

    // 1 is already all the way on top and so doesn't change position — [ 2, 3, 1 ]
    expect(canvas.item(2)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);

    canvas.bringObjectForward(rect3);

    // 1 is already all the way on top and so doesn't change position — [ 2, 1, 3 ]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.bringObjectForward(rect2, true);
    // [ 1, 2, 3 ]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    rect2.set({ left: 200 });
    rect2.setCoords();
    canvas.bringObjectForward(rect2, true);

    // rect2, rect3 do not overlap
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);
  });

  it('moves objects to specific positions in the stack', () => {
    expect(canvas.moveObjectTo).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // [ 1, 2, 3 ]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.moveObjectTo(rect3, 0);

    // moved 3 to level 0 — [3, 1, 2]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(0)).toBe(rect3);

    canvas.moveObjectTo(rect3, 1);

    // moved 3 to level 1 — [1, 3, 2]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);

    canvas.moveObjectTo(rect3, 2);

    // moved 3 to level 2 — [1, 2, 3]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.moveObjectTo(rect3, 2);

    // moved 3 to same level 2 and so doesn't change position — [1, 2, 3]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.moveObjectTo(rect2, 0);

    // moved 2 to level 0 — [2, 1, 3]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.moveObjectTo(rect2, 2);

    // moved 2 to level 2 — [1, 3, 2]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);
  });

  it('accesses items by index', () => {
    expect(canvas.item).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();

    canvas.add(rect1, rect2);

    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);

    canvas.remove(canvas.item(0));

    expect(canvas.item(0)).toBe(rect2);
  });

  it('calculates complexity correctly', () => {
    expect(canvas.complexity).toBeTypeOf('function');
    expect(canvas.complexity()).toBe(0);

    canvas.add(makeRect());
    expect(canvas.complexity()).toBe(1);

    canvas.add(makeRect(), makeRect());
    expect(canvas.complexity()).toBe(3);
  });

  it('provides string representation', () => {
    expect(canvas.toString).toBeTypeOf('function');

    expect(canvas.toString()).toBe('#<Canvas (0): { objects: 0 }>');

    canvas.add(makeRect());
    expect(canvas.toString()).toBe('#<Canvas (1): { objects: 1 }>');
  });

  it('clones canvas with all objects', async () => {
    const canvas2 = new StaticCanvas(undefined, {
      renderOnAddRemove: false,
      width: 10,
      height: 10,
    });
    expect(canvas.clone).toBeTypeOf('function');

    const rect = new Rect();
    canvas2.add(rect);

    const cloned = await canvas2.clone([]);

    expect(cloned).toBeInstanceOf(StaticCanvas);
    // check regression
    expect(cloned instanceof Canvas).toBeFalsy();

    const clonedRect = cloned.getObjects()[0];
    expect(clonedRect.constructor).toHaveProperty('type', 'Rect');
    expect(clonedRect.width).toBe(rect.width);
    expect(cloned.width).toBe(canvas2.width);
  });

  it('clones canvas without data', () => {
    const canvas2 = new StaticCanvas(undefined, {
      renderOnAddRemove: false,
      width: 10,
      height: 10,
    });
    expect(canvas.clone).toBeTypeOf('function');

    const rect = new Rect();
    canvas2.add(rect);
    canvas2.backgroundColor = 'red';

    const cloned = canvas2.cloneWithoutData();

    expect(cloned).toBeInstanceOf(StaticCanvas);

    const clonedObjects = cloned.getObjects();
    expect(clonedObjects.length).toBe(0);
    expect(cloned.width).toBe(canvas2.width);
    expect(cloned.backgroundColor).not.toBe('red');
  });

  it('gets and sets width', () => {
    expect(canvas.getWidth).toBeTypeOf('function');
    expect(canvas.getWidth()).toBe(200);

    canvas.setDimensions({ width: 444 });
    expect(canvas.getWidth()).toBe(444);
    expect(canvas.lowerCanvasEl.style.width).toBe('444px');
  });

  it('gets and sets height', () => {
    expect(canvas.getHeight).toBeTypeOf('function');
    expect(canvas.getHeight()).toBe(200);

    canvas.setDimensions({ height: 765 });
    expect(canvas.getHeight()).toBe(765);
    expect(canvas.lowerCanvasEl.style.height).toBe('765px');
  });

  it('supports css-only width setting', () => {
    canvas.setDimensions({ width: 123 });
    canvas.setDimensions({ width: '100%' }, { cssOnly: true });

    expect(canvas.lowerCanvasEl.style.width).toBe('100%');
    expect(canvas.getWidth()).toBe(123);
  });

  it('supports css-only height setting', () => {
    canvas.setDimensions({ height: 123 });
    canvas.setDimensions({ height: '100%' }, { cssOnly: true });

    expect(canvas.lowerCanvasEl.style.height).toBe('100%');
    expect(canvas.getHeight()).toBe(123);
  });

  it('supports css-only dimension setting', () => {
    canvas.setDimensions({ width: 200, height: 200 });
    canvas.setDimensions(
      { width: '250px', height: '350px' },
      { cssOnly: true },
    );

    expect(canvas.lowerCanvasEl.style.width).toBe('250px');
    expect(canvas.lowerCanvasEl.style.height).toBe('350px');
    expect(canvas.getWidth()).toBe(200);
    expect(canvas.getHeight()).toBe(200);
  });

  it('supports backstore-only width setting', () => {
    canvas.setDimensions({ width: 123 });
    canvas.setDimensions({ width: 500 }, { backstoreOnly: true });

    expect(canvas.lowerCanvasEl.style.width).toBe('123px');
    expect(canvas.getWidth()).toBe(500);
  });

  it('supports backstore-only height setting', () => {
    canvas.setDimensions({ height: 123 });
    canvas.setDimensions({ height: 500 }, { backstoreOnly: true });

    expect(canvas.lowerCanvasEl.style.height).toBe('123px');
    expect(canvas.getHeight()).toBe(500);
  });

  it('supports backstore-only dimension setting', () => {
    canvas.setDimensions({ width: 200, height: 200 });
    canvas.setDimensions({ width: 250, height: 350 }, { backstoreOnly: true });

    expect(canvas.lowerCanvasEl.style.width).toBe('200px');
    expect(canvas.lowerCanvasEl.style.height).toBe('200px');
    expect(canvas.getWidth()).toBe(250);
    expect(canvas.getHeight()).toBe(350);

    canvas.cancelRequestedRender();
  });

  it.skip('removes objects with animation', async () => {
    // @ts-expect-error -- unknown prop
    expect(canvas.fxRemove).toBeTypeOf('function');

    const rect = new Rect();
    canvas.add(rect);

    let callbackFired = false;

    return new Promise<void>((resolve) => {
      function onComplete() {
        callbackFired = true;
        expect(canvas.item(0)).toBeUndefined();
        expect(callbackFired).toBeTruthy();
        canvas.cancelRequestedRender();
        resolve();
      }

      expect(canvas.item(0)).toBe(rect);
      // @ts-expect-error -- unknown prop
      expect(canvas.fxRemove(rect, { onComplete }).abort).toBeTypeOf(
        'function',
      );
    });
  });

  it('sets viewport transform correctly', () => {
    expect(canvas.setViewportTransform).toBeTypeOf('function');

    const vpt = [2, 0, 0, 2, 50, 50] as TMat2D;
    canvas.viewportTransform = StaticCanvas.getDefaults().viewportTransform;

    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, 0, 0]);

    canvas.setViewportTransform(vpt);
    expect(canvas.viewportTransform).toEqual(vpt);

    canvas.viewportTransform = StaticCanvas.getDefaults().viewportTransform;
  });

  it('gets zoom level correctly', () => {
    expect(canvas.getZoom).toBeTypeOf('function');

    const vpt = [2, 0, 0, 2, 50, 50] as TMat2D;
    canvas.viewportTransform = StaticCanvas.getDefaults().viewportTransform;

    expect(canvas.getZoom()).toBe(1);

    canvas.setViewportTransform(vpt);
    expect(canvas.getZoom()).toBe(2);

    canvas.viewportTransform = StaticCanvas.getDefaults().viewportTransform;
  });

  it('sets zoom level correctly', () => {
    expect(canvas.setZoom).toBeTypeOf('function');

    expect(canvas.getZoom()).toBe(1);

    canvas.setZoom(2);
    expect(canvas.getZoom()).toBe(2);

    canvas.viewportTransform = StaticCanvas.getDefaults().viewportTransform;
  });

  it('zooms to specific point correctly', () => {
    expect(canvas.zoomToPoint).toBeTypeOf('function');
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, 0, 0]);

    const point = new Point(50, 50);

    canvas.zoomToPoint(point, 1);
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, 0, 0]);

    canvas.zoomToPoint(point, 2);
    expect(canvas.viewportTransform).toEqual([2, 0, 0, 2, -50, -50]);

    canvas.zoomToPoint(point, 3);
    expect(canvas.viewportTransform).toEqual([3, 0, 0, 3, -100, -100]);

    canvas.viewportTransform = StaticCanvas.getDefaults().viewportTransform;
  });

  it('applies absolute panning correctly', () => {
    expect(canvas.absolutePan).toBeTypeOf('function');
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, 0, 0]);

    const point = new Point(50, 50);

    canvas.absolutePan(point);
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, -point.x, -point.y]);

    canvas.absolutePan(point);
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, -point.x, -point.y]);

    canvas.viewportTransform = StaticCanvas.getDefaults().viewportTransform;
  });

  it('applies relative panning correctly', () => {
    expect(canvas.relativePan).toBeTypeOf('function');
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, 0, 0]);

    const point = new Point(-50, -50);

    canvas.relativePan(point);
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, -50, -50]);

    canvas.relativePan(point);
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, -100, -100]);

    canvas.viewportTransform = StaticCanvas.getDefaults().viewportTransform;
  });

  it('gets canvas context correctly', () => {
    expect(canvas.getContext).toBeTypeOf('function');

    const context = canvas.getContext();
    expect(context).toBe(canvas.contextContainer);
  });

  it('calculates viewport boundaries correctly', () => {
    expect(canvas.calcViewportBoundaries).toBeTypeOf('function');
    canvas.calcViewportBoundaries();

    expect(canvas.vptCoords.tl).toEqual(new Point(0, 0));
    expect(canvas.vptCoords.tr).toEqual(new Point(canvas.getWidth(), 0));
    expect(canvas.vptCoords.bl).toEqual(new Point(0, canvas.getHeight()));
    expect(canvas.vptCoords.br).toEqual(
      new Point(canvas.getWidth(), canvas.getHeight()),
    );
  });

  it('calculates viewport boundaries correctly with zoom', () => {
    expect(canvas.calcViewportBoundaries).toBeTypeOf('function');
    canvas.setViewportTransform([2, 0, 0, 2, 0, 0]);

    expect(canvas.vptCoords.tl).toEqual(new Point(0, 0));
    expect(canvas.vptCoords.tr).toEqual(new Point(canvas.getWidth() / 2, 0));
    expect(canvas.vptCoords.bl).toEqual(new Point(0, canvas.getHeight() / 2));
    expect(canvas.vptCoords.br).toEqual(
      new Point(canvas.getWidth() / 2, canvas.getHeight() / 2),
    );
  });

  it('calculates viewport boundaries correctly with zoom and translation', () => {
    expect(canvas.calcViewportBoundaries).toBeTypeOf('function');
    canvas.setViewportTransform([2, 0, 0, 2, -60, 60]);

    expect(canvas.vptCoords.tl).toEqual(new Point(30, -30));
    expect(canvas.vptCoords.tr).toEqual(
      new Point(30 + canvas.getWidth() / 2, -30),
    );
    expect(canvas.vptCoords.bl).toEqual(
      new Point(30, canvas.getHeight() / 2 - 30),
    );
    expect(canvas.vptCoords.br).toEqual(
      new Point(30 + canvas.getWidth() / 2, canvas.getHeight() / 2 - 30),
    );
  });

  it('calculates viewport boundaries correctly with flipped zoom and translation', () => {
    expect(canvas.calcViewportBoundaries).toBeTypeOf('function');
    canvas.setViewportTransform([2, 0, 0, -2, -60, 60]);
    canvas.calcViewportBoundaries();

    expect({ x: canvas.vptCoords.tl.x, y: canvas.vptCoords.tl.y }).toEqual({
      x: 30,
      y: -70,
    });
    expect({ x: canvas.vptCoords.tr.x, y: canvas.vptCoords.tr.y }).toEqual({
      x: 130,
      y: -70,
    });
    expect({ x: canvas.vptCoords.bl.x, y: canvas.vptCoords.bl.y }).toEqual({
      x: 30,
      y: 30,
    });
    expect({ x: canvas.vptCoords.br.x, y: canvas.vptCoords.br.y }).toEqual({
      x: 130,
      y: 30,
    });
  });

  it('handles retina scaling correctly', () => {
    canvas.enableRetinaScaling = true;
    config.configure({ devicePixelRatio: 1 });
    let scaling = canvas.getRetinaScaling();
    expect(scaling).toBe(1);

    config.configure({ devicePixelRatio: 2 });
    scaling = canvas.getRetinaScaling();
    expect(scaling).toBe(2);

    config.configure({ devicePixelRatio: 2 });
    canvas.enableRetinaScaling = false;
    scaling = canvas.getRetinaScaling();
    expect(scaling).toBe(1);
  });

  it('provides Node.js stream methods when in Node environment', async () => {
    if (!isJSDOM()) {
      expect(true).toBeTruthy();
    } else {
      const { Canvas: FabricNodeCanvas } = await import('../../index.node');
      const canvas = new FabricNodeCanvas();
      expect(canvas.createPNGStream).toBeTypeOf('function');
      expect(canvas.createJPEGStream).toBeTypeOf('function');
    }
  });

  it('exports SVG with background color', () => {
    const canvas2 = new StaticCanvas();
    canvas2.backgroundColor = 'red';
    const svg = canvas2.toSVG();

    const expectedSVG =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="300" height="150" viewBox="0 0 300 150" xml:space="preserve">\n<desc>Created with Fabric.js ' +
      version +
      '</desc>\n<defs>\n</defs>\n<rect x="0" y="0" width="100%" height="100%" fill="red"></rect>\n</svg>';

    expect(svg).toEqualSVG(expectedSVG);
  });

  it('exports SVG with background, zoom and svgViewportTransformation', () => {
    const canvas2 = new StaticCanvas();
    canvas2.backgroundColor = 'blue';
    canvas2.svgViewportTransformation = true;
    canvas2.viewportTransform = [3, 0, 0, 3, 60, 30];

    const svg = canvas2.toSVG();

    const expectedSVG =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="300" height="150" viewBox="-20 -10 100 50" xml:space="preserve">\n<desc>Created with Fabric.js ' +
      version +
      '</desc>\n<defs>\n</defs>\n<rect x="0" y="0" width="100%" height="100%" fill="blue"></rect>\n</svg>';

    expect(svg).toEqualSVG(expectedSVG);
  });

  it('exports SVG with background gradient', () => {
    const canvas2 = new StaticCanvas();
    canvas2.backgroundColor = new Gradient({
      type: 'linear',
      colorStops: [
        { offset: 0, color: 'black' },
        { offset: 1, color: 'white' },
      ],
      coords: {
        x1: 0,
        x2: 300,
        y1: 0,
        y2: 0,
      },
    });

    const svg = canvas2.toSVG();

    const expectedSVG =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="300" height="150" viewBox="0 0 300 150" xml:space="preserve">\n<desc>Created with Fabric.js ' +
      version +
      '</desc>\n<defs>\n<linearGradient id="SVGID_0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 0 0) matrix(1 0 0 1 -150 -75)"  x1="0" y1="0" x2="300" y2="0">\n<stop offset="0%" style="stop-color:black;"/>\n<stop offset="100%" style="stop-color:white;"/>\n</linearGradient>\n</defs>\n<rect transform="matrix(1 0 0 1 0 0) translate(150,75)" x="-150" y="-75" width="300" height="150" fill="url(#SVGID_0)"></rect>\n</svg>';

    expect(svg).toEqualSVG(expectedSVG);
  });

  it('exports SVG with background gradient and transforms', () => {
    const canvas2 = new StaticCanvas();
    canvas2.viewportTransform = [1, 2, 3, 4, 5, 6];
    canvas2.backgroundColor = new Gradient({
      type: 'linear',
      gradientTransform: [0.2, 0.3, 0.4, 0.5, -3, -5],
      colorStops: [
        { offset: 0, color: 'black' },
        { offset: 1, color: 'white' },
      ],
      coords: {
        x1: 0,
        x2: 300,
        y1: 0,
        y2: 0,
      },
    });
    const svg = canvas2.toSVG();
    const expectedSVG =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="300" height="150" viewBox="-5 -1.5 300 37.5" xml:space="preserve">\n<desc>Created with Fabric.js ' +
      version +
      '</desc>\n<defs>\n<linearGradient id="SVGID_0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 2 3 4 5 6) matrix(0.2 0.3 0.4 0.5 -153 -23.75)"  x1="0" y1="0" x2="300" y2="0">\n<stop offset="0%" style="stop-color:black;"/>\n<stop offset="100%" style="stop-color:white;"/>\n</linearGradient>\n</defs>\n<rect transform="matrix(-2 1 1.5 -0.5 1 -2) translate(150,75)" x="-150" y="-75" width="300" height="150" fill="url(#SVGID_0)"></rect>\n</svg>';

    expect(svg).toEqualSVG(expectedSVG);
  });

  it('exports SVG with background pattern', () => {
    const canvas2 = new StaticCanvas();

    const img = getFabricDocument().createElement('img');
    img.src = 'a.jpg';
    canvas2.backgroundColor = new Pattern({
      repeat: 'repeat',
      source: img,
    });

    const svg = canvas2.toSVG();

    const expectedSVG =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="300" height="150" viewBox="0 0 300 150" xml:space="preserve">\n<desc>Created with Fabric.js ' +
      version +
      '</desc>\n<defs>\n<pattern id="SVGID_0" x="0" y="0" width="0" height="0">\n<image x="0" y="0" width="0" height="0" xlink:href="' +
      img.src +
      '"></image>\n</pattern>\n</defs>\n<rect transform="matrix(1 0 0 1 0 0) translate(150,75)" x="-150" y="-75" width="300" height="150" fill="url(#SVGID_0)"></rect>\n</svg>';

    expect(svg).toEqualSVG(expectedSVG);
  });

  it('handles requestRenderAll and cancelRequestedRender correctly', () => {
    const canvas2 = new StaticCanvas();

    // @ts-expect-error -- protected member of the class
    expect(canvas2.nextRenderHandle).toBeUndefined();

    canvas2.requestRenderAll();
    // @ts-expect-error -- protected member of the class
    expect(canvas2.nextRenderHandle).not.toBe(0);

    canvas2.cancelRequestedRender();
    // @ts-expect-error -- protected member of the class
    expect(canvas2.nextRenderHandle).toBe(0);
  });

  // it('loads backgroundImage correctly', async () => {
  //   expect(canvas.backgroundImage).toBe('');
  //   canvas.setBackgroundImage('../../assets/pug.jpg');
  //
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   expect(typeof canvas.backgroundImage).toBe('object');
  //   expect(canvas.backgroundImage.src).toMatch(/pug\.jpg$/);
  // });
  //
  // it('loads overlayImage correctly', async () => {
  //   expect(canvas.overlayImage).toBeUndefined();
  //   canvas.setOverlayImage('../../assets/pug.jpg');
  //
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //
  //   expect(typeof canvas.overlayImage).toBe('object');
  //   expect(canvas.overlayImage.src).toMatch(/pug\.jpg$/);
  // });
});

function makeRect(options = {}) {
  const defaultOptions = { width: 10, height: 10 };
  return new Rect({ ...defaultOptions, ...options });
}

function createImageStub() {
  return new FabricImage(_createImageElement(), { width: 0, height: 0 });
}

function _createImageElement() {
  return getFabricDocument().createElement('img');
}

function _createImageObject(
  width: number,
  height: number,
  callback: (img: FabricImage) => void,
) {
  const elImage = _createImageElement();
  elImage.width = width;
  elImage.height = height;
  setSrc(elImage, IMG_SRC, function () {
    callback(new FabricImage(elImage, { left: width / 2, top: height / 2 }));
  });
}

function createImageObject(): Promise<FabricImage> {
  return new Promise<FabricImage>((resolve) => {
    _createImageObject(IMG_WIDTH, IMG_HEIGHT, resolve);
  });
}

function setSrc(img: HTMLImageElement, src: string, callback: () => void) {
  img.onload = function () {
    callback();
  };
  img.src = src;
}

function fixImageDimension(imgObj: HTMLImageElement) {
  // workaround for node-canvas sometimes producing images with width/height and sometimes not
  if (imgObj.width === 0) {
    imgObj.width = IMG_WIDTH;
  }
  if (imgObj.height === 0) {
    imgObj.height = IMG_HEIGHT;
  }
}
