import { loadSVGFromString } from '../../fabric';
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
});
