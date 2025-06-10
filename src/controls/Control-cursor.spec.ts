import { describe, expect, it } from 'vitest';
import { scaleSkewCursorStyleHandler } from './scaleSkew';
import type { TPointerEvent } from '../../fabric';
import { Group } from '../shapes/Group';
import { Canvas } from '../canvas/Canvas';
import { Rect } from '../shapes/Rect';

describe('fabric.controls.cursor', () => {
  const canvas = new Canvas(undefined);
  const rect = new Rect({ width: 100, height: 100 });
  const groupRect = new Rect({ width: 100, height: 100 });
  const group = new Group([groupRect], {
    interactive: true,
    subTargetCheck: true,
  });
  canvas.add(rect, group);

  const cornerControls = ['tl', 'tr', 'br', 'bl'];

  function makeEventData(clientX: number, clientY: number) {
    return {
      clientX,
      clientY,
    } as TPointerEvent;
  }

  function test(target: Rect) {
    const topRightEventData = makeEventData(1000, -1000);
    const bottomRightEventData = makeEventData(1000, 1000);
    const bottomLeftEventData = makeEventData(-1000, 1000);
    const topLeftEventData = makeEventData(-1000, -1000);
    const list = [
      { eventData: topRightEventData, cursor: 'ne-resize' },
      { eventData: bottomRightEventData, cursor: 'se-resize' },
      { eventData: bottomLeftEventData, cursor: 'sw-resize' },
      { eventData: topLeftEventData, cursor: 'nw-resize' },
    ];

    for (const item of list) {
      const { eventData, cursor } = item;
      for (const name of cornerControls) {
        const res = scaleSkewCursorStyleHandler(
          eventData,
          target.controls[name],
          target,
        );
        expect(res).toBe(cursor);
      }
    }
  }

  it('scaleSkewCursorStyleHandler', () => {
    const angle = Math.random() * 360;
    const groupAngle = Math.random() * 360;
    rect.set('angle', angle);
    groupRect.set('angle', angle);
    group.set('angle', groupAngle);
    const list = [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ];
    for (const [flipX, flipY] of list) {
      rect.set({ flipX, flipY });
      groupRect.set({ flipX, flipY });

      test(rect);
      test(groupRect);
    }
  });
});
