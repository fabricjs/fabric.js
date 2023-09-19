import { CircleBrush } from './CircleBrush';
import { Canvas } from '../canvas/Canvas';

describe('CircleBrush', () => {
  it('can be initialized', () => {
    const canvas = new Canvas('test', {});
    const circleBrush = new CircleBrush(canvas);
    expect(circleBrush instanceof CircleBrush).toBe(true);
    expect(circleBrush.points).toEqual([]);
  });
});
