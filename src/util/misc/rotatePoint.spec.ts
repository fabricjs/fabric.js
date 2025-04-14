import { rotatePoint } from './rotatePoint';
import { Point } from '../../Point';
import { describe, expect, it } from 'vitest';

describe('rotatePoint', () => {
  it('rotates points around an origin correctly', () => {
    const origin = new Point(3, 0);
    const point = new Point(4, 0);

    const rotated180 = rotatePoint(point, origin, Math.PI);
    expect(Math.round(rotated180.x)).toBe(2);
    expect(Math.round(rotated180.y)).toBe(0);

    const rotated90 = rotatePoint(point, origin, Math.PI / 2);
    expect(Math.round(rotated90.x)).toBe(3);
    expect(Math.round(rotated90.y)).toBe(1);
  });
});
