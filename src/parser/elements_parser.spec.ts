import { loadSVGFromString } from '../../fabric';
import { describe, it, expect } from 'vitest';

describe('ElementsParser', () => {
  describe('clipPath handling', () => {
    it('should not enter infinite loop with nested duplicated clipPath', async () => {
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
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
      expect(objects[0]!.clipPath).toBeDefined();
    });

    it('should handle triple nested clipPath references', async () => {
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" width="100px" height="100px" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
        <clipPath id="clip1">
            <circle cx="50" cy="50" r="40" />
        </clipPath>
    </defs>

    <g clip-path="url(#clip1)">
        <g clip-path="url(#clip1)">
            <g clip-path="url(#clip1)">
                <rect
                    width="80"
                    height="80"
                    fill="blue"
                />
            </g>
        </g>
    </g>
</svg>`;
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
    });

    it('should handle different clipPaths at different levels', async () => {
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" width="100px" height="100px" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
        <clipPath id="clip1">
            <circle cx="50" cy="50" r="40" />
        </clipPath>
        <clipPath id="clip2">
            <rect x="10" y="10" width="80" height="80" />
        </clipPath>
    </defs>

    <g clip-path="url(#clip1)">
        <g clip-path="url(#clip2)">
            <rect
                width="60"
                height="60"
                fill="green"
            />
        </g>
    </g>
</svg>`;
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
    });

    it('should handle clipPath with multiple shapes', async () => {
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" width="200px" height="200px" viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
        <clipPath id="multiShape">
            <circle cx="50" cy="50" r="40" />
            <rect x="100" y="0" width="50" height="50" />
        </clipPath>
    </defs>

    <g clip-path="url(#multiShape)">
        <g clip-path="url(#multiShape)">
            <rect
                width="200"
                height="200"
                fill="purple"
            />
        </g>
    </g>
</svg>`;
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
    });

    it('should handle missing clipPath gracefully', async () => {
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" width="100px" height="100px" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#nonExistent)">
        <rect
            width="50"
            height="50"
            fill="orange"
        />
    </g>
</svg>`;
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeUndefined();
    });

    it('should handle clipPath on element directly', async () => {
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" width="100px" height="100px" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
        <clipPath id="directClip">
            <circle cx="50" cy="50" r="45" />
        </clipPath>
    </defs>

    <rect
        clip-path="url(#directClip)"
        width="100"
        height="100"
        fill="yellow"
    />
</svg>`;
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
    });
  });
});
