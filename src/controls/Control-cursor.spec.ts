import { describe, expect, it } from 'vitest';
import { scaleSkewCursorStyleHandler } from './scaleSkew';
import type { TPointerEvent } from '../../fabric';
import { Group } from '../shapes/Group';
import { Canvas } from '../canvas/Canvas';
import { Rect } from '../shapes/Rect';

describe('fabric.controls.cursor', () => {
  const canvas = new Canvas(undefined);
  const eventData = {} as TPointerEvent;
  const rect = new Rect({ width: 100, height: 100 });
  const groupRect = new Rect({ width: 100, height: 100 });
  const group = new Group([groupRect], {
    interactive: true,
    subTargetCheck: true,
  });
  canvas.add(rect, group);

  const controlArr = ['tl', 'mt', 'tr', 'mr', 'br', 'mb', 'bl', 'ml'];
  const cursorArr = [
    'nw-resize',
    'n-resize',
    'ne-resize',
    'e-resize',
    'se-resize',
    's-resize',
    'sw-resize',
    'w-resize',
  ];
  function test(target: Rect, angle = 0) {
    // const angle = target.getTotalAngle() + (!!target.group && target.flipX ? 180 : 0);
    const offset = Math.round((angle + 360) / 45);
    for (let i = 0; i < controlArr.length; i++) {
      const index = (i + offset) % controlArr.length;
      const cursor = scaleSkewCursorStyleHandler(
        eventData,
        target.controls[controlArr[i]],
        target,
      );
      expect(cursor).toBe(cursorArr[index]);
    }
  }

  it('scaleSkewCursorStyleHandler', () => {
    const angle = Math.random() * 360;
    const groupAngle = Math.random() * 360;
    const groupRectAngle = angle + groupAngle;
    rect.set('angle', angle);
    groupRect.set('angle', angle);
    group.set('angle', groupAngle);

    rect.set({ flipX: false, flipY: false });
    groupRect.set({ flipX: false, flipY: false });
    test(rect, angle);
    test(groupRect, groupRectAngle);

    rect.set({ flipX: false, flipY: true });
    groupRect.set({ flipX: false, flipY: true });
    test(rect, angle);
    test(groupRect, groupRectAngle);

    rect.set({ flipX: true, flipY: false });
    groupRect.set({ flipX: true, flipY: false });
    test(rect, angle);
    test(groupRect, groupRectAngle);

    rect.set({ flipX: true, flipY: true });
    groupRect.set({ flipX: true, flipY: true });
    test(rect, angle);
    test(groupRect, groupRectAngle);
  });
});
