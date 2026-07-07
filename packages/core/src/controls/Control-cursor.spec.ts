import { describe, expect, test, beforeAll } from 'vitest';
import { scaleSkewCursorStyleHandler } from './scaleSkew';
import { Group } from '../shapes/Group';
import { Canvas } from '../canvas/Canvas';
import { Rect } from '../shapes/Rect';
import { Point } from '../Point';
import type { TOCoord } from '../shapes/Object/InteractiveObject';
import type { TPointerEvent } from '../EventTypeDefs';

const points = [
  [new Point(0, 0), 'nw-resize'],
  [new Point(0, 50), 'w-resize'],
  [new Point(0, 100), 'sw-resize'],
  [new Point(50, 100), 's-resize'],
  [new Point(100, 100), 'se-resize'],
  [new Point(100, 50), 'e-resize'],
  [new Point(100, 0), 'ne-resize'],
  [new Point(50, 0), 'n-resize'],
] as const;

describe('fabric.controls.cursor', () => {
  let canvas: Canvas;
  let rect, groupRect: Rect;
  let group: Group;
  beforeAll(() => {
    canvas = new Canvas(undefined);
    rect = new Rect({ width: 100, height: 100, left: 50, top: 50 });
    groupRect = new Rect({ width: 100, height: 100, left: 50, top: 50 });
    group = new Group([groupRect], {
      interactive: true,
      subTargetCheck: true,
    });
    canvas.add(rect, group);
  });

  describe.for(points)(
    'For a cursor on %s and an object with center on 50,50 we expect %s',
    ([oCoord, expectedCursor]) => {
      test.for([
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ])('when flipX is %s and flipY is %s', ([flipX, flipY]) => {
        const pointerEvent = {} as TPointerEvent;
        rect.set({ flipX, flipY });
        groupRect.set({ flipX, flipY });
        const res = scaleSkewCursorStyleHandler(
          pointerEvent,
          rect.controls.tr,
          rect,
          oCoord as TOCoord,
        );
        expect(res).toBe(expectedCursor);
        const resGroup = scaleSkewCursorStyleHandler(
          pointerEvent,
          groupRect.controls.tr,
          groupRect,
          oCoord as TOCoord,
        );
        expect(resGroup).toBe(expectedCursor);
      });
    },
  );
});
