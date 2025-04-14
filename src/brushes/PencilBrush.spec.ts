import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Canvas } from '../canvas/Canvas';
import { PencilBrush } from './PencilBrush';
import { parsePath } from '../util';
import type { TPointerEvent } from '../EventTypeDefs';
import { Path } from '../shapes/Path';
import { Point } from '../Point';

describe('PencilBrush', () => {
  let canvas: Canvas;

  beforeEach(() => {
    canvas = new Canvas();
  });

  afterEach(() => {
    canvas.cancelRequestedRender();
    canvas.off();
  });

  it('initializes constructor correctly', () => {
    expect(PencilBrush).toBeTruthy();
    const brush = new PencilBrush(canvas);
    expect(brush.canvas, 'assigns canvas').toBe(canvas);
    // @ts-expect-error -- protected
    expect(brush._points, 'points is an empty array').toEqual([]);
  });

  it('decimates points correctly', () => {
    const brush = new PencilBrush(canvas);
    const points = [
      new Point(1, 0),
      new Point(2, 0),
      new Point(3, 0),
      new Point(4, 0),
      new Point(5, 0),
    ];
    const distance = 6;
    const newPoints = brush.decimatePoints(points, distance);
    expect(newPoints[0], 'first point is always present').toBe(points[0]);
    expect(newPoints[1], 'last point is always present').toBe(
      points[points.length - 1],
    );
    expect(newPoints.length, 'All points removed except first and last').toBe(
      2,
    );
  });

  describe.each([true, false])(
    'with canvas.enableRetinaScaling = %s',
    (retinaScaling) => {
      beforeEach(() => {
        canvas.enableRetinaScaling = retinaScaling;
      });

      it('draws a point correctly', () => {
        const brush = new PencilBrush(canvas);
        const e = { target: canvas.upperCanvasEl } as unknown as TPointerEvent;
        const pointer = canvas.getScenePoint({
          ...e,
          clientX: 10,
          clientY: 10,
        });
        brush.onMouseDown(pointer, { e });
        // @ts-expect-error -- protected
        const pathData = brush.convertPointsToSVGPath(brush._points);
        expect(
          pathData,
          'path data create a small line that looks like a point',
        ).toEqual(parsePath('M 9.999 10 L 10.001 10'));
      });

      it('handles multiple coincident points', () => {
        const brush = new PencilBrush(canvas);
        const e = { target: canvas.upperCanvasEl } as unknown as TPointerEvent;
        const pointer = canvas.getScenePoint({
          ...e,
          clientX: 10,
          clientY: 10,
        });
        brush.onMouseDown(pointer, { e });
        brush.onMouseMove(pointer, { e });
        brush.onMouseMove(pointer, { e });
        brush.onMouseMove(pointer, { e });
        brush.onMouseMove(pointer, { e });
        // @ts-expect-error -- protected
        const pathData = brush.convertPointsToSVGPath(brush._points);
        expect(
          pathData,
          'path data create a small line that looks like a point',
        ).toEqual(parsePath('M 9.999 10 L 10.001 10'));
        // @ts-expect-error -- protected
        expect(brush._points.length, 'concident points are discarded').toBe(2);
      });

      it('handles multiple non-coincident points', () => {
        const brush = new PencilBrush(canvas);
        const e = { target: canvas.upperCanvasEl } as unknown as TPointerEvent;
        const pointer = canvas.getScenePoint({
          ...e,
          clientX: 10,
          clientY: 10,
        });
        const pointer2 = canvas.getScenePoint({
          ...e,
          clientX: 15,
          clientY: 15,
        });
        const pointer3 = canvas.getScenePoint({
          ...e,
          clientX: 20,
          clientY: 20,
        });
        brush.onMouseDown(pointer, { e });
        brush.onMouseMove(pointer2, { e });
        brush.onMouseMove(pointer3, { e });
        brush.onMouseMove(pointer2, { e });
        brush.onMouseMove(pointer3, { e });
        // @ts-expect-error -- protected
        const pathData = brush.convertPointsToSVGPath(brush._points);
        expect(pathData, 'path data create a complex path').toEqual(
          parsePath(
            'M 9.999 9.999 Q 10 10 12.5 12.5 Q 15 15 17.5 17.5 Q 20 20 17.5 17.5 Q 15 15 17.5 17.5 L 20.001 20.001',
          ),
        );
        // @ts-expect-error -- protected
        expect(brush._points.length, 'concident points are discarded').toBe(6);
      });

      it('handles points outside canvas', () => {
        const brush = new PencilBrush(canvas);
        const e = { target: canvas.upperCanvasEl } as unknown as TPointerEvent;
        const pointer = canvas.getScenePoint({
          ...e,
          clientX: 10,
          clientY: 10,
        });
        const pointer2 = canvas.getScenePoint({
          ...e,
          clientX: 15,
          clientY: 100,
        });
        const pointer3 = canvas.getScenePoint({
          ...e,
          clientX: 20,
          clientY: 160,
        });
        const pointer4 = canvas.getScenePoint({
          ...e,
          clientX: 320,
          clientY: 100,
        });
        const pointer5 = canvas.getScenePoint({
          ...e,
          clientX: 100,
          clientY: 100,
        });
        brush.onMouseDown(pointer, { e });
        brush.onMouseMove(pointer2, { e });
        brush.onMouseMove(pointer3, { e });
        brush.onMouseMove(pointer4, { e });
        brush.onMouseMove(pointer5, { e });
        // @ts-expect-error -- protected
        const pathData = brush.convertPointsToSVGPath(brush._points);
        expect(
          pathData,
          'path data create a path that goes beyond canvas',
        ).toEqual(
          parsePath(
            'M 9.999 9.999 Q 10 10 12.5 55 Q 15 100 17.5 130 Q 20 160 170 130 Q 320 100 210 100 L 99.999 100',
          ),
        );
        // @ts-expect-error -- protected
        expect(brush._points.length, 'all points are available').toBe(6);
      });

      it('limits points to canvas size when limitedToCanvasSize is true', () => {
        const brush = new PencilBrush(canvas);
        brush.limitedToCanvasSize = true;
        const e = { target: canvas.upperCanvasEl } as unknown as TPointerEvent;
        const pointer = canvas.getScenePoint({
          ...e,
          clientX: 10,
          clientY: 10,
        });
        const pointer2 = canvas.getScenePoint({
          ...e,
          clientX: 15,
          clientY: 100,
        });
        const pointer3 = canvas.getScenePoint({
          ...e,
          clientX: 20,
          clientY: 160,
        });
        const pointer4 = canvas.getScenePoint({
          ...e,
          clientX: 320,
          clientY: 100,
        });
        const pointer5 = canvas.getScenePoint({
          ...e,
          clientX: 100,
          clientY: 100,
        });
        brush.onMouseDown(pointer, { e });
        brush.onMouseMove(pointer2, { e });
        brush.onMouseMove(pointer3, { e });
        brush.onMouseMove(pointer4, { e });
        brush.onMouseMove(pointer5, { e });
        // @ts-expect-error -- protected
        const pathData = brush.convertPointsToSVGPath(brush._points);
        expect(
          pathData,
          'path data create a path that does not go beyond canvas',
        ).toEqual(
          parsePath(
            'M 9.999 9.999 Q 10 10 12.5 55 Q 15 100 57.5 100 L 100.001 100',
          ),
        );
        // @ts-expect-error -- protected
        expect(brush._points.length, '2 points have been discarded').toBe(4);
      });

      it('fires events and creates path on mouse up', () => {
        let fireBeforePathCreatedEvent = false;
        let firePathCreatedEvent = false;
        let added = null;

        canvas.on('before:path:created', () => {
          fireBeforePathCreatedEvent = true;
        });

        canvas.on('path:created', (opt) => {
          firePathCreatedEvent = true;
          added = opt.path;
        });

        const brush = new PencilBrush(canvas);
        const e = { target: canvas.upperCanvasEl } as unknown as TPointerEvent;
        const pointer = canvas.getScenePoint({
          ...e,
          clientX: 10,
          clientY: 10,
        });
        const pointer2 = canvas.getScenePoint({
          ...e,
          clientX: 15,
          clientY: 15,
        });
        const pointer3 = canvas.getScenePoint({
          ...e,
          clientX: 20,
          clientY: 20,
        });

        brush.onMouseDown(pointer, { e });
        brush.onMouseMove(pointer2, { e });
        brush.onMouseMove(pointer3, { e });
        brush.onMouseMove(pointer2, { e });
        brush.onMouseMove(pointer3, { e });
        brush.onMouseUp({ e });

        expect(
          fireBeforePathCreatedEvent,
          'before:path:created event is fired',
        ).toBe(true);
        expect(firePathCreatedEvent, 'path:created event is fired').toBe(true);
        expect(added, 'a path is added').toBeInstanceOf(Path);
        expect(added!.path).toMatchSnapshot();
        expect(added!.path.length, 'path has 6 steps').toBe(4);
      });
    },
  );
});
