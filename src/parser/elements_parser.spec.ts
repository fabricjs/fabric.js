import { Gradient, loadSVGFromString } from '../../fabric';
import { describe, it, expect } from 'vitest';

describe('Parser', () => {
  it('should not enter an infinite loop with nested duplicated clipPath', async () => {
    const svg = `
<svg version="1.1" width="100px" height="100px" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <clipPath id="i0">
            <circle cx="0" cy="0" r="50" />
        </clipPath>
    </defs>

    <g clip-path="url(#i0)">
        <g clip-path="url(#i0)">
            <rect
                width="50"
                height="50"
                fill="red"
            />
        </g>
    </g>
</svg>`;
    const { objects } = await loadSVGFromString(svg);
    expect(objects).toHaveLength(1);
  });

  it('should not throw when gradient is missing', async () => {
    const svg = `
<svg version="1.1" width="100px" height="100px" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g fill="url(#non-existent-gradient)">
        <rect
            width="50"
            height="50"
            fill="red"
        />
    </g>
</svg>`;
    const { objects } = await loadSVGFromString(svg);
    expect(objects).toHaveLength(1);
    expect(typeof objects[0]!.fill).toBe('string');
    expect(objects[0]!.fill).toBe('red');
  });

  it('should correctly parse a valid gradient', async () => {
    const svg = `
<svg version="1.1" width="100px" height="100px" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <linearGradient id="myGradient">
            <stop offset="0%" stop-color="red" />
            <stop offset="100%" stop-color="blue" />
        </linearGradient>
    </defs>
    <rect x="10" y="10" width="80" height="80" fill="url(#myGradient)" />
</svg>`;
    const { objects } = await loadSVGFromString(svg);
    expect(objects).toHaveLength(1);
    const rect = objects[0];
    expect(rect!.fill).toBeInstanceOf(Gradient);
    const gradient = rect!.fill as Gradient<'linear'>;
    expect(gradient.type).toBe('linear');
    expect(gradient.colorStops).toHaveLength(2);
    const colors = gradient.colorStops.map((cs) => cs.color);
    expect(colors).toContain('rgba(255,0,0,1)');
    expect(colors).toContain('rgba(0,0,255,1)');
  });
});
