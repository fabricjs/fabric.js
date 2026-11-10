import { describe, expect, it } from 'vitest';
import { Rect } from '../../shapes/Rect';
import { Group } from '../../shapes/Group';
import { mergeClipPaths } from './mergeClipPaths';

describe('mergeClipPaths', () => {
  it('mergeClipPaths', () => {
    const rectA = new Rect({
      width: 100,
      height: 100,
      scaleX: 2,
      skewX: 3,
      angle: 10,
    });
    const clipPathA = new Group([rectA], { scaleY: 3, angle: -18 });
    const rectB = new Rect({
      left: 1,
      width: 100,
      height: 100,
      scaleY: 2.4,
      skewX: 3,
      skewY: 5,
      angle: 10,
    });
    const clipPathB = new Group([rectB], { skewX: 34, angle: 36 });
    const result = mergeClipPaths(clipPathA, clipPathB);
    const resultingMatrix = result.clipPath!.calcTransformMatrix();
    const expectedMatrix = roundArray([
      0.5877852522924731, 0.2696723314583158, -0.41255083562929973,
      // changes when swapping the default centers
      0.37782470175621224, 0.9511 /*-149.58276216465225 */,
      0.103 /* -0.7631646697634125 */,
    ]);
    expect(result.inverted, 'the final clipPathB is not inverted').toBe(false);
    expect(result.clipPath, 'clipPathB is the final clipPath').toBe(clipPathB);
    expect(
      roundArray(resultingMatrix),
      'the clipPath has a new transform',
    ).toEqual(expectedMatrix);
  });

  it('mergeClipPaths with swapping', () => {
    const rectA = new Rect({
      width: 100,
      height: 100,
      scaleX: 2,
      skewX: 3,
      angle: 10,
    });
    const clipPathA = new Group([rectA], {
      scaleY: 3,
      angle: -18,
      inverted: true,
    });
    const rectB = new Rect({
      width: 100,
      height: 100,
      scaleY: 2.4,
      skewX: 3,
      skewY: 5,
      angle: 10,
    });
    const clipPathB = new Group([rectB], { skewX: 34, angle: 36 });
    const result = mergeClipPaths(clipPathA, clipPathB);
    const resultingMatrix = result.clipPath!.calcTransformMatrix();
    const expectedMatrix = roundArray([
      1.1334741052686363, -0.8090169943749471, 1.237652506887899,
      // changes when swapping origins defaults
      1.7633557568774187, 0 /* 170.49272017489145 */,
      0 /* -119.66926584287677 */,
    ]);
    expect(result.inverted, 'the final clipPathA is not inverted').toBe(false);
    expect(result.clipPath, 'clipPathA is the final clipPath').toBe(clipPathA);
    expect(
      roundArray(resultingMatrix),
      'the clipPath has a new transform',
    ).toEqual(expectedMatrix);
  });

  it('mergeClipPaths with both inverted', () => {
    const rectA = new Rect({
      width: 100,
      height: 100,
      scaleX: 2,
      skewX: 3,
      angle: 10,
    });
    const clipPathA = new Group([rectA], {
      scaleY: 3,
      angle: -18,
      inverted: true,
    });
    const rectB = new Rect({
      width: 100,
      height: 100,
      scaleY: 2.4,
      skewX: 3,
      skewY: 5,
      angle: 10,
    });
    const clipPathB = new Group([rectB], {
      skewX: 34,
      angle: 36,
      inverted: true,
    });
    const result = mergeClipPaths(clipPathA, clipPathB);
    expect(result.inverted, 'the final clipPathB is inverted').toBe(true);
    expect(result.clipPath, 'clipPathB is the final clipPath').toBe(clipPathB);
  });
});

function roundArray(array: number[]): string[] {
  return array.map((val) => val.toFixed(4));
}
